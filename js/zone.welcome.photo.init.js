$(document).ready(function(){
	$('#js-upload-a-photo-btn').click(function(){
		$('#wd-upload-photo-popup .js-upload-a-photo-select').show();
		$('#wd-upload-photo-popup .js-upload-a-photo-msg').hide();
		$("#wd-upload-photo-popup .js-upload-a-photo-uploading").hide();
	});

	var SYNC_FACEBOOK_REDIRECT = '/facebook/syncPhotos';
	$('.js-sync-facebook-photo-btn').click(function(){
		zone.photo.syncfacebook.afterCheckPhotoPermission = function() {
			$('#js-sync-facebook-photo-container .js-step-1').hide();
			$('#js-sync-facebook-photo-container .js-step-3').hide();
			$('#js-sync-facebook-photo-container .js-step-4').hide();
			$('#js-sync-facebook-photo-container .js-step-msg').hide();
			$('#js-sync-facebook-photo-container .js-step-2').show();

			zone.photo.syncfacebook.afterGetFacebookPhotos = function(response){
				var done = parseInt(response.done);
				var total = parseInt(response.total);
				var source = response.source;
				$('#js-sync-facebook-photo-container .js-step-1').hide();
				$('#js-sync-facebook-photo-container .js-step-2').hide();
				$('#js-sync-facebook-photo-container .js-step-3').hide();
				$('#js-sync-facebook-photo-container .js-step-4').hide();
				$('#js-sync-facebook-photo-container .js-step-msg').hide();
				if (source.length > 0) {
					$('#js-sync-facebook-photo-container .js-step-3 .js-sync-done').html(0);
					$('#js-sync-facebook-photo-container .js-step-3 .js-sync-total').html(source.length);
					$('#js-sync-facebook-photo-container .js-step-3').show();

					var images = [];

					var sync = function(current, total, source) {
						if (current >= source.length) {
							$('#js-sync-facebook-photo-container .js-step-3').hide();
							$('#js-sync-facebook-photo-container .js-step-4').show();
							var imagesHtml = $.tmpl($('#js-sync-photo-preview-tmpl'), images);
							$('#js-sync-photo-preview').append(imagesHtml);
							$('#js-sync-facebook-photo-container .js-step-4 .js-total-photos').html(current);
							return;
						}
						var id = source[current].id;
						var imgUrl = source[current].source;
						$.ajax({
							dataType : 'json',
							cache: false,
							url : homeURL + '/facebook/getPhoto?id=' + id,
							error: function() {
								$('#js-sync-facebook-photo-container .js-step-3').hide();
								$('#js-sync-facebook-photo-container .js-step-1').show();
							},
							success : function(res) {
								// if (res.error) {
								// 	console.log(res);
								// } else {
								// 	currentDone++;
								// 	$('#syncProgress span.done').html(currentDone);
								// }
								if (!res.error) {
									if (images.length < 7)
										images[images.length] = res.data;
								}
								$('#js-sync-facebook-photo-container .js-step-3 .js-sync-done').html(current+1);
								sync(current+1, total, source);
							} 
						});
					}

					sync(0, total, response.source);
				} else {
					$('#js-sync-facebook-photo-container .js-step-msg .js-sync-msg').html('No Picture Available');
					$('#js-sync-facebook-photo-container .js-step-msg').show();
				}
			};
			zone.photo.syncfacebook.getFacebookPhotos();
		};
		zone.photo.syncfacebook.checkPhotoPermission($(this));

		return false;
	});
});