;(function($, scope){
	scope['photo']	= {
		photoIndex: [],
		totalPhoto: 1,
		offsetPhotoLoad: 0,
		offsetAlbumLoad: 0,
		angleRotate:0,
		btnNext : null,
		btnPrev : null,
		navNext : null,
		navPrev : null,
		openPopup	: false,
		checkNext	: true,
		checkPrev	: true,
		limitComment:5,
		_preloadImages : {},
		_preloadImagesContainer : null,
		_caches : {},
		photoCurrent:null,
		beforePopupOpen : function() {},
		afterPopupOpened : function() {},
		afterPopupClosed : function() {},
		cache : function(photoID, photoData) {
			this._caches[photoID] = photoData;
		},
		retrieve : function(photoID) {
			if (typeof this._caches[photoID] != "undefined") {
				return this._caches[photoID];
			} else {
				return null;
			}
		},
		setPrev : function(photoID, prevPhotoID) {
			if (typeof this._caches[photoID].prev != "object" || typeof this._caches[photoID].prev.id == "undefined")
			this._caches[photoID].prev = {
				status : 'Done',
				id : prevPhotoID
			};
		},
		setNext : function(photoID, nextPhotoID) {
			if (typeof this._caches[photoID].next != "object" || typeof this._caches[photoID].next.id == "undefined")
			this._caches[photoID].next = {
				status : 'Done',
				id : nextPhotoID
			};
		},
		/*cachePhotos : function(photos) {
			var prev = null;
			for (var i in photos) {
				console.log(photos[i].photo.id);
				// save cache
				this.cache(photos[i].photo.id, photos[i]);
				// set prev
				if (prev != null) {
					this.setPrev(photos[i].photo.id, prev.photo.id);
//					console.log('prev: ' + prev.photo.id);
				}
				
				// Set prev for next use
				prev = photos[i];
				
				// set next
				var nextIndex = parseInt(i) + 1;
				var next = photos[nextIndex];
				if (typeof next != "undefined") {
					this.setNext(photos[i].photo.id, next.photo.id);
//					console.log('Next: ' + next.photo.id);
				}
				
//				console.log('---------------------')
			}
		},*/
		renderPhotoInfo:function(photos){
			if(typeof photos.photo.poster != "undefined" && photos.photo.poster.id == jlbd.user.collection.current.user.id){
				if(photos.photo.description != null && photos.photo.description != ''){
					$(".wd-desc-photo").html(photos.photo.nl2brDescription).greennetExpand(config);
					$(".wd-add-desc-ppphoto-bt").html("Update description");
					$(".frmAddDesPhotoForm").find('textarea').val(photos.photo.description);
				}else{
					$(".wd-desc-photo").html("");
					$(".wd-add-desc-ppphoto-bt").html("Add a description");
					$(".frmAddDesPhotoForm").find('textarea').val('');
				}
				$(".wd-add-desc-ppphoto-bt").show();
				$(".wd-add-desc-ppphoto-content").hide();
				$(".frmAddDesPhotoForm").find('.hiddenPhotoID').val(photos.photo.id);
			}else{
				$(".wd-add-desc-ppphoto-bt").hide();
				$(".wd-add-desc-ppphoto-content").hide();
				$(".wd-desc-photo").html("");
			}
		},

		/**
		 * This method is used to render a set of photos
		 */
		render : function(photos) {
			$(".containerRightPhoto").hide();
			try{
				photos.like.style = {
					floatLeft : false
				};
			}catch(e){
				//console.log(e.message);
			}
			zone.photo.renderPhotoInfo(photos);
			//_photoPoster = $.tmpl($('#tmpPosterInfo'), photos);
			//_photoPoster.find('.timeago').timeago();
			//_posterContainer.html(_photoPoster);
			_photoLike = $.tmpl($('#tmplLike'), photos.like);
			_likeContainer.html(_photoLike);

			_photoReceiver = $.tmpl($('#tmpPhotoReceiver'), photos);
			_photoReceiver.find('.timeago').timeago();
			_receiverContainer.html(_photoReceiver);
			
			/**
			 * add code for share and report a photo
			 * author: Chu Tieu
			 **/
			_photoShare = $.tmpl($('#tmplSharePhoto'), photos);
			_sharePhotoContainer.html(_photoShare);
			
			_photoReportConcern = $.tmpl($('#tmplReportConcernPhoto'), photos);
			_reportConcernPhotoContainer.html(_photoReportConcern);
			
			/** End **/
			
			/**
			 * applied comment in box photo
			 **/
			if(commentScroller == null){
				var _photoCommentContainerScroller = _photoCommentContainer.html('');
			}else{
				var _photoCommentContainerScroller = _photoCommentContainer.html('');
			}
			jQuery.each( photos.comments || [], function( i, val ) {
				_photoComments = $.tmpl($('#tmpPhotoCommentItem'), val);
				_photoComments.find('.timeago').timeago();
				_photoCommentContainerScroller.prepend(_photoComments);
			});
			if(photos.album != null && photos.album.title != 'undefined') {
				$('span.js-album-title').html(photos.album.title);
			}
			else {
				$('span.js-album-title').html();
			}

			var _text = $(".btnLikePopupPhoto").attr("rating_value");
			$('.js-photo-like, .js-photo-text-like').html(_text);

			
			/*if (commentScroller == null) {
				//_photoCommentContainer.html('').append(_photoComments);
				console.log('a');
			} else {
				//commentScroller.getContentPane().html('').append(_photoComments);
				console.log('b');
			}*/

			_photoContent = $.tmpl($('#areaPhoto'), photos);
			photoArea.html(_photoContent);
			
			_photoCommentContainer.data('photo', photos);

			/*Init Rotate <VuNDH add code>*/
			$('.js-rotate-left, .js-rotate-right').attr('photo_id',photos.photo.id);
			$('.js-rotate-left, .js-rotate-right').attr('data-type',photos.photo.type);
			//zone.photo.angleRotate = 0;

			var photo = _photoContent.find('img');
			/**
			 * thinhpq add code progress image loading
			 **/
			$("#imgPhotoViewer").imagesLoaded().progress( function( instance, image ) {
				var result = image.isLoaded ? 'loaded' : 'broken';
				if(_photoContent.find('img').parent().find('.loadingPopupPhoto').length ==0 ){
					_photoContent.find('img').parent().prepend('<img style="width:300px;height:100px" class="loadingPopupPhoto" src="'+homeURL+'/myzone_v1/img/38-1.gif">');
				}
			}).done( function( instance ) {
				$(".loadingPopupPhoto").remove();
				$("#imgPhotoViewer").show();
				photo.animate({ opacity: 1 }, 800,function(e){
					/**
					 * show image success (thinhpq add code)
					 * 20/08/2013
					 **/
					// _photoCommentContainer.height(photo.height() - 152);
					// if (commentScroller == null) {
						// commentScroller = _photoCommentContainer.data('jsp');
					// } else {
						// commentScroller.reinitialise();
					// }
					// if (photos.photo.totalComments > (photos.comments.length + photos.photo.commentOffset)) {
					
					if (photos.photo.totalComments !=0 && photos.photo.totalComments > zone.photo.limitComment) {
						var strTotalComment = ' comment';
						if(photos.photo.totalComments > 1)
							strTotalComment = ' comments';
							
						_lnkViewMoreComments.find('span.wd-text').html('View more <label id="numberComment">' + parseInt(photos.photo.totalComments - zone.photo.limitComment) + '</label>'+ strTotalComment);
						_viewAllCommentsContainer.show();
						
						// set attributes
						_lnkViewMoreComments.attr('limit', photos.photo.totalComments);
						_lnkViewMoreComments.attr('objectId', photos.photo.id);
						_lnkViewMoreComments.attr('offset', photos.comments.length);
						_lnkViewMoreComments.attr('token', photos.token);
						_lnkViewMoreComments.attr('loaddata', 0);
						
					}else{
						// _lnkViewMoreComments.find('span.wd-text').html('0 comments');
						_viewAllCommentsContainer.hide();
					}

					var txtCommentWrapper = $('#txtCommentFormWrapper');
					txtCommentWrapper.html('');

					var commentFormData = {
						action : homeURL + '/photos/default/addComment',
						token : photos.token,
						object_id : photos.photo.id,
						htmlOptions : [
							{key: 'rows', value: '2'},
							{key: 'cols', value: '97'},
							{key: 'class', value: 'wd-font-11 photo-form-input'},
							{key: 'style', value: 'overflow: hidden; word-wrap: break-word; resize: none; height: 37px;'}
						]
					};
					var txtCommentForm = $.tmpl($('#tmplAddCommentForm'), commentFormData);
					txtCommentWrapper.prepend(txtCommentForm);
					
					$(".containerRightPhoto").show();
					registerDeleteComment($('.js-delete-comment'));/*VuNDH add code*/
					/*Tooltip*/
					$('.wd-tooltip-hover').tipsy({gravity: 's'});
					zone.photo.calMiddleImage();

					if(photos.photo.poster.hexID == user.hexID){
						$('.js-rotate').show();
					}else{
						$('.js-rotate').hide();
					}
					/*Set btn nextm,prev*/
					if($('.js-photo-start').text() == 1 && $('.js-photo-end').text() == 1) {
						$('#btnNextPhoto,#btnPrevPhoto').css({'display':'none'});
					}else{
						if(zone.photo.checkNext && zone.photo.checkPrev) {
							setTimeout(function(){
								$('#btnNextPhoto,#lnkNextPhoto,#btnPrevPhoto').css({'display':'block'});
							}, 500);
						}
					}
				});
			});
			/*Tooltip*/
			$('.wd-tooltip-hover').tipsy({gravity: 's'});
		},

		/**
		 * This method return an jQuery object of preload image container
		 */
		preloadImageContainer : function() {
			if (this._preloadImagesContainer == null) {
				this._preloadImagesContainer = $('<div id="preloadImages" style="display:none"/>');
				$('body').append(this._preloadImagesContainer);
			}
			return this._preloadImagesContainer;
		},

		/**
		 * This method is used to perform a preload of an image given by an url
		 */
		preloadImage : function(url) {
			if (typeof this._preloadImages[url] == "undefined") {
				var _img = $("<img src='"+url+"'/>");
				this.preloadImageContainer().append(_img);
				this._preloadImages[url] = true;
			}
		},

		/**
		 * This method is used to get information of next photo
		 */
		getNextPhoto : function(photo_id, album_id, photoType) {
			zone.photo.checkNext = true;
			if (typeof zone.photo._caches[photo_id].next == "undefined") {
				zone.photo._caches[photo_id].next = {
					status : 'Loading'
				};
				/* Build URL*/
				var url = "";
				if (zone.photo.navNext.length > 0) {
					var path = zone.photo.navNext.attr('path');
					var query = zone.photo.navNext.attr('query');
					url = path + query + photo_id;
				} else {
					url = homeURL + '/photos/detail?photo_id=' + photo_id + '&album_id=' + album_id + '&comments='+zone.photo.limitComment+'&next=true&type='+photoType;
				}
				$.ajax({
					url 	: url,
					dataType: 'JSON',
					success : function(res) {
						if (typeof res.error == "undefined" || !res.error) {
							//zone.photo.preloadImage(res.photo.url);
							/*If user is call for rendering, then render photo after complete*/
							if(zone.photo._caches[photo_id].next.status == "Rendering") {
								zone.photo.render(res);
							}
							/*Set photo next*/
							zone.photo.setNext(photo_id, res.photo.id);
							if (typeof zone.photo._caches[res.photo.id] == "undefined") {
								/*Save cache*/
								zone.photo._caches[res.photo.id] = res;
							}
							/*Set prev photo*/
							zone.photo.setPrev(res.photo.id, photo_id);
						} else {
							// TODO: alert something here
						}
					}
				});
			}
		},

		/**
		 * This method is used to get information of previous photo
		 */
		getPrevPhoto : function(photo_id, album_id, photoType) {
			zone.photo.checkPrev = true;
			if (typeof zone.photo._caches[photo_id].prev == "undefined") {
				zone.photo._caches[photo_id].prev = {
					status : 'Loading'
				};
				/* Build URL*/
				var url = "";
				if (zone.photo.navPrev.length > 0) {
					var path = zone.photo.navPrev.attr('path');
					var query = zone.photo.navPrev.attr('query');
					url = path + query + photo_id;
				} else {
					url = homeURL + '/photos/detail?photo_id=' + photo_id + '&album_id=' + album_id + '&comments=5&prev=true&type='+photoType;
				}

				$.ajax({
					url 	: url,
					dataType: 'JSON',
					success : function(res) {
						if (typeof res.error == "undefined" || !res.error) {
							//zone.photo.preloadImage(res.photo.url);

							/* If user is call for rendering, then render photo after complete*/
							if(zone.photo._caches[photo_id].prev.status == "Rendering") {
								zone.photo.render(res);
							}
							/* Set prev for current photo*/
							zone.photo.setPrev(photo_id, res.photo.id);
							if (typeof zone.photo._caches[res.photo.id] == "undefined") {
								// save get photo to cache
								zone.photo._caches[res.photo.id] = res;
							}
							/* Set next for current photo*/
							zone.photo.setNext(res.photo.id, photo_id);

						} else {
							// TODO: alert something here
						}
					}
				});
			}
		},

		/**
		 * This method is used to load an individual photo
		 */
		loadPhoto : function(photo_id, album_id, image, photoType, isRotate) {
			if (_photoContent != null && !isRotate) _photoContent.remove();
			if (_photoPoster != null) _photoPoster.remove();
			//_photoCommentContainer.html('');
			// _viewAllCommentsContainer.hide();

			if (typeof this._caches[photo_id] != "undefined" && (typeof this._caches[photo_id].invalidate == "undefined" || this._caches[photo_id].invalidate == false)) {
				var res = this._caches[photo_id];
				/* Get next-prev photo*/
				this.getNextPhoto(res.photo.id, res.photo.album_id, photoType);
				this.getPrevPhoto(res.photo.id, res.photo.album_id, photoType);
				/*Render photo*/
				if(!isRotate) {
					this.render(res);
				}else {
					/*Set btn nextm,prev*/
					if($('.js-photo-start').text() == 1 && $('.js-photo-end').text() == 1) {
						$('#btnNextPhoto,#btnPrevPhoto').css({'display':'none'});
					}else{
						if(zone.photo.checkNext && zone.photo.checkPrev) {
							setTimeout(function(){
								$('#btnNextPhoto,#lnkNextPhoto,#btnPrevPhoto').css({'display':'block'});
							}, 1000);
						}
					}
				}
			} else {
				$.ajax({
					url 	: homeURL + '/photos/detail?photo_id=' + photo_id + '&album_id=' + album_id + '&comments=5&type=' + photoType,
					dataType: 'JSON',
					success : function(res) {
						if (typeof res.error == "undefined" || !res.error) {
							/*Save cahes*/
							zone.photo._caches[res.photo.id] = res;
							/* Get next-prev photo*/
							zone.photo.getNextPhoto(res.photo.id, res.photo.album_id, photoType);
							zone.photo.getPrevPhoto(res.photo.id, res.photo.album_id, photoType);
							/*Render photo*/
							if(!isRotate) {
								zone.photo.render(res);
							}else {
								/*Set btn nextm,prev*/
								if($('.js-photo-start').text() == 1 && $('.js-photo-end').text() == 1) {
									$('#btnNextPhoto,#btnPrevPhoto').css({'display':'none'});
								}else{
									if(zone.photo.checkNext && zone.photo.checkPrev) {
										setTimeout(function(){
											$('#btnNextPhoto,#lnkNextPhoto,#btnPrevPhoto').css({'display':'block'});
										}, 1000);
									}
								}
							}
						} else {
							// TODO: alert something here
						}
					}
				});
			}
		},

		deletePhoto : function (callback) {
			var _lnk = zone.photo.tmpObject;
			var _url = _lnk.attr('href');
			
			$.ajax({
				url 	: _url,
				dataType: 'JSON',
				success : function(res) {
					if (res.error) {
						// TODO: Need to use alert popup of MyZone here
						alert(res.message);
					} else {
						if (typeof callback == "function") {
							callback(res);
						}
					}
				}
			});
		},
		calMiddleImage:function(){
			var heightPopupContainer = $(window).height() - 80 - 32;
			$("#photoPopupContainer").css({height:heightPopupContainer+"px"});
			$(".wd-info-images").css({height:heightPopupContainer+"px"});
			$(".wd-img-content").attr('style','line-height:'+Math.round((heightPopupContainer) - 42) + "px");
			// $(".containerComments-box").css({height:Math.round((heightPopupContainer) - 102 - 169) + "px"});
			$(".wd-comments-images").css({"min-height":heightPopupContainer+"px"});

			// var heightPhotoConmmentsBox = $(".containerComments-box").height();
			// var heightPhotoConmments = $("#containerPhotoComments").find(".jspPane").height();
			// if(heightPhotoConmments > heightPhotoConmmentsBox) {
				// $("#containerPhotoComments").css({height:Math.round(heightPhotoConmmentsBox) + "px"});
			// }else {
				// $("#containerPhotoComments").css({height:Math.round(heightPhotoConmments) + "px"});
			// }
			try{
				commentScroller.reinitialise();
			}catch(e){
				//console.log(e.message);
			}
		},
		showDialog : function(modal){
			if(zone.photo.openPopup) return false;
			this.beforePopupOpen();
			$("#wd-overlay").show();
			$("#wd-popup_statistics").fadeIn(300);

			_popupScrollTop = $(window).scrollTop();

			// thinhpq add code 23/08/2013
			$("body").addClass("noscrollpopup");
			zone.photo.calMiddleImage();
			// xu ly scroll
			// #photoPopupContainer
			var _viewer = $('#photoPopupContainer');
			var _height = _viewer.outerHeight() + 50;

			_pageWrapper.height(_height + _popupScrollTop);
			_pageWrapper.css('margin-top', -_popupScrollTop);
			_pageWrapper.css('overflow', 'hidden');
			$(document).scrollTop(0);

			if (modal){
				$("#wd-overlay,.js-btnClose").unbind("click");
			} else {
				$("#wd-overlay,.js-btnClose").click(function (e){
					zone.photo.hideDialog();
				});
			}
			$('.js-photo-like, .js-photo-text-like').on('click',function(){
				$('.btnLikePopupPhoto').trigger('click');
			});

			$('.js-photo-text-comment').on('click',function(){
				$(".frmAddCommentForm").find("textarea.photo-form-input").focus();
			});

			$('.js-add-desc-photo').on('click',function(){
				$('.js-form-add-desc-photo').css({'display':'block'});
				$('#frmAddDescPhoto .photo-form-input').focus();
			});
			this.afterPopupOpened();
			
			zone.photo.openPopup = true;
		},

		hideDialog : function(callback) {
			if(!zone.photo.openPopup) return false;
			$("#wd-overlay").fadeOut(500);
			$("#wd-popup_statistics").hide();

			$(".containerRightPhoto").hide();
			
			_pageWrapper.css('overflow', '');
			_pageWrapper.css('height', '');
			_pageWrapper.css('margin-top', '');

			$("body").removeClass("noscrollpopup");
			window.scrollTo(0,_popupScrollTop);
			if (typeof callback == "function") callback();
			this.afterPopupClosed();
			zone.photo.openPopup = false;
		},

		init : function(options) {
			var _default = {
				beforePopupOpen : function() {},
				afterPopupOpened : function() {},
				afterPopupClosed : function() {}
			}
			options = $.extend({}, _default, options);
			
			zone.photo.photoIndex = [];
			//zone.photo._caches = {};
			zone.photo.totalPhoto = 1;
			zone.photo.offsetPhotoLoad = 0;
			zone.photo.offsetAlbumLoad = 0;
			this.navNext = $('#navNextPhoto');
			this.navPrev = $('#navPrevPhoto');
			/*Tooltip*/
			$('.wd-tooltip-hover').tipsy({gravity: 's'});

			if (typeof options.beforePopupOpen == "function") {
				this.beforePopupOpen = options.beforePopupOpen;
			}
			if (typeof options.afterPopupClosed == "function") {
				this.afterPopupClosed = options.afterPopupClosed;
			}
			if (typeof options.afterPopupOpened == "function") {
				this.afterPopupOpened = options.afterPopupOpened;
			}
		}
	};

	/**
	 * Object for handling album
	 */
	scope['album']	= {
	};
})(jQuery, zone);

var _popupScrollTop = 0;
var _body = null;
var _pageWrapper = $('#pageWrapper');
var config = ({
	readMoreText	: 'Read more',
	readLessText	: 'Read less',
	numberOfWord	: 180,
	readLess		: true,
	readMore		: true
});

$(document).ready(function () {
	_pageWrapper = $('#pageWrapper');
	
	/**
	 * Add scroll for popup photo
	 * Author: Chu Tieu
	*/
	$('#youlook-image-contents').jScrollPane({
		horizontalGutter:5,
		verticalGutter:5,
		mouseWheelSpeed:50,
		autoReinitialise: true
	});
	$('textarea.youlook-photo-description').autosize();
	/** End scroll */
	
	/*View popup*/
	$('body').on('click', '.lnkViewPhotoDetail', function(e){
		zone.photo.showDialog(false);
		var _this = $(this);
		var photo_id = _this.attr('photo_id');
		var album_id = _this.attr('album_id');
		var image = _this.attr('filename');
		var photoType = _this.attr('type');
		
		/** Set data angle photo */
		$('.js-rotate-left, .js-rotate-right').attr('data-angle',0);

		// var number_current = zone.photo.photoIndex.indexOf(photo_id) + 1;
		var number_current = 1;
		
		var containerPhotos = _this.parents('.youlook-photo-item').parent();
		var countPhotos = containerPhotos.find("li[album_id='" + _this.attr('album_id') + "']");
		
		countPhotos.each(function( index, element ){
			if(photo_id==$(this).attr('id')){
				number_current = index+1;
				return false;
			}
		});
		
		if(number_current != undefined && number_current >0) {
			$('.js-photo-start').html(number_current);
		}else {
			var number = _this.attr('number_current');
			if(number != undefined) {
				$('.js-photo-start').html(number);
			}else{
				$('.js-photo-start').html('1');
			}
		}
		
		var number_end = _this.attr('number_end');
		if(number_end != undefined) {
			$('.js-photo-end').html(number_end);
		}else {
			$('.js-photo-end').html('1');
		}
		/*Load photo*/
		zone.photo.loadPhoto(photo_id, album_id, image, photoType);
		/*Tooltip*/
		$('.wd-tooltip-hover').tipsy({gravity: 's'});
		e.preventDefault();
	});

	/*Btn next popup photo*/
	$(document).on('click','#btnNextPhoto',function(e){
		$('#btnNextPhoto,#lnkNextPhoto,#btnPrevPhoto').css({'display':'none'});
		zone.photo.checkNext = false;

		var _currentPhoto = _photoCommentContainer.data('photo');
		var _photo_id = _currentPhoto.photo.id;
		var _album_id = _currentPhoto.photo.album_id;
		var photoType = _currentPhoto.photo.type;

		/*Set data angle photo*/
		$('.js-rotate-left, .js-rotate-right').attr('data-angle',0);

		//zone.photo.getNextPhoto(_photo_id, _album_id, photoType);

		if (typeof zone.photo._caches[_photo_id].next == 'string') {
			zone.photo._caches[_photo_id].next.status = "Rendering";
			zone.photo.getNextPhoto(_photo_id, _album_id, photoType);
		} else if (typeof zone.photo._caches[_photo_id].next == 'object') {
			var _next_photo = zone.photo._caches[zone.photo._caches[_photo_id].next.id];
			if (typeof _next_photo != "undefined") {
				if(_currentPhoto.photo.id == _next_photo.photo.id) return false;
				zone.photo.loadPhoto(_next_photo.photo.id, _next_photo.photo.album_id, _next_photo.photo.image, photoType);
				var numberStart = parseInt($('span.js-photo-start').html());
			} else {
				var numberStart = parseInt($('span.js-photo-start').html())-1;
				/*Set btn nextm,prev*/
				$('#btnNextPhoto,#lnkNextPhoto,#btnPrevPhoto').css({'display':'block'});
				//zone.photo._caches[_photo_id].next.status = "Rendering";
				//zone.photo.getNextPhoto(_photo_id, _album_id, photoType);
				//var _next_photo = zone.photo._caches[zone.photo._caches[_photo_id].next.id];
				//console.log("Loading next photo of " + _photo_id);
			}
		} else {
			//console.log("Can't load photo");
		}
		/*Tooltip*/
		$('.wd-tooltip-hover').tipsy({gravity: 's'});

		var numberEnd = parseInt($('span.js-photo-end').html());
		if(numberStart < numberEnd) {
			$('span.js-photo-start').html(numberStart + 1);
		}else {
			$('span.js-photo-start').html(1);
		}
	});

	/*Btn Prev popup photo*/
	$(document).on('click','#btnPrevPhoto',function() {
		$('#btnNextPhoto,#lnkNextPhoto,#btnPrevPhoto').css({'display':'none'});
		zone.photo.checkPrev = false;
		var _currentPhoto = _photoCommentContainer.data('photo');
		var _photo_id = _currentPhoto.photo.id;
		var _album_id = _currentPhoto.photo.album_id;
		var photoType = _currentPhoto.photo.type;

		/*Set data angle photo*/
		$('.js-rotate-left, .js-rotate-right').attr('data-angle',0);

		//zone.photo.getPrevPhoto(_photo_id, _album_id, photoType);
		if (typeof zone.photo._caches[_photo_id].prev == 'string') {
			zone.photo._caches[_photo_id].prev.status = "Rendering";
			zone.photo.getPrevPhoto(_photo_id, _album_id, photoType);
		} else if (typeof zone.photo._caches[_photo_id].prev == 'object') {
			var _prev_photo = zone.photo._caches[zone.photo._caches[_photo_id].prev.id];
			if (typeof _prev_photo != "undefined") {
				if(_currentPhoto.photo.id == _prev_photo.photo.id) return false;
				zone.photo.loadPhoto(_prev_photo.photo.id, _prev_photo.photo.album_id, _prev_photo.photo.image, photoType);
				var numberStart = parseInt($('span.js-photo-start').html());
			} else {
				var numberStart = parseInt($('span.js-photo-start').html()) + 1;
				/*Set btn nextm,prev*/
				$('#btnNextPhoto,#lnkNextPhoto,#btnPrevPhoto').css({'display':'block'});
				//zone.photo._caches[_photo_id].next.status = "Rendering";
				//zone.photo.getPrevPhoto(_photo_id, _album_id, photoType);
				//console.log("Loading prev photo of " + _photo_id);
			}
		} else {
			//console.log("Can't load photo");
		}
		/*Tooltip*/
		$('.wd-tooltip-hover').tipsy({gravity: 's'});

		var numberEnd = parseInt($('span.js-photo-end').html());
		if(numberStart > 1) {
			$('span.js-photo-start').html(numberStart - 1);
		}else{
			$('span.js-photo-start').html(numberEnd);
		}
	});

	/*Append comment*/
	$('body').on('keydown', '.frmAddCommentForm .photo-form-input', function(e){
		if (e.keyCode == 13){
			var _this = $(this);
			var objForm = _this.parents('form');
			var action = objForm.attr('action');
			//var objViewMore = $("#viewMore"+token);

			_this.attr("disabled", "disabled");
			if($.trim(_this.val())==""){
				_this.val("");
				_this.removeAttr("disabled");
				return false;
			}

			$.ajax({
				url			: action,
				data		: objForm.serialize()+"&content="+encodeURIComponent(_this.val()),
				type		: 'POST',
				dataType	: 'JSON',
				success		: function (res) {
					_this.removeAttr("disabled");
					_this.val('');
					_this.css({
						height:'auto'
					});
					if(res.error){
					
					} else {
						_this.focus();
						_photoComment = $.tmpl($('#tmpPhotoCommentItem'), res.content);
						_photoComment.find('.timeago').timeago();
						
						_photoCommentContainer.append(_photoComment);
						// commentScroller.reinitialise();
						
						var photoID = objForm.find('.hiddenObjectID').val();
						zone.photo._caches[photoID].invalidate = true;

						var txt_numberComment = $("#viewAllComments").find("#numberComment").text();
						if(typeof txt_numberComment != undefined) {
							txt_numberComment = parseInt(txt_numberComment) + 1;
							$("#viewAllComments").find("#numberComment").text(txt_numberComment);
						}

						registerDeleteComment($('.js-delete-comment'));
						/*Tooltip*/
						$('.wd-tooltip-hover').tipsy({gravity: 's'});
						zone.photo.calMiddleImage();
					}
				}, error: function (xhr, ajaxOptions, thrownError) {
					//console.log(xhr.responseText);
					_this.removeAttr("disabled");
				}
			});
		}
	});

	$('body').on('click', '.btnLikePopupPhoto', function(e){
		var token = $(this).attr('token');
		var value = $(this).attr('rating_value');
		if(value == 'Like')
			$('.js-photo-like, .js-photo-text-like').html('Unlike');
		else
			$('.js-photo-like, .js-photo-text-like').html('Like');
		initLike(token, function(res) {
			zone.photo._caches[res.photo_id].invalidate = true;
		});
		return false;
	}); 

	/*Hide photo*/
	$(document).on('click', 'a.js-photo-hide', function(e){
		var _this = $(this);
		var _ref = _this.attr('ref');
		var data_type = _this.attr('data-type');
		if(data_type != undefined && data_type == 'user') {
			var _url = homeURL + '/userphotos/hidePhoto/photoID/' + _ref; 
			zone.usernode.photo.Actions.hidePhoto(_url,_this);
		}else {
			var _url = homeURL + '/resource/hidePhoto/binID/' + _ref;
			zone.zonetype.photo.Actions.hidePhoto(_url,_this);
		}
	});

	$('body').on('click', '.wd-add-desc-ppphoto .wd-add-desc-ppphoto-bt', function(e){
		$(this).hide();
		$(this).parent().find(".wd-add-desc-ppphoto-content").animate({opacity: "show"}, 1500);
		$(".wd-desc-photo").html('');
	});

	$(window).resize(function() {
		zone.photo.calMiddleImage();
	});

	$('body').on('keydown', '.frmAddDesPhotoForm', function(e){
		
		var _this = $(this);
		
		if(e.keyCode == 13 && !e.shiftKey){
			
			$.ajax({
				url			: _this.attr('action')+"?photo_id="+_this.find('.hiddenPhotoID').val(),
				data		: _this.serialize(),
				type		: 'POST',
				dataType	: 'JSON',
				cache : false,
				success		: function (res) {
					_this[0].reset();
					if(!res.error){
						$(".wd-desc-photo").html(res.photo.nl2brDescription).greennetExpand(config);
						if($.trim(res.photo.description)!="" && $.trim(res.photo.description)!=null){
							$(".wd-add-desc-ppphoto-bt").html("Update description");
							$(".wd-desc-photo").show();
						}else{
							$(".wd-add-desc-ppphoto-bt").html("Add a description");
							$(".wd-desc-photo").hide();
						}
						$(".frmAddDesPhotoForm").find('textarea').val(res.photo.description);
						$(".wd-add-desc-ppphoto-content").hide();
						$(".wd-add-desc-ppphoto-bt").show();
						$(".frmAddDesPhotoForm").find('.hiddenPhotoID').val(res.photo.id);
						
						if(typeof profilePhotos != "undefined"){
							$.each(profilePhotos,function(x,y){
								if(y.photo.id ==  res.photo.id){
									profilePhotos[x].photo.description = res.photo.description;
								}
							});
						}else{
							if(typeof zone.photo._caches != "undefined"){
								$.each(zone.photo._caches,function(x,y){
									if(y.photo.id ==  res.photo.id){
										zone.photo._caches[x].photo.description = res.photo.description;
									}
								});
							}
						}
					}
				},error: function (xhr, ajaxOptions, thrownError) {
					//console.log(xhr.responseText);
				}
			});
			return false;
		}
	});

	/*Make primary photo*/
	$(document).on('click','.js-make-primary',function(){
		var _this = $(this);
		var _type = _this.attr('data-type');
		var _photoID = _this.attr('ref');
		if(_type == 'user') {
			var _url = homeURL + '/userphotos/makePrimary/fileid/' + _photoID;
			zone.usernode.photo.Actions.makePrimary(_url,_this);
		}else {
			var _url = homeURL + '/userphotos/makePrimary/fileid/' + _photoID + '/type/node';
			zone.zonetype.photo.Actions.makePrimary(_url,_this);
		}
	});

	/*Rotate photo left 90*/
	$(document).on('click','.js-rotate-left',function(){
		$(".js-img-saving").show();
		var _this = $(this);
		var _photoID = _this.attr('photo_id');
		zone.photo.angleRotate = $('.js-rotate-left[photo_id="'+_photoID+'"]').attr('data-angle');

		if(typeof zone.photo.angleRotate == "undefined" || zone.photo.angleRotate == -360)
			zone.photo.angleRotate = 0;

		$("img#imgPhotoViewer[photo_id='"+_photoID+"']").rotate({
			angle: zone.photo.angleRotate,
			animateTo: zone.photo.angleRotate - 90
		});

		zone.photo.angleRotate -= 90;

		$('.js-rotate-left[photo_id="'+_photoID+'"]').attr('data-angle',zone.photo.angleRotate);
		$('.js-rotate-right[photo_id="'+_photoID+'"]').attr('data-angle',zone.photo.angleRotate);
		rotateSave(_this);
	});

	/*Rotate photo right 90*/
	$(document).on('click','.js-rotate-right',function(){
		$(".js-img-saving").show();
		var _this = $(this);
		var _photoID = _this.attr('photo_id');
		zone.photo.angleRotate = parseInt($('.js-rotate-right[photo_id="'+_photoID+'"]').attr('data-angle'));

		if(typeof zone.photo.angleRotate == "undefined" || zone.photo.angleRotate == 360)
			zone.photo.angleRotate = 0;

		$("img#imgPhotoViewer[photo_id='"+_photoID+"']").rotate({
			angle: zone.photo.angleRotate,
			animateTo: zone.photo.angleRotate + 90
		});

		zone.photo.angleRotate += 90;
		$('.js-rotate-left[photo_id="'+_photoID+'"]').attr('data-angle',zone.photo.angleRotate);
		$('.js-rotate-right[photo_id="'+_photoID+'"]').attr('data-angle',zone.photo.angleRotate);
		rotateSave(_this);
	});

	function rotateSave(_this){
		var _photoID = _this.attr('photo_id');
		var _type = _this.attr('data-type');
		var _angle = _this.attr('angle');
		if(_type == 'user') {
			var _url = homeURL + '/userphotos/rotate/photoID/' + _photoID + '/angle/'+_angle;
		}else {
			var _url = homeURL + '/resource/rotate/photoID/'+ _photoID + '/angle/'+_angle;
		}
		$('#btnNextPhoto,#btnPrevPhoto').css({'display':'none'});
		$.ajax({
			url		: _url,
			type	: 'POST',
			dataType: 'JSON',
			success	: function(res){
				/*Empty cache*/
				zone.photo._caches = {};
				if(_type == 'user') {
					/*Make primary if rotate photo is primary photo*/
					if(res.isPrimary) {
						var _url = homeURL + '/userphotos/makePrimary/fileid/' + _photoID;
						$.ajax({
							type	:"POST",
							dataType: 'JSON',
							url		: _url,
							success	:function(res){
								if(res.error){
									console.log(res.message);
								}else{
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
								}
							},error: function (xhr, ajaxOptions, thrownError) {
								console.log(xhr.responseText);
							}
						});
					}
					//$('.wd-round-image .lnkViewPhotoDetail[photo_id="'+_photoID+'"]').find('img').attr('src',homeURL + '/upload/user-photos/'+user.hexID+'/fill/202-202/'+res.photo.photo.image+'?album_id='+res.photo.photo.album_id);
					zone.databinding.find(".bind-profilePhoto"+res.photo.photo.id).bind({ 
						data : {
							user : {
								id : user.hexID,
								profile : {
									image : res.photo.photo.image
								}
							}
						}
					});
				}else {
					if(res.isPrimary) {
						var _url = homeURL + '/userphotos/makePrimary/fileid/' + _photoID + '/type/node';
						$.ajax({
							type	:"POST",
							dataType: 'JSON',
							url		: _url,
							success	:function(res){
								if(res.error){
									console.log(res.message);
								}else{
									//$('#postCommentArea').find('img').attr('src',homeURL + '/upload/user-photos/'+user.hexID+'/fill/40-40/'+res.photo.photo.image+'?album_id='+res.photo.photo.album_id);
									//$('#receiverContainer').find('img').attr('src',homeURL + '/upload/user-photos/'+user.hexID+'/fill/40-40/'+res.photo.photo.image+'?album_id='+res.photo.photo.album_id);
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
									/*Empty cache*/
									//zone.photo._caches = {};
								}
							},error: function (xhr, ajaxOptions, thrownError) {
								console.log(xhr.responseText);
							}
						});
					}
					//$('#oTopPhotos').find('a.lnkViewPhotoDetail[photo_id="'+_photoID+'"]').find('img').attr('src',homeURL + '/upload/gallery/fill/96-96/'+res.photo.photo.image);
					//$('.wd-round-image .lnkViewPhotoDetail[photo_id="'+_photoID+'"]').find('img').attr('src',homeURL + '/upload/gallery/fill/202-202/'+res.photo.photo.image+'?album_id='+res.photo.photo.album_id);
					zone.databinding.find(".bind-photo"+res.photo.photo.id).bind({ 
						data : {
							user : {
								id : res.photo.photo.album_id,
								profile : {
									image : res.photo.photo.image
								}
							}
						}
					});
				}
				/*Load photo rotate*/
				zone.photo.loadPhoto(res.photo.photo.id, res.photo.photo.album_id, res.photo.photo.image, _type, true);
				setTimeout(function(){
					$(".js-img-saving").hide();
				}, 1000);
			},
			error : function(xhr, ajaxOptions, thrownError) {
				//console.log(xhr.responseText);
			}
		});
	};
});