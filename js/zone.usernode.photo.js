/**/
;
(function($, scope) {
	scope['photo'] = {
		
		mainContainer : null,
		photoContainer : null,
		albumContainer : null,
		config: {
			limit	: 15,
			page	: 1,
			numberCurrent: 1,
			descriptionReadmore : {
				readMoreText	: 'Read more',
				readLessText	: 'Read less',
				numberOfWord	: 40,
				dot				: '...',
				readLess		: false,
				readMore		: false,
				readMoreSelector : '.cgn-readmore'
			}
		},
		init: function(options) {
			var _defaultOptions = {
				mainContainer 	: $('#photoMainContainer')
			};
			options = $.extend(true, {}, _defaultOptions, options);
			
			this.mainContainer = options.mainContainer;
			
			// photo container
			if (typeof options.photoContainer != "undefined") {
				this.photoContainer = options.photoContainer;
			} else {
				this.photoContainer = this.mainContainer.find('ul.photoContainer');
			}
			
			// albumContainer
			if (typeof options.albumContainer != "undefined") {
				this.albumContainer = options.albumContainer;
			} else {
				this.albumContainer = this.mainContainer.find('ul.albumContainer');
			}
		},
		destroy : function() {
			zone.usernode.photo.photoContainer.html('');
			zone.usernode.photo.photoContainer.infinitescroll('destroy');
			zone.usernode.photo.photoContainer.data('infinitescroll', null);
		},
		History : {
			go : function(url) {
//				if (!zone.usernode.photo.loadAlbumFromPhoto) {
//					window.location = url;
//				} else {
//					history.back();
//				}
			}
		},
		Actions: {
			loadProfilePhotos : function() {
				/*Load photo*/
				var _url = homeURL + '/api/userphoto/profilePhotos?page='+ zone.usernode.photo.config.page+'&id=' + viewingUser.id + '&limit=' + zone.usernode.photo.config.limit+'&offset=' + zone.photo.offsetPhotoLoad;
				$.ajax({
					type	: 'POST',
					dataType: 'JSON',
					url		: _url,
					success	: function(res){
						if(!res.error) {
							if(res != "undefined" && res != null){
								$('.js-loading').css({'display':'none'});
								if(res.total == 0 && zone.usernode.photo.config.page == 1) {
									var username = 'Your profile don\'t';
									if(res.displayname != null && res.displayname != user.displayname) {
										username = res.displayname + ' doesn\'t';;
									}
									$("#photo-not-found").show().find('p.js-message-not-photo').html('').append(username+' have any photo!');
								}else {
									var cnt = 0;
									jQuery.each( res.photos || [], function( i, val ) {
										/* render item*/
										zone.List.renderItem(val, {
											templateID : 'tmplUserPhotoItem',
											callback : function(renderedItem) {
												zone.usernode.photo.photoContainer.append(renderedItem);
												renderedItem.find('.timeago').timeago();
											}
										});
										if(i==0){
											$(".js-make-primary[ref='"+val.photo.id+"']").removeClass('wd-icon-make-primary-avatar js-make-primary').addClass('wd-icon-make-primary-avatar-act');
										}
										/*Make index*/
										zone.photo.photoIndex.push(val.photo.id);
										/*Make total photo*/
										zone.photo.totalPhoto = res.total;
										$('.lnkViewPhotoDetail').attr('number_end',zone.photo.totalPhoto);
										++cnt;
									});
									if(res.total > zone.usernode.photo.config.page*zone.usernode.photo.config.limit) {
										$('.js-loadmore-button').css({'display':'block'}).find('a').addClass('wd-bt-load-more');
										$('.js-loadmore-button').attr('data-type','profile');
									}else {
										$('.js-loadmore-button').css({'display':'none'}).find('a').removeClass('wd-bt-load-more');
									}
									/*Set offset photo load*/
									zone.photo.offsetPhotoLoad += cnt;
									/*Tooltip*/
									$('.wd-tooltip-hover').tipsy({gravity: 's'});
								}
							}
						}else {
							console.log(res.message);
						}
						$(".js-view-profile-photos").removeAttr("onclick").css("pointer-events","auto").addClass("viewProfilePhotos");
					}
				});
			},
			loadAlbums : function() {
				/*Load album*/
				var _url = homeURL + '/api/userphoto/albums?page='+ zone.usernode.photo.config.page+'&id=' + viewingUser.id + '&limit=' + zone.usernode.photo.config.limit + '&offset='+zone.photo.offsetAlbumLoad;
				$.ajax({
					type	: 'POST',
					dataType: 'JSON',
					url		: _url,
					success	: function(res){
						if(!res.error) {
							if(res != "undefined" && res != null){
								$('.js-loading').css({'display':'none'});
								if(res.total == 0 && zone.usernode.photo.config.page == 1) {
									var username = 'Your album don\'t';
									if(res.displayname != null && res.displayname != user.displayname) {
										username = res.displayname + ' doesn\'t';
									}
									$("#photo-not-found").show().find('p.js-message-not-photo').html('').append(username+'  have any photo!');
								}else {
									var cnt = 0;
									jQuery.each( res.albums || [], function( i, val ) {
										/*Render item*/
										zone.List.renderItem(val, {
											templateID : 'tmplAlbumItem',
											callback : function(renderedItem) {
												zone.usernode.photo.albumContainer.append(renderedItem);
												/* Set event listener for view album detail*/
												renderedItem.find('.viewAlbumDetail').on("click",function() {
													/*Set Photo Init*/
													zone.photo.init();
	
													zone.usernode.GUI.cleanup();
													zone.usernode.photo.GUI.showPhotoContainer();
													zone.usernode.GUI.clearPostPhotoForm();
													/*Title*/
													var title = $(this).attr('alt');
													$('.js-title-album').val(title);
													var album_id = $(this).attr('ref');
													/*Push state*/
													var stateURL = $(this).attr('href');
													zone.usernode.History.pushState(stateURL);
													//zone.History.pushState(stateURL);
													/*Call event unit*/
													$("html, body").animate({scrollTop: "200px"}, 1000);
													/*Append input album_id*/
													$('form#formAddAlbumPhotos').append('<input type="hidden" name="album_id" value="'+album_id+'">');
	
													$('.js-loading').css({'display':'block'});
													zone.usernode.photo.config.page = 1;
													zone.usernode.photo.Actions.loadAlbumDetail(album_id);
													return false;
												});
												renderedItem.find('.js-description-readmore').greennetExpand(zone.usernode.photo.config.descriptionReadmore);
											}
										});
										++cnt;
									});
									/*Set offset album load*/
									zone.photo.offsetAlbumLoad += cnt;
									if(res.total > zone.usernode.photo.config.page*zone.usernode.photo.config.limit) {
										$('.js-loadmore-button').css({'display':'block'}).find('a').addClass('wd-bt-load-more');
										$('.js-loadmore-button').attr('data-type','album');
									}else {
										$('.js-loadmore-button').css({'display':'none'}).find('a').removeClass('wd-bt-load-more');
									}
									/*Tooltip*/
									$('.wd-tooltip-hover').tipsy({gravity: 's'});
								}
							}
						}else {
							console.log(res.message);
						}
						$(".js-view-albums").removeAttr("onclick").css("pointer-events","auto").addClass("viewAlbums");
					}
				});
			},
			
			/** 
			 * Load photo of album 
			 * Edit by : Chu Tieu
			 */
			loadAlbumDetail : function(album_id) {
				
				var _url = homeURL + '/api/photo/photosOfAlbum?page='+ zone.usernode.photo.config.page+'&album_id=' + album_id + '&limit=' + zone.usernode.photo.config.limit + '&offset=' +zone.photo.offsetPhotoLoad;
				$.ajax({
					type	: 'POST',
					dataType: 'JSON',
					url		: _url,
					success	: function(res){
						if(!res.error) {
							if(res != "undefined" && res != null){
								$("#photo-not-found").hide();
								$('.js-loading').css({'display':'none'});
								$("#txtAlbumTitle").val(res.album.title);
								var cnt = 0;
								jQuery.each( res.photos || [], function( i, val ) {
									/** Render item*/
									zone.List.renderItem(val, {
										templateID : 'tmplPhotoItem',
										callback : function(renderedItem) {
											renderedItem.find('.timeago').timeago();
											zone.usernode.photo.photoContainer.append(renderedItem);
										}
									});
									/*Make index*/
									zone.photo.photoIndex.push(val.photo.id);
									++cnt;
								});
								/*Make total photo*/
								zone.photo.totalPhoto = res.total;
								$('.lnkViewPhotoDetail').attr('number_end',zone.photo.totalPhoto);
								/*Set offset photo load*/
								zone.photo.offsetPhotoLoad += cnt;

								if(res.total > zone.usernode.photo.config.page*zone.usernode.photo.config.limit) {
									$('.js-loadmore-button').css({'display':'block'}).find('a').addClass('wd-bt-load-more');
									$('.js-loadmore-button').attr({'data-type':'album-detail','album_id':album_id});
								}else {
									$('.js-loadmore-button').css({'display':'none'}).find('a').removeClass('wd-bt-load-more');
									$('.js-loadmore-button').removeAttr('album_id');
								}
								/*Tooltip*/
								$('.wd-tooltip-hover').tipsy({gravity: 's'});
							}
						}else {
							console.log(res.message);
						}
					}
				});
			},
			loadRelateds : function() {
				/*Load Related photos*/
				var _url = homeURL + '/api/userphoto/relatedPhotos?page='+ zone.usernode.photo.config.page+'&id=' + viewingUser.id + '&limit=' + zone.usernode.photo.config.limit;
				$.ajax({
					type	: 'POST',
					dataType: 'JSON',
					url		: _url,
					success	: function(res){
						if(!res.error) {
							if(res != "undefined" && res != null){
								/*Hide loading*/
								$('.js-loading').css({'display':'none'});

								if(res.total == 0 && zone.usernode.photo.config.page == 1) {
									var username = 'Your related don\'t';
									if(res.displayname != null && res.displayname != user.displayname) {
										username = res.displayname + ' doesn\'t';;
									}
									$("#photo-not-found").show().find('p.js-message-not-photo').html('').append(username+' have any photo!');
								}else {
									jQuery.each( res.photos || [], function( i, val ) {
										/* render item*/
										zone.List.renderItem(val, {
											templateID : 'tmplPhotoItem',
											callback : function(renderedItem) {
												zone.usernode.photo.photoContainer.append(renderedItem);
												renderedItem.find('.timeago').timeago();
											}
										});
									});
									if(res.total > zone.usernode.photo.config.page*zone.usernode.photo.config.limit) {
										$('.js-loadmore-button').css({'display':'block'}).find('a').addClass('wd-bt-load-more');
										$('.js-loadmore-button').attr('data-type','related');
									}else {
										$('.js-loadmore-button').css({'display':'none'}).find('a').removeClass('wd-bt-load-more');
									}
								}
							}
						}else {
							console.log(res.message);
						}
						$(".js-view-related").removeAttr("onclick").css("pointer-events","auto").addClass("viewRelatedPhotos");
					}
				});
			},
			loadContributeds : function() {
				/*Load photo*/
				var _url = homeURL + '/api/userphoto/contributedAlbums?page='+ zone.usernode.photo.config.page+'&id=' + viewingUser.id + '&limit=' + zone.usernode.photo.config.limit + '&offset=' + zone.photo.offsetAlbumLoad;
				$.ajax({
					type	: 'POST',
					dataType: 'JSON',
					url		: _url,
					success	: function(res){
						if(!res.error) {
							if(res != "undefined" && res != null){
								$('.js-loading').css({'display':'none'});

								if(res.total == 0 && zone.usernode.photo.config.page == 1) {
									var username = 'Your contributed don\'t';
									if(res.displayname != null && res.displayname != user.displayname) {
										username = res.displayname + ' doesn\'t';;
									}
									$("#photo-not-found").show().find('p.js-message-not-photo').html('').append(username+' have any photo!');
								}else {
									var cnt = 0;
									jQuery.each( res.albums || [], function( i, val ) {
										/*render item*/
										zone.List.renderItem(val, {
											templateID : 'tmplContributedObjectAlbum',
											callback : function(renderedItem) {
												zone.usernode.photo.albumContainer.append(renderedItem);
												/* set event listener for view contributed detail base on object*/
												renderedItem.find('.viewAlbumDetail').on("click",function() {
													/*Set init photo*/
													zone.photo.init();
													zone.usernode.GUI.cleanup();
													zone.usernode.photo.GUI.showPhotoContainer();
													var object_id = $(this).attr('ref');
													/*Push state*/
													var stateURL = $(this).attr('href');
													zone.usernode.History.pushState(stateURL);
	
													/*Call event unit*/
													$("html, body").animate({scrollTop: "200px"}, 1000);
	
													$('.js-loading').css({'display':'block'});
													zone.usernode.photo.config.page = 1;
													zone.usernode.photo.Actions.photosOfObject(viewingUser.username, object_id);
	
													return false;
												});
												renderedItem.find('.js-description-readmore').greennetExpand(zone.usernode.photo.config.descriptionReadmore);
											}
										});
										++cnt;
									});
									zone.photo.offsetAlbumLoad += cnt;
									if(res.total > zone.usernode.photo.config.page*zone.usernode.photo.config.limit) {
										$('.js-loadmore-button').css({'display':'block'}).find('a').addClass('wd-bt-load-more');
										$('.js-loadmore-button').attr('data-type','contributed');
									}else {
										$('.js-loadmore-button').css({'display':'none'}).find('a').removeClass('wd-bt-load-more');
									}
									/*Tooltip*/
									$('.wd-tooltip-hover').tipsy({gravity: 's'});
								}
							}
						}else {
							console.log(res.message);
						}
						$(".js-view-contributed").removeAttr("onclick").css("pointer-events","auto").addClass("viewContributedPhotos");
					}
				});
			},
			photosOfObject : function(username, object_id) {
				/*Load photo*/
				var _url = homeURL + '/api/userphoto/photosOfObject?page='+ zone.usernode.photo.config.page+'&u=' + encodeURIComponent(username) +'&object_id=' + object_id+ '&limit=' + zone.usernode.photo.config.limit + '&offset='+zone.photo.offsetPhotoLoad;
				$.ajax({
					type	: 'POST',
					dataType: 'JSON',
					url		: _url,
					success	: function(res){
						if(!res.error) {
							if(res != "undefined" && res != null){
								$("#photo-not-found").hide();
								$('.js-loading').css({'display':'none'});
								var cnt = 0;
								jQuery.each( res.photos || [], function( i, val ) {

									// render item
									zone.List.renderItem(val, {
										templateID : 'tmplPhotoItem',
										callback : function(renderedItem) {
											renderedItem.find('.timeago').timeago();
											zone.usernode.photo.photoContainer.append(renderedItem);
										}
									});
									/*Make index*/
									zone.photo.photoIndex.push(val.photo.id);
									++cnt;
								});
								/*Set offset photo load*/
								zone.photo.offsetPhotoLoad += cnt;
								/*Make total photo*/
								zone.photo.totalPhoto = res.total;
								$('.lnkViewPhotoDetail').attr('number_end',zone.photo.totalPhoto);

								if(res.total > zone.usernode.photo.config.page*zone.usernode.photo.config.limit) {
									$('.js-loadmore-button').css({'display':'block'}).find('a').addClass('wd-bt-load-more');
									$('.js-loadmore-button').attr({'data-type':'photos-of-object','data-user':encodeURIComponent(username),'object_id':object_id});
								}else {
									$('.js-loadmore-button').css({'display':'none'}).find('a').removeClass('wd-bt-load-more');
								}
								/*Tooltip*/
								$('.wd-tooltip-hover').tipsy({gravity: 's'});
							}
						}else {
							console.log(res.message);
						}
					}
				});
			},
			hidePhoto:function(_url,_this){
				var _this = $(_this);
				jConfirm('Are you sure you want to delete this photo?', 'Delete photo', function(r) {
					if(r){
						$.ajax({
							type	:"POST",
							dataType: 'JSON',
							url		: _url,
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
									
									$("span.js-number-photo").text(parseInt(total_photo_current) - 1);
									//$('span.js-number-photo').html($('span.js-number-photo').text() - 1);
									if(res.photo != 'undefined' && res.photo != null) {
										//$('#oImage-avatar').find('img').attr('src',homeURL + '/upload/user-photos/'+user.hexID+'/fill/306-372/'+res.photo.photo.image+'?album_id='+res.photo.photo.album_id);
										//$('#oImage-username-top-left').find('img').attr('src',homeURL + '/upload/user-photos/'+user.hexID+'/fill/34-34/'+res.photo.photo.image+'?album_id='+res.photo.photo.album_id);
										//$('#oImage-username-cont').find('img').attr('src',homeURL + '/upload/user-photos/'+user.hexID+'/fill/26-26/'+res.photo.photo.image+'?album_id='+res.photo.photo.album_id);
										user.profile.image = res.photo.photo.image;
										zone.databinding.find(".userAvatar, .bind-avatar-popup").bind({ 
											data : {
												user : {
													id : user.hexID,
													profile : {
														image : res.photo.photo.image
													}
												}
											}
										});
										$('.js-make-primary[ref='+res.photo.photo.id+']').addClass('wd-icon-make-primary-avatar-act').removeClass('js-make-primary');
									}else {
										if(res.user != 'undefined' && res.user != null){
											var image = "user-thumb-default-male.png";
											//$('#oImage-avatar').find('img').attr('src',homeURL + '/upload/user-photos/fill/306-372/'+user.hexID+'/'+image);
											//$('#oImage-username-top-left').find('img').attr('src',homeURL + '/upload/user-photos/fill/34-34/'+user.hexID+'/fill/34-34/'+image);
											//$('#oImage-username-cont').find('img').attr('src',homeURL + '/upload/user-photos/fill/26-26/'+user.hexID+'/fill/26-26/'+image);
											zone.databinding.find(".userAvatar").bind({ 
												data : {
													user : {
														id : user.hexID,
														profile : {
															image : image
														}
													}
												}
											});
										}
									}
									/*Make number-index*/
									var index = zone.photo.photoIndex.indexOf(_this.attr('ref'));
									zone.photo.photoIndex.splice(index,1);

									/*Make total photo*/
									$('.lnkViewPhotoDetail').attr('number_end',--zone.photo.totalPhoto);

									/*Empty cache*/
									zone.photo._caches = {};
									/*Set offset photo load*/
									--zone.photo.offsetPhotoLoad; 
									//$('#postCommentArea').find('img').attr('src',homeURL + '/upload/user-photos/'+user.hexID+'/fill/40-40/'+res.photo.photo.image+'?album_id='+res.photo.photo.album_id);
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
			},
			makePrimary:function(_url,_this){
				var _this = $(_this);
				jConfirm('Are you sure you want to make primary photo?', 'Make primary photo', function(r) {
					if(r){
						$.ajax({
							type	:"POST",
							dataType: 'JSON',
							url		: _url,
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
									var photo = $('#tmplUserPhotoItem').tmpl(res.photo);
									zone.usernode.photo.photoContainer.prepend(photo);
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

									//$('#oImage-avatar').find('img').attr('src',homeURL + '/upload/user-photos/'+user.hexID+'/fill/306-372/'+res.photo.photo.image+'?album_id='+res.photo.photo.album_id);
									//$('#oImage-username-top-left').find('img').attr('src',homeURL + '/upload/user-photos/'+user.hexID+'/fill/34-34/'+res.photo.photo.image+'?album_id='+res.photo.photo.album_id);
									//$('#oImage-username-cont').find('img').attr('src',homeURL + '/upload/user-photos/'+user.hexID+'/fill/26-26/'+res.photo.photo.image+'?album_id='+res.photo.photo.album_id);
									user.profile.image = res.photo.photo.image;
									zone.databinding.find(".userAvatar, .bind-avatar-popup").bind({ 
										data : {
											user : {
												id : user.hexID,
												profile : {
													image : res.photo.photo.image
												}
											}
										}
									});
									//$('#postCommentArea').find('img').attr('src',homeURL + '/upload/user-photos/'+user.hexID+'/fill/40-40/'+res.photo.photo.image+'?album_id='+res.photo.photo.album_id);
									//$('#wd-avatar-node-pp').find('img').attr('src',homeURL + '/upload/user-photos/'+user.hexID+'/fill/40-40/'+res.photo.photo.image+'?album_id='+res.photo.photo.album_id);
									//$('#receiverContainer').find('img').attr('src',homeURL + '/upload/user-photos/'+user.hexID+'/fill/40-40/'+res.photo.photo.image+'?album_id='+res.photo.photo.album_id);
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
		GUI : {
			showProfileContainer : function() {
				zone.usernode.photo.mainContainer.show();
				zone.usernode.photo.photoContainer.show();
			},
			showAlbumContainer : function() {
				zone.usernode.photo.mainContainer.show();
				zone.usernode.photo.albumContainer.show();
			},
			showPhotoContainer : function() {
				zone.usernode.photo.mainContainer.show();
				zone.usernode.photo.photoContainer.show();
			}
		},
		Event : {
			onAlbumDetailLoaded : function(album_id) {
				console.log("Need to implement event listener: onAlbumDetailLoaded");
			},
			onAlbumsLoaded : function() {
				console.log("Need to implement event listener: onAlbumsLoaded");
			}
		}
	};
})(jQuery, zone['usernode']);