;(function($, scope){
	scope['profile'] = {
		init : function(){
		},
		deleteMessage : function(){
			$('body').on('click', '.deletePost', function(e){
				var _this = $(this);
				jConfirm('Are you sure you want to delete this?', 'Delete', function(r) {
					if(r){
						
						$.get(_this.attr('href'),function(res){
							if(res.error){
								alert(res.message);
							}else{
								$("."+_this.attr('item')).fadeOut(500);
							}
						});
					}
				});
				
				return false;
			});
		},
		Event:{
			loadEventUploadAvatar: function(){
				$('body').on('click', '#triggerUploadAvatar', function(e){
					$("#frmSingleUpload input[type='file']").trigger('click');
				});
			},
			viewVideo:function(){
				$('body').on('click', '.view-video', function(e){
					var tarGet = $(this).attr('target');
					$("#"+tarGet).html('<iframe width="100%" height="400" src="http://www.youtube.com/embed/'+$(this).attr('key')+'" frameborder="0" allowfullscreen></iframe>');
				});
			}
		},
		data:{

		},
		objHtml:{
			item:null
		}
	}
})(jQuery, zone);

;(function($, scope){
	scope['SyncPhotoFacebook'] = {
		init : function(){

		},
		Event : {
			btnSyncFacebook: function(){
				var href = $(this).attr('href');
				
				$('.js-button-sync-photo').click(function(){
					var href = $(this).attr('href');
					var win = window.open(href, "Check Photo Permission", 'width=480, height=200');

					var pollTimer = window.setInterval(function() { 
						try {
							if (win.document.URL.indexOf(zone.SyncPhotoFacebook.SYNC_URL) != -1) {
								var isAllow = win.document.URL.indexOf('error=access_denied') == -1;
								window.clearInterval(pollTimer);
								win.close();
								if (isAllow) zone.SyncPhotoFacebook.Event.syncPhotos();
							}
						} catch(e) {
						}
					}, 500);

					return false;
				});
			},
			migrate: function(id){
				$.ajax({
					url : homeURL + '/facebook/getPhoto?id=' + id,
					success : function(res) {
						if (res.error) {
							// console.log(res);
						} else {
							zone.SyncPhotoFacebook.currentDone++;
							var percent = Math.round(zone.SyncPhotoFacebook.currentDone / zone.SyncPhotoFacebook.total * 100);
							
							$(".step2 .wd-text-loading").html(zone.SyncPhotoFacebook.currentDone+'/'+zone.SyncPhotoFacebook.total);
							
							zone.SyncPhotoFacebook.i++;
							if (typeof zone.SyncPhotoFacebook.source[zone.SyncPhotoFacebook.i] != "undefined") zone.SyncPhotoFacebook.Event.migrate(zone.SyncPhotoFacebook.source[zone.SyncPhotoFacebook.i].id);
							if (zone.SyncPhotoFacebook.currentDone == zone.SyncPhotoFacebook.total) {
								//todo
								
								if(zone.SyncPhotoFacebook.source.length != 0){
									var _imageSyncFb = "";
									$.each(zone.SyncPhotoFacebook.source,function(x,y){
										if(x<=2){
											_imageSyncFb += '<a class="wd-image-syncface"><img src="'+y.source+'"  height="53" width="53"></a>';
										}
									});
									$(".pullImageSyncFb").html(_imageSyncFb);
									$.get(homeURL+"/users/edit/refreshStateUser",function(res){
									
									});
								}
								$(".step2").remove();
								// window.location.href = homeURL+"/userphotos?uid="+jlbd.user.collection.current.user.id;
							}
						}
					} 
				});
			},
			syncPhotos: function(){
				$(".step1,.step4").remove();
				// $('.wd-syncphoto-avatar').animate({opacity:0.2});
				// $('.image-select-loading-fb').show();
				
				$.ajax({
					url: zone.SyncPhotoFacebook.SYNC_URL,
					type: 'POST',
					dataType: "json",
					beforeSend: function() {
						
						
					},
					success: function(response) {
						if(response.source.length==0){
							$(".step2 .wd-text-loading").html(response.done+'/'+response.total);
							$.get(homeURL+"/users/social/getPhotoFB",function(res){
								if(res.error){
								
								}else{
									if(res.data.length !=0){
										var _imageSyncFb = "";
										$.each(res.data,function(x,y){
											_imageSyncFb += '<a class="wd-image-syncface"><img src="'+y.source+'"  height="53" width="53"></a>';
											
										});
										$(".pullImageSyncFb").html(_imageSyncFb);
										$.get(homeURL+"/users/edit/refreshStateUser",function(res){
										
										});
										$(".step2").remove();
									}
								}
							});
						}else{
							if (parseInt(response.done) < parseInt(response.total)) {
								var intSync = response.total - response.done;
								zone.SyncPhotoFacebook.total = parseInt(response.total);
								zone.SyncPhotoFacebook.source = response.source;
								zone.SyncPhotoFacebook.currentDone = parseInt(response.done);
								
								$(".step2 .wd-text-loading").html(response.done+'/'+response.total);
								
								if (typeof zone.SyncPhotoFacebook.source[0] != "undefined") zone.SyncPhotoFacebook.Event.migrate(zone.SyncPhotoFacebook.source[0].id);
								if (typeof zone.SyncPhotoFacebook.source[1] != "undefined") zone.SyncPhotoFacebook.Event.migrate(zone.SyncPhotoFacebook.source[1].id);
								if (typeof zone.SyncPhotoFacebook.source[2] != "undefined") zone.SyncPhotoFacebook.Event.migrate(zone.SyncPhotoFacebook.source[2].id);
								zone.SyncPhotoFacebook.i = 2;
								// $('.wd-syncphoto-avatar').animate({opacity:1});
								// $('.image-select-loading-fb').hide();
							} else {							
								// window.location.href = homeURL+"/userphotos?uid="+jlbd.user.collection.current.user.id;
							}
						}
					},error: function (xhr, ajaxOptions, thrownError) {
						console.log(xhr.responseText);
						// $('.image-select-loading-fb').show();
					}
				});
			}
		},
		Actions : {
		
		},
		objHtml:{

		},
		SYNC_URL : homeURL+'/facebook/syncPhotos',
		source : [],
		total : 0,
		currentDone : 0,
		i : 0
	}
})(jQuery, zone);

$().ready(function(e){
	zone.profile.deleteMessage();
	
	zone.profile.Event.viewVideo();
	zone.profile.Event.loadEventUploadAvatar();
	
	zone.SyncPhotoFacebook.Event.btnSyncFacebook();
});

$(document).ajaxSend(function() {
	$( ".mz-submit" ).attr('disabled','disabled');
});
$(document).ajaxSuccess(function() {
	$( ".mz-submit" ).removeAttr('disabled');
});

$(document).ajaxError(function() {
  $( ".mz-submit" ).removeAttr('disabled');
});
$(document).ajaxComplete(function() {
	try{

		$('.wd-tooltip-hover-html').tipsy({html: true,gravity: 's',fade: true});
		
		
	}catch(e){
	
	}
});