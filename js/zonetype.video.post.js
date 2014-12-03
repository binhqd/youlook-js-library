$(document).ready(function() {

	var typeVideos = 'all';
	var pageVideos = 1;
	
	$('.txtTitle, .txtDescription').keyup(function(e){
		if($('#frmSaveUploadedVideo .wd-textare textarea').val()!='' && $('#frmSaveUploadedVideo .wd-input input').val()!='' && $('.wd-processing-line').attr('done')=='100'){
			$('.youlook-submit-action .wd-submit').removeAttr('disabled');
		} else {
			$('.youlook-submit-action .wd-submit').attr('disabled', 'disabled');
		}
		if($('#frmPostVideo .wd-textare textarea').val()!='' && $('#frmPostVideo .wd-input input').val()!=''){
			$('.youlook-post-action .wd-submit').removeAttr('disabled');
		} else {
			$('.youlook-post-action .wd-submit').attr('disabled', 'disabled');
		}
	});
	
	// add button cancel for upload video
	$(document).on('click', '#youlook-btnCancelVideoLink', function(){
		$('#frmPostVideo').hide();
		$('#lnkAddVideoLink').removeClass('disable-link');
	});
	$(document).on('click', '#youlook-btnCancelVideo', function(){
		$('#frmUploadVideo').hide();
		$('#lnkUploadVideo').removeClass('disable-link');
		$('button#youlook-cancel-upload-video').trigger('click');
	});
	
	$('.wd-type-add-video').click(function(){
		$('#frmAddVideoLink').hide();
	});
	
	$(document).on('click','.btnPostVideoLink',function(){
		$(this).hide();
		$(this).parent().find('#youlook-uploading-video-link').attr('disabled','disabled').show();
		$(this).parent().find('#youlook-btnCancelVideoLink').hide();
		$(this).parent().find('#youlook-btnCancelVideo').hide();
		if ($('.container-videos li').length>0){
			var obj = $('.youlook-buttons-video').find('.youlook-button-watch');
			obj.attr('href',homeURL+'/zone/'+zone.zonetype.config.homeURI+'?id='+obj.attr('ref')+'&tab=videos');
			obj.addClass('wd-viewmore-link view-page-videos').removeClass('youlook-button-watch');
		}
	});
	// link upload video
	$('#lnkUploadVideo').click(function() {
		if($(this).hasClass('disable-link')) return false;
		$('#youlook-title-post-video').val('');
		$('#youlook-content-post-video').val('');
		$('#btnAddFiles input').trigger('click');
		$('#youlook-uploading-video-link').hide();
		$('#btnPostVideoLink').show();
		return false;
	});

	// This method is used to toggle the Youtube video form
	$('#lnkAddVideoLink').click(function() {
		if($(this).hasClass('disable-link')) return false;
		$('.wd-post-video-youtube-pp').toggle();
		$('#frmSearchYoutube .txtKeyword').focus();
		$('#frmResultVideoYoutube').hide();
		$('#frmSearchYoutube .txtKeyword').val('');
		// $('#frmPostVideo').find('#btnPostVideoLink').removeAttr('disabled');
		return false;
	});
	
	var postVideoOptions = {
		dataType : 'json',
		success : function(res) {
			if (!res.error) {
				$('#frmUploadVideo').hide();
				$('#youlook-btnCancelVideo').show();
				
				var videos = $.tmpl($("#tmplMovieAddPostVideos"), res.result.videos);
				
				videos.find('.wd-description').greennetReplaceLink();
				videos.find('.wd-description').greennetExpand(zone.zonetype.video.config.videoDescriptionReadmore);
				videos.find("abbr.timeago").timeago();
				
				$("#youlook-no-video").hide();
				$("ul.container-top-videos").show().prepend(videos);
				$('.wd-tooltip-hover').tipsy({gravity: 's'});
				$('#lnkUploadVideo').removeClass('disable-link');
				
				$('.youlook-btnPostVideo').show();
				$('.youlook-btnPostVideo').parent().find('#youlook-uploading-video-link').hide();
				
			} else {
				alert(res.message);
			}
		}
	}
	$('#frmSaveUploadedVideo').ajaxForm(postVideoOptions);
	
	$('body').keydown(function(e){
		if (e.keyCode == 27) {
			$('#frmAddVideoLink').hide();
		}
	});
});

;(function($, scope){
	scope['AddVideoForm'] = function(options) {
		this.container = null;
		this.txtKeyword = null;
		this.btnSearch = null;
		this.btnPost = null,
		this.btnCancel = null,
		this.listVideoItems = null;
		
		/* default values */
		var _defaultOptions = {
			limit : 10,
			
			// DOM
			txtKeyword		: null,
			btnSearch		: null,
			container		: null,
			listVideoItems	: null,
			frmPost			: null,
			videoItem		: null,
			checkAll		: null,
			numberAdded		: null,
			frmSearch		: null,
			showMore		: null, 
			uploading		: null,
			
			// others
			videoItemTemplate : '',
			videosLoaded : function() {console.log('Need to implement this method');},
			
			// callbacks
			beforeRender : function() {console.log('Need to implement beforeRender method');},
			afterRender : function() {console.log('Need to implement afterRender method');},
			beforePost : function() {console.log('Need to implement beforePost method');},
			afterPost : function() {console.log('Need to implement afterPost method');},
			beforeCancel : function() {console.log('Need to implement beforePost method');},
			afterCancel : function() {console.log('Need to implement afterPost method');},
			afterSuccess : function() {console.log('Need to implement afterPost method');}
			
		};
		/* merge options */
		options = $.extend(true, {}, _defaultOptions, options);
		this.options = options;
		this.currentPage = 0;
		
		/* set some object from options to current object */
		if (options.txtKeyword != null) {
			this.txtKeyword = options.txtKeyword;
		}
		if (options.container != null) {
			this.container = options.container;
		}
		if (this.container != null) {
			if (this.txtKeyword == null) {
				this.txtKeyword = this.container.find('.txtKeyword');
			}
			if (this.btnSearch == null) {
				this.btnSearch = this.container.find('.btnSearch');
			}
			if (this.listVideoItems == null) {
				this.listVideoItems = this.container.find('.listYoutubeItems');
			}
			if (this.btnPost == null) {
				this.btnPost = this.container.find('.btnPostVideo');
			}
			if (this.btnCancel == null) {
				this.btnCancel = this.container.find('.btnCancelVideo');
			}
			if (this.frmPost == null) {
				this.frmPost = this.container.find('#frmResultVideoYoutube');
			}
			if (this.videoItem == null) {
				this.videoItem = this.container.find('.youtube-links-item');
			}
			if (this.checkAll == null) {
				this.checkAll = this.container.find('.youlook-check-all-content');
			}
			if (this.frmSearch == null) {
				this.frmSearch = this.container.find('#frmSearchYoutube');
			}
			if (this.showMore == null) {
				this.showMore = this.container.find('.youlook-show-more-youtube');
			}
			if (this.uploading == null) {
				this.uploading = this.container.find('.btnUploadningVideo');
			}
		}
		
		// Add some extra methods
		this.keyword = function() {
			return this.txtKeyword.val();
		};
		
		/* object form */
		var _form = this;
		var submit = true;
		/*
		 * This method is used to get results of youtube video
		 */
		this.getResults = function(page){

			var startIndex = page * options.limit + 1;
			var keyword = this.keyword();
			
			var regex = '[&|?]v=[a-zA-Z0-9\-_]+';
			
			var youtubeID = keyword.match(regex);
			if(youtubeID){
				keyword = youtubeID[0].substr(3);
			}
			$.ajax({
				url : "https://gdata.youtube.com/feeds/api/videos",
				type : 'get',
				dataType: 'jsonp',
				data : {
					q : keyword,
					safeSearch : 'none',
					'start-index' : startIndex,
					'max-results' : _form.options.limit,
					v : 2,
					alt : "jsonc"
				},
				success : function(res) {
					_form.options.beforeRender(res);
					
					if (typeof res.data != 'undefined' && typeof res.data.items != "undefined" && res.data.items.length > 0) {
						
						var _parent = $(_form.listVideoItems).parent();
						
						if(res.data.items.length>4 || _form.currentPage!=0){
							_parent.parent().css({'height': '280px'});
						} else {
							var height = res.data.items.length * 63-4;
							_parent.parent().css({'height': height+'px'});
						}
						
						for (var i = 0; i < res.data.items.length; i++) {
							var data = res.data.items[i];
							var item = zone.Element.create(data, {
								callback : function() {
								},
								templateID : 'tmplYoutubeItem'
							});
							item.find('.youlook-youtube-duration').greennetToTime();
							_form.listVideoItems.append(item);
							_form.showfrmPost();
						}
						
						var itemsShow = res.data.startIndex + options.limit;
						if(itemsShow>=res.data.totalItems){
							_form.showMore.hide();
						} else {
							_form.showMore.show();
						}
						
					} else {
						_form.hidefrmPost();
						alert("This keyword doesn't have any video!");
						_form.reset();
					}
					submit = true;
					/* call after render method */
					_form.options.afterRender(res);
				}
			});
			
		};
		// Post form
		this.btnPost.click(function() {
		
			/** before post*/
			_form.options.beforePost(_form);
			
			// var values = _form.frmPost.serializeArray();
			
			_form.upload();
			
			var _btn = $(this);
			$.ajax({
				type: "POST",
				url: _form.frmPost.attr( 'action' ),
				data: _form.frmPost.serialize(),
				dataType: 'json',
				success: function(res){
					if(!res.error){
						
						_form.reset();
						_form.hidefrmPost();
						_form.hidefrm();
						
						var addvideos = $.tmpl($("#tmplMovieAddVideos"), res.videos);
						
						addvideos.find('.wd-description').greennetReplaceLink();
						addvideos.find('.wd-description').greennetExpand(zone.zonetype.video.config.videoDescriptionReadmore);
						
						addvideos.find("abbr.timeago").timeago();
						
						_form.txtKeyword.val('');
						$("ul.container-top-videos").show().prepend(addvideos);

						_btn.removeClass('disabled').val('Post');
						
						
						_form.cancelUpload();
					} else {
						alert(res.message);
					}
					_form.options.afterSuccess(res, _form);
					_form.options.afterPost(res, _form);
				}
			});
			
			return false;
		});
		
		// reset form
		this.reset = function(){
			_form.currentPage = 0;
			_form.showMore.hide();
			_form.listVideoItems.html('');
			$(_form.btnPost).removeClass('disabled').val('Post');
			$(_form.container).find('.countItemSelected').html('0');
			$(_form.container).find('.wd-select-bt').removeClass('wd-selected-bt');
		};
		
		this.hidefrmPost = function(){
			this.frmPost.hide();
		};
		this.showfrmPost = function(){
			this.frmPost.show();
		};
		this.hidefrm = function(){
			this.container.hide();
		};
		this.upload = function(){
			$(_form.uploading).show();
			$(_form.btnPost).hide();
			$(_form.btnCancel).hide();
			_form.btnSearch.attr('disabled','disabled');
			_form.txtKeyword.attr('disabled','disabled');
		};
		this.cancelUpload = function(){
			// before cancel
			_form.options.beforeCancel();
			
			_form.txtKeyword.val('');
			$(_form.uploading).hide();
			$(_form.btnPost).show();
			$(_form.btnCancel).show();
			_form.btnSearch.removeAttr('disabled','disabled');
			_form.txtKeyword.removeAttr('disabled','disabled');
			
			// after cancel
			_form.options.afterCancel();
		};
		/**
		 * Add event listener
		 */
		this.frmSearch.submit(function(){
			if(submit){
				submit = false;
				_form.reset();
				_form.getResults(0);
			}
			return false;
		});
		this.btnCancel.click(function() {
			$(_form.container).hide();
			_form.cancelUpload();
			_form.reset();
			return false;
		});
		this.showMore.click(function(){
			_form.currentPage++;
			_form.getResults(_form.currentPage);
			_form.checkAll.find('.wd-select-bt').removeClass('wd-selected-bt');
			return false;
		});
		this.checkAll.click(function(){
			$(this).find('.wd-select-bt').toggleClass('wd-selected-bt');
			if(_form.checkAll.find('span').hasClass('wd-selected-bt')){
				_form.listVideoItems.find('li').each(function(e) {
					$(this).addClass('wd-links-item-selected');
					var input = '<input type="text" class="youtubeIds" name="ZoneResourceVideo[youtubeIds][]" style="display:none" value="'+$(this).attr('ref')+'">'
					$(this).prepend(input);
					$(this).find('.wd-select-bt').addClass('wd-selected-bt');
				});
				$(_form.container.selector).find('.countItemSelected').html($(_form.listVideoItems.selector).find('li').length);
			} else {
				_form.listVideoItems.find('li').each(function(e) {
					$(this).removeClass('wd-links-item-selected');
					$(this).find('input').remove();
					$(this).find('.wd-select-bt').removeClass('wd-selected-bt');
				});
				_form.container.find('.countItemSelected').html('0');
			}
			
		});
		jQuery(document).on('click', _form.container.selector + ' .listYoutubeItems li', function(){

			if($(this).hasClass('wd-links-item-selected')){
				$(this).find('.wd-select-bt').removeClass('wd-selected-bt');
				$(this).find('input').remove();
				$(this).removeClass('wd-links-item-selected');
				$(_form.container).find('.countItemSelected').html(parseInt($(_form.container).find('.countItemSelected').html())-1);
			} else {
				$(this).find('.wd-select-bt').addClass('wd-selected-bt');
				var input = '<input type="text" class="youtubeIds" name="ZoneResourceVideo[youtubeIds][]" style="display:none" value="'+$(this).attr('ref')+'">'
				$(this).prepend(input);
				$(this).addClass('wd-links-item-selected');
				$(_form.container).find('.countItemSelected').html(parseInt($(_form.container).find('.countItemSelected').html())+1);
			}
			
			var check = true;
			$(_form.container.selector).find(".listYoutubeItems li" ).each(function(e) {
				if(!$(this).hasClass('wd-links-item-selected')){
					check =  false;
				}
			});
			if(check){
				$(_form.checkAll.selector).find(".wd-select-bt").addClass('wd-selected-bt');
			} else {
				$(_form.checkAll.selector).find(".wd-select-bt").removeClass('wd-selected-bt');
			}
			
		});
	};
})(jQuery, zone['zonetype']['video']);