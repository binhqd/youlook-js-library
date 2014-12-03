;(function($, scope){
	scope['syncfacebook'] = {
		SYNC_FACEBOOK_REDIRECT: '/facebook/syncPhotos',
		GET_FACEBOOK_PHOTO_URL: '/facebook/syncPhotos',
		afterCheckPhotoPermission: function() {},
		afterGetFacebookPhotos: function(response) {},
		checkPhotoPermission: function($link)
		{
			var href = $link.attr('data-url');
			try {
				var winFacebook = window.open(href, "Sync Facebook Photos", 'width=600, height=500');
			} catch ($ex) {
				jAlert('Sorry. This feature does not work at the current version brower.\nPlease update the lastest version and try again.', 'Error');
				return;
			}

			var pollFacebookTimer = window.setInterval(function() { 
				try {
					if (winFacebook.document.URL.indexOf(scope.syncfacebook.SYNC_FACEBOOK_REDIRECT) != -1) {
						window.clearInterval(pollFacebookTimer);
						winFacebook.close();

						scope.syncfacebook.afterCheckPhotoPermission();
					}
				} catch(e) {
				}
			}, 500);
		},
		getFacebookPhotos: function()
		{
			$.ajax({
				dataType: 'json',
				cache: false,
				url: scope.syncfacebook.GET_FACEBOOK_PHOTO_URL,
				success: function(response) {
					scope.syncfacebook.afterGetFacebookPhotos(response);
				}
			});
		}
	};
})(jQuery, zone['photo']);