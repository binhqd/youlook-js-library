/**/
;(function($, scope) {
	scope['photo'] = {
		mainContainer : null,
		photoContainer : null,
		loadAlbumFromPhoto : false,
		eventJs	: false,
		photoUrl: '',
		config: {
			limit : 12
		},
		init: function() {
			this.photoUrl = homeURL + "/" + zone.zonetype.config.homeURI + "?id=" + zoneid + "&tab=album";
			this.mainContainer = $('#movie-container-photos');
			this.photoContainer = this.mainContainer.find('ul.wd-type-view-all-photo');
			this.iconLoading = '<div class="js-loading" style="text-align: center;"><img alt="Loading" src="'+homeURL+'/myzone_v1/img/front/ajax-loader.gif" > <span> Loading...</span></div>';
		},
		History : {
			go : function(url) {
				if (!zone.zonetype.photo.loadAlbumFromPhoto) {
					window.location = url;
				} else {
					zone.zonetype.formAddPhoto.Actions.cancel();
					history.back();
				}
				$('#txtAlbumTitle').val('');
			}
		},
		Pagination : {
			setup : function(pathPart, queryPart, pages, callback) {
				if (typeof pages == "undefined") {
					console.log("Invalid page number");
					pages = 1;
				}

				zone.zonetype.photo.photoContainer.infinitescroll({
					navSelector  : '#' + zone.zonetype.photo.mainContainer.attr('id') + ' .page-infinitive-nav',	// selector for the paged navigation
					nextSelector : '#' + zone.zonetype.photo.mainContainer.attr('id') + ' .page-infinitive-nav a',  // selector for the NEXT link (to page 2)
					//itemSelector : 'li.movie-photo-item',	 // selector for all items you'll retrieve
					//debug:true,
					dataType:'json',
					maxPage: pages,
					appendCallback:false,
					pixelsFromNavToBottom : $(document).height() - $('#' + zone.zonetype.photo.mainContainer.attr('id') + ' .page-infinitive-nav').offset().top - 120,
					path : [pathPart, queryPart],
					loading: {
						finishedMsg: 'No more pages to load.',
						img: homeURL+'/myzone_v1/img/front/ajax-loader.gif'
					}
				},function(res) {
						if (typeof callback != "function") {
							console.log("Invalid callback for infinite scroll");
						} else {
							callback(res);
							/*Tooltip*/
							$('.wd-tooltip-hover').tipsy({gravity: 's'});
						}
					}
				);
			}
		},
		Actions: {
			renderPhoto : function(photoData) {
				var photo = $('#tmplMoviePhotos').tmpl(photoData);
				zone.zonetype.photo.photoContainer.append(photo);
				
				// Add view album event
				photo.find('a.link-album').click(function() {
					/*Set photo init*/
					zone.photo.init();

					var href = $(this).attr('href');
					var type = $(this).attr('type');
					var title= $(this).attr('title');
					
					/*Call event unit*/
					zone.zonetype.photo.Events.unit();
					zone.zonetype.formAddPhoto.Actions.cancel();
					$('.js-title-album').val('' + title);

					if (type == 'album') {
						var albumID = $(this).attr('data-id');
						zone.zonetype.photo.Actions.loadPhotosOfAlbum(albumID);
					} else {
						zone.zonetype.photo.Actions.loadDirectPhotosOfNode(zoneid);
					}
					/*Push state url*/
					zone.zonetype.History.pushState(href);

					zone.zonetype.photo.loadAlbumFromPhoto = true;
					return false;
				});
			},
			showContainer : function() {
				zone.zonetype.photo.mainContainer.show();
			},
			hideForm : function() {
				// Misc
				$('#pull-form-upload').hide();
				$('#infscr-loading-first').hide();
			},
			loadPhotosOfAlbum : function(album_id) {
				var url = homeURL + '/api/photo/photosOfAlbum?album_id='+album_id+'&limit='+zone.zonetype.photo.config.limit+'&page=1';
				$('#formAddAlbumPhotos').append('<input type="hidden" name="album_id" value="' + album_id + '">');
				$.ajax({
					url 	: url,
					dataType: 'JSON',
					success : function(res) {
						zone.zonetype.photo.photoContainer.find('div.js-loading').remove();
						jQuery.each( res.photos || [], function( i, val ) {
							// render photo
							val.ignoreAlbum = true;
							zone.zonetype.photo.Actions.renderPhoto(val);
							/*Make index*/
							zone.photo.photoIndex.push(val.photo.id);
							/*Make total photo*/
							zone.photo.totalPhoto = res.total;
							$('.lnkViewPhotoDetail').attr('number_end',zone.photo.totalPhoto);
						});
						// render title
						var heading = $("<a href=\"javascript:zone.zonetype.photo.History.go('"+homeURL+"/movie?id="+zoneid+"&tab=photos')\" class=\"view-page-photo js-view-page-photo\">Photos: </a> <span class=\"wd-name-album\">"+res.album.title+"</span>");
						zone.zonetype.photo.mainContainer.find('.js-name-album').html('').append(heading);

						var pathPart = homeURL + '/api/photo/photosOfAlbum?page=';
						var queryPart = '&album_id='+album_id+'&limit='+zone.zonetype.photo.config.limit;
						
						var pages = Math.ceil(res.total / zone.zonetype.photo.config.limit);

						zone.zonetype.photo.Pagination.setup(pathPart, queryPart, pages, function(res) {
							jQuery.each( res.photos || [], function( i, val ) {
								// render photo
								val.ignoreAlbum = true;
								zone.zonetype.photo.Actions.renderPhoto(val);
								/*Make index*/
								zone.photo.photoIndex.push(val.photo.id);
								/*Make total photo*/
								zone.photo.totalPhoto = res.total;
								$('.lnkViewPhotoDetail').attr('number_end',zone.photo.totalPhoto);
							});
						});
						/*Tooltip*/
						$('.wd-tooltip-hover').tipsy({gravity: 's'});
					}
				});
			},
			loadDirectPhotosOfNode : function(zoneid) {
				var url = homeURL + '/api/node/photos?id='+zoneid+'&limit='+zone.zonetype.photo.config.limit+'&page=1&direct=true';
				$.ajax({
					url 	: url,
					dataType: 'JSON',
					success : function(res) {
						zone.zonetype.photo.photoContainer.find('div.js-loading').remove();
						jQuery.each( res.photos || [], function( i, val ) {
							// render photo
							val.ignoreAlbum = true;
							zone.zonetype.photo.Actions.renderPhoto(val);
							/*Make index*/
							zone.photo.photoIndex.push(val.photo.id);
							/*Make total photo*/
							zone.photo.totalPhoto = res.total;
							$('.lnkViewPhotoDetail').attr('number_end',zone.photo.totalPhoto);
						});

						// Render title
						var heading = $("<a href=\"javascript:zone.zonetype.photo.History.go('"+homeURL+"/movie?id="+zoneid+"&tab=photos')\" class=\"view-page-photo js-view-page-photo\">Photos: </a> <span class=\"wd-name-album\">Untitled</span>");
						zone.zonetype.photo.mainContainer.find('.js-name-album').html('').append(heading);

						var pathPart = homeURL + '/api/node/photos?page=';
						var queryPart = '&id='+zoneid+'&limit='+zone.zonetype.photo.config.limit+'&direct=true';
						
						var pages = Math.ceil(res.total / zone.zonetype.photo.config.limit);
						zone.zonetype.photo.Pagination.setup(pathPart, queryPart, pages, function(res) {
							jQuery.each( res.photos || [], function( i, val ) {
								// Render photo
								val.ignoreAlbum = true;
								zone.zonetype.photo.Actions.renderPhoto(val);
								/*Make index*/
								zone.photo.photoIndex.push(val.photo.id);
								/*Make total photo*/
								zone.photo.totalPhoto = res.total;
								$('.lnkViewPhotoDetail').attr('number_end',zone.photo.totalPhoto);
							});
						});
						/*Tooltip*/
						$('.wd-tooltip-hover').tipsy({gravity: 's'});
					}
				});
			},
			loadPhotos: function(url) {
				$.ajax({
					url 	: homeURL + '/api/node/photos?id='+zoneid+'&limit='+zone.zonetype.photo.config.limit+'&page=1&albumInfo=true',
					dataType: 'JSON',
					success : function(res) {
						zone.zonetype.photo.photoContainer.find('div.js-loading').remove();
						jQuery.each( res.photos || [], function( i, val ) {
							// render photo
							zone.zonetype.photo.Actions.renderPhoto(val);
							if(i==0) {
								$(".js-make-primary[ref='"+val.photo.id+"']").removeClass('wd-icon-make-primary-avatar js-make-primary').addClass('wd-icon-make-primary-avatar-act');
							}
						});

						// render title
						var heading = $("<a href=\"javascript:void(0)\" class=\"view-page-photo\">Photos</a>");
						zone.zonetype.photo.mainContainer.find('.js-name-album').html('').append(heading);

						var pathPart = homeURL + '/api/node/photos?page=';
						var queryPart = '&id='+zoneid+'&limit='+zone.zonetype.photo.config.limit+'&albumInfo=true';

						var pages = Math.ceil(res.total / zone.zonetype.photo.config.limit);
						zone.zonetype.photo.Pagination.setup(pathPart, queryPart, pages, function(res) {
							jQuery.each( res.photos || [], function( i, val ) {
								// Render photo
								zone.zonetype.photo.Actions.renderPhoto(val);
							});
						});
						/*Tooltip*/
						$('.wd-tooltip-hover').tipsy({gravity: 's'});
						$(".js-view-page-photo").removeAttr("onclick").css("pointer-events","auto").addClass("view-page-photo");
					}
				});
				
			},
			hidePhoto:function(_url,_this){
				var _this = $(_this);
				jConfirm('Are you sure you want to delete this photo?', 'Delete photo', function(r) {
					if(r){
						$.ajax({
							type	:"POST",
							url		: _url,
							dataType: 'JSON',
							success	:function(res){
								if(res.error){
									console.log(res.message);
								}else{
									$("#"+_this.attr('ref')).animate({
										opacity:0
									},500,function(e){
										/*Remove tooltip*/
										$('.tipsy-south').remove();
										$(this).remove();
									});
									var total_photo_current = $("span.js-number-photo").text();
									$("span.js-number-photo").text(total_photo_current - 1);
								}
								//$('span.js-number-photo').html($('span.js-number-photo').text() - 1);
								//$('#oImage').find('img').attr('src',homeURL + 'upload/gallery/fill/308-465/'+res.photo.photo.image+'?album_id='+res.photo.photo.album_id);
								zone.databinding.find(".nodeAvatar").bind({ 
									data : {
										user : {
											id : res.photo.photo.album_id,
											profile : {
												image : res.photo.photo.image
											}
										}
									}
								});

								/** Make number-index */
								var index = zone.photo.photoIndex.indexOf(_this.attr('ref'));
								zone.photo.photoIndex.splice(index,1);

								/** Make total photo */
								var photoItem = _this.parents('.youlook-photo-item');
								var containerPhotos = _this.parents('.youlook-photo-item').parent();
								var countPhotos = containerPhotos.find("li[album_id='" + photoItem.attr('album_id') + "']");
								
								countPhotos.each(function( index, element ){
									$(this).find('.lnkViewPhotoDetail').attr('number_end',countPhotos.length-1);
								});

								/** Empty cache */
								zone.photo._caches = {};

								/*Set offset photo load*/
								--zone.photo.offsetPhotoLoad; 

								/*Tooltip*/
								//$('.wd-tooltip-hover').tipsy({gravity: 's'});
							},error: function (xhr, ajaxOptions, thrownError) {
								console.log(xhr.responseText);
							}
						});
					}
				});	
				return false;
			},
			hideAlbum:function(_url,_this,_type){
				if(zone.zonetype.photo.eventJs){
					return false;
				}
				zone.zonetype.photo.eventJs = true;
				var _this = $(_this);
				if(_type !="undefined" && _type == "photos") {
					var strComfirm = "Are you sure you want to delete this photos?";
					var strTitle = "Delete photos";
				}else {
					var strComfirm = "Are you sure you want to delete this album?";
					var strTitle = "Delete album";
				}
				jConfirm(strComfirm, strTitle, function(r) {
					if(r){
						$.ajax({
							type	: "POST",
							url		: _url,
							dataType: 'JSON',
							success	:function(res){
								if(res.error){
									console.log(res.message);
								}else{
									$("#"+_this.attr('ref')).animate({
										opacity:0
									},500,function(e){
										/*Remove tooltip*/
										$('.tipsy-south').remove();
										$(this).remove();
									});
									
									console.log(res);
									
									var total_photo_current = parseInt($("span.js-number-photo").text());
									
									console.log(total_photo_current);
									console.log(res.countPhotoDelete);
									console.log(total_photo_current - res.countPhotoDelete);
									
									$("span.js-number-photo").text(total_photo_current - res.countPhotoDelete);
								}
								--zone.photo.offsetAlbumLoad;
								zone.zonetype.photo.eventJs = false;
							},error: function (xhr, ajaxOptions, thrownError) {
								console.log(xhr.responseText);
							}
						});
					}
				});	
				return false;
			},
			makePrimary:function(_url,_this){
				var _this = $(_this);
				jConfirm('Are you sure you want to make primary photo?', 'Make primary photo', function(r) {
					if(r){
						$.ajax({
							type	:"POST",
							url		: _url,
							dataType:'JSON',
							success	:function(res){
								if(res.error){
									console.log(res.message);
								}else{
									$("#"+_this.attr('ref')).animate({
										opacity:0
									},100,function(e){
										/*Remove tooltip*/
										$('.tipsy-south').remove();
										$(this).remove();
									});

									if($("#formAddAlbumPhotos").find("input[name='album_id']").length > 0) {
										res.photo['ignoreAlbum'] = true;
									}

									var photo = $('#tmplMoviePhotos').tmpl(res.photo);
									zone.zonetype.photo.photoContainer.prepend(photo);

									photo.find('a.link-album').click(function() {
										/*Set photo init*/
										zone.photo.init();

										var href = $(this).attr('href');
										var type = $(this).attr('type');
										var title= $(this).attr('title');
										
										/*Call event unit*/
										zone.zonetype.photo.Events.unit();
										zone.zonetype.formAddPhoto.Actions.cancel();
										$('.js-title-album').val('' + title);

										if (type == 'album') {
											var albumID = $(this).attr('data-id');
											zone.zonetype.photo.Actions.loadPhotosOfAlbum(albumID);
										} else {
											zone.zonetype.photo.Actions.loadDirectPhotosOfNode(zoneid);
										}
										/*Push state url*/
										zone.zonetype.History.pushState(href);

										zone.zonetype.photo.loadAlbumFromPhoto = true;
										return false;
									});

									//$('#oImage').find('img').attr('src',homeURL + 'upload/gallery/fill/308-465/'+res.photo.photo.image+'?album_id='+res.photo.photo.album_id);
									zone.databinding.find(".nodeAvatar").bind({ 
										data : {
											user : {
												id : res.photo.photo.album_id,
												profile : {
													image : res.photo.photo.image
												}
											}
										}
									});
	
									$(".wd-icon-make-primary-avatar-act").addClass('wd-icon-make-primary-avatar js-make-primary').removeClass('wd-icon-make-primary-avatar-act');
									$(".js-make-primary[ref='"+res.photo.photo.id+"']").removeClass('wd-icon-make-primary-avatar js-make-primary').addClass('wd-icon-make-primary-avatar-act');

									/*Remove number-index*/
									var index = zone.photo.photoIndex.indexOf(res.photo.photo.id);
									zone.photo.photoIndex.splice(index,1);
									/*Make index*/
									zone.photo.photoIndex.unshift(res.photo.photo.id);
									$(".lnkViewPhotoDetail[photo_id='"+res.photo.photo.id+"']").attr('number_end',zone.photo.totalPhoto);

									/*Empty cache*/
									zone.photo._caches = {};
									/*Tooltip*/
									$('.wd-tooltip-hover').tipsy({gravity: 's'});
								}
							},error: function (xhr, ajaxOptions, thrownError) {
								console.log(xhr.responseText);
							}
						});
					}
				});	
				return false;
			}
		},
		Events : {
			unit : function(){
				$("html, body").animate({scrollTop: "310px"}, 1000);
				$('.page-container').hide();
				zone.zonetype.photo.Actions.hideForm();
				zone.zonetype.photo.photoContainer.html('');
				zone.zonetype.photo.Actions.showContainer();
				zone.zonetype.photo.photoContainer.append(zone.zonetype.photo.iconLoading);

				/*Destroy infinitscroll*/
				zone.zonetype.photo.photoContainer.infinitescroll('destroy');
				zone.zonetype.photo.photoContainer.data('infinitescroll', null);
			}
		}
	};
})(jQuery, zone['zonetype']);

;(function($, scope) {
	scope['formAddPhoto'] = {
		doneUpload : $("#btnPostAlbumPhoto"),
		init: function() {
			$(document).on("click", '#add-photos',function(e) {
				$('#pull-form-upload').find("input[name='files[]']").trigger('click');
				zone.zonetype.formAddPhoto.Event.showContainerUpload();
				var _title = $("#txtAlbumTitle").val();
				if(typeof _title == "undefined" || _title == '') {
					var title = $('.wd-name-album').text();
					if(typeof title != undefined && title != '') {
						$('.js-title-album').val('' + title);
						
					}
				}
				if(objCountFile.photo.addFile == 0)
					$("#containerPostedPhotos").css("height","0px");
			});

			/*$("#txtAlbumTitle").on("keyup", function(e) {
				if (e.keyCode == 13) {
					zone.zonetype.formAddPhoto.doneUpload.trigger("click");
				}
			});*/

			$("#btnCancelPhotoForm").on("click", function(e) {
				zone.zonetype.formAddPhoto.Actions.cancel($(this).attr('token'));
			});

			zone.zonetype.formAddPhoto.doneUpload.on("click", function(e) {
				zone.zonetype.formAddPhoto.Actions.submit($(this));
			});

			

		},
		Actions: {
			done: function(res, token, frmUpload, is_album) {
				/*Hide form add*/
				zone.zonetype.formAddPhoto.Actions.cancel(token);

				$("#photo-not-found").remove();

				if(is_album) {
					var _text = res.album.title;
					$(".js-name-album .wd-name-album").text(_text);
					$('#formAddAlbumPhotos #txtAlbumTitle').val(_text);
				}

				jQuery.each( res.photos || [], function( i, val ) {
					if(is_album) {
						val.ignoreAlbum = true;
					}
					var photos = $.tmpl($("#tmplMoviePhotos"), val);
					$("ul.wd-type-view-all-photo").prepend(photos);
					/*Make index*/
					zone.photo.photoIndex.unshift(val.photo.id);
				});
				/*Empty cache*/
				zone.photo._caches = {};
				/*Tooltip*/
				$('.wd-tooltip-hover').tipsy({gravity: 's'});
			},
			cancel: function(token) {
				if($("#formAddAlbumPhotos input[name='album_id']").length == 0) {
					$('#txtAlbumTitle').val('');
				}
				$("[id*='pushImages']").empty();
				$("[id*='filesContainer']").empty();
				$("#btnPostAlbumPhoto").attr("disabled", "disabled");
				objCountFile.photo.addFile = 0;
				objCountFile.photo.doneFile = 0;
				zone.zonetype.formAddPhoto.Event.hideContainerUpload();
			},
			validate: function(_this) {
				var content = $('#txtAlbumTitle').val();
				if ($.trim(content) == "") {
					$('#txtAlbumTitle').focus();
					return false;
				} else {
					return true;
				}
			},
			submit: function(_this) {
				var _type = _this.attr('data-type');
				if(_type != 'undefined' && _type == "node") 
				{
					//var validate = zone.zonetype.formAddPhoto.Actions.validate(_this);
					if (objCountFile.photo.addFile != 0)
						$("#btnPostAlbumPhoto").removeAttr("disabled");
					else {
						$("#btnPostAlbumPhoto").attr("disabled", "disabled");
						return false;
					}
					$("#btnPostAlbumPhoto").attr("disabled", "disabled");
					var _token = _this.attr('token');
					var frmUpload = $("#formAddAlbumPhotos");
					$.ajax({
						type	: "POST",
						url		: frmUpload.attr('action'),
						dataType: 'JSON',
						data	: frmUpload.serialize(),
						success	: function(res) {
							if (res.error) {
							} else {
								var is_album = false;
								if($("#formAddAlbumPhotos").find("input[name='album_id']").length > 0)
									is_album = true;
								zone.zonetype.formAddPhoto.Actions.done(res, _token, frmUpload,is_album);
							}
						},
						error: function(xhr, ajaxOptions, thrownError) {
							console.log(xhr.responseText);
							$("#btnPostAlbumPhoto").removeAttr("disabled");
						}
					});
				}
			}
		},
		Event: {
			showContainerUpload: function() {
				$("#pull-form-upload").fadeIn(1000);
			},
			hideContainerUpload: function() {
				$("#pull-form-upload").fadeOut(1000);
			},
			clientRemovePhotos: function(_this, token) {
				jConfirm('Are you sure you want to delete photo?', 'Delete photo', function(r) {
					if(r){
						--objCountFile.photo.addFile;  
						--objCountFile.photo.doneFile;

						var fileid = _this.attr("id");
						$("#formAddAlbumPhotos[token='"+token+"'] input[value='"+fileid+"']").remove();
						_this.parent().remove();
						try {
							$("#containerPostedPhotos").data("jsp").destroy();
						} catch (e) {
						}
		
						var _tmpWidth = (69 * objCountFile.photo.addFile) - (objCountFile.photo.addFile*2);
						$(".pullScroll").css({width: (_tmpWidth) + "px"});
						$('.js-composer-photopost-content .jsContainer').css({width:(_tmpWidth) + "px"});
						zone.zonetype.formAddPhoto.Event.scrollFormPost();

						//var validate = zone.zonetype.formAddPhoto.Actions.validate();
						if (objCountFile.photo.addFile != 0 && objCountFile.photo.addFile == objCountFile.photo.doneFile) {
							$("#btnPostAlbumPhoto").removeAttr("disabled");
						}
						else {
							$("#btnPostAlbumPhoto").attr("disabled", "disabled");
						}
						if(objCountFile.photo.addFile <= 4) {
							$(".js-composer-photopost-content .jspHorizontalBar").remove();
						}
					}
				});
			},
			scrollFormPost: function() {
				$("#containerPostedPhotos").jScrollPane({
					horizontalGutter: 5,
					verticalGutter: 0,
					mouseWheelSpeed: 50,
					autoReinitialise: true,
					showArrows: false
				});
			},
			destroyScroll: function() {
				try {
					$("#wd-pagelet-composer-photopost-content").data("jsp").destroy();
				} catch (e) {

				}
			}
		}
	};
})(jQuery, zone['zonetype']);