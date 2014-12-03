$(document).ready(function() {
	$(".view-page-videos").on('click',function(e){
		var url =  $(this).attr('href');
		var nodeID = $(this).attr('ref');
		var type = $(this).attr('type');
		$("html, body").animate({ scrollTop:"400px" },1000);
		zone.movieState.loadVideo = {
			url : homeURL+"/api/node/videos?id="+nodeID+"&page=1&limit=10&type="+type
		};
		
		$('#video-loading').html('').append(zone.movieState.loadingDiv.show());
		zone.movieState.Actions.loadVideos(url);
		return false;
	});
	
	$('#lnkAddVideoLink').click(function() {
//		$('#frmSaveUploadedVideo').remove();
		$('#frmAddVideoLink').toggle();
		$('#frmAddVideoLink').focus();
		
//		if ($('#frmAddVideoLink').css('display') != 'none') {
//			$('#frmPostVideo').hide();
//		}
		return false;
	});
	
	$('body').keydown(function(e){
		if (e.keyCode == 27) {
			$('#lnkAddVideoLink').trigger('click');
		}
	});
	$('.wd-type-add-video').click(function(){
		$('#frmAddVideoLink').hide();
	});
	
	$('#btnPostVideoLink').click(function(){
		
		if ($('.container-videos li').length>0){
			var obj = $('.youlook-buttons-video').find('.youlook-button-watch');
			obj.attr('href',homeURL+'/zone/movie?id='+obj.attr('ref')+'&tab=videos');
			obj.addClass('wd-viewmore-link view-page-videos').removeClass('youlook-button-watch');
		}
	});
	
	$('#btnAddVideoLink').click(function() {
		var link = $('#txtAddVideoLink').val();
		
		var RegExp = /(http):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

		if(RegExp.test(link)){
			$.ajax({
				type : 'POST',
				url : homeURL + '/video/fetchUrl',
				data : 'url=' + encodeURIComponent(link),
				success : function(res) {
					if (!res.error) {
						// hide post link
						
						$('#frmAddVideoLink').hide();
						
						// show form
						var _form = $('#frmPostVideo');
						_form.find('.txtTitle').val(res.result.title);
						_form.find('.txtDescription').val(res.result.description);
						
						if (typeof res.result.thumbnails[0] != "undefined") {
							var thumbnail = res.result.thumbnails[0];
							_form.find('.imgThumbnail').load(function() {
								_form.show();
							});
							_form.find('.imgThumbnail').attr('src', thumbnail.url);
						}
						_form.find('.txtUrl').val(link);
					} else {
						alert(res.message);
					}
				}
			});
		}else{
			alert("Your entered url is invalid. Please try again");
		}
		return false;
	});
	
	var postVideoLinkOptions = {
		success : function(res) {
			if (!res.error) {
				$('#frmPostVideo').hide();
				
				var videos = $.tmpl($("#tmplMovieVideos"), res.result);
				
				videos.find('.wd-description').greennetExpand(zone.zonetype.video.config.videoDescriptionReadmore);
				
				$('#txtAddVideoLink').val('');
				
				$("ul.container-videos .no-video").hide();
				$("ul.container-videos").prepend(videos);
			} else {
				alert(res.message);
			}
		}
	}
	$('#frmPostVideo form').ajaxForm(postVideoLinkOptions);
	
	// link upload video
	$('#lnkUploadVideo').click(function() {
		$('#btnAddFiles input').trigger('click');
		return false;
	});
	
	var postVideoOptions = {
		success : function(res) {
			if (!res.error) {
				$('#frmUploadVideo').hide();
				
				var videos = $.tmpl($("#tmplMovieVideos"), res.result);
				
				videos.find('.wd-description').greennetExpand(zone.zonetype.video.config.videoDescriptionReadmore);
				
				$("ul.container-videos .no-video").hide();
				$("ul.container-videos").prepend(videos);
			} else {
				alert(res.message);
			}
		}
	}
	$('#frmSaveUploadedVideo').ajaxForm(postVideoOptions);
});