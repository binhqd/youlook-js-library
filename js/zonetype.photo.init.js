$(document).ready(function() {
	zone.zonetype.photo.init();
	zone.zonetype.formAddPhoto.init();
	var refresh = true;
	// Handling event on state poping
	$( window ).bind( "popstate", function( e ) {
		if(refresh){
			refresh = false;
			var returnLocation = history.location || document.location;
			/*Set photo init*/
			zone.photo.init();
			if(returnLocation.href.indexOf('tab=photos') > 0 ){
				var stateURL = homeURL + '/' + zone.zonetype.config.homeURI + '?id=' + zoneid + '&tab=photos';
				/*Call event unit*/
				zone.zonetype.photo.Events.unit();
				zone.zonetype.formAddPhoto.Actions.cancel();
				/*Remove album_id*/
				$('#formAddAlbumPhotos input[name=album_id]').remove();
				/*Load photos*/
				zone.zonetype.photo.Actions.loadPhotos();
				return false;
			} else if (returnLocation.href.indexOf('tab=album') > 0 ) {
				var url = $.url(returnLocation.href);
				var albumID = url.param('album_id');
				/*Call event unit*/
				zone.zonetype.photo.Events.unit();
				zone.zonetype.formAddPhoto.Actions.cancel();
				if (typeof albumID != "undefined") {
					zone.zonetype.photo.Actions.loadPhotosOfAlbum(albumID);
				} else {
					zone.zonetype.photo.Actions.loadDirectPhotosOfNode(zoneid);
				}
			}
		}
	});

	$(document).on('click', ".view-page-photo", function(e) {
		var _this = $(this);
		_this.css("pointer-events","none").removeClass("view-page-photo");
		_this.attr("onClick","javascript: void(0); return false");
		/*Set photo init*/
		zone.photo.init();

		var stateURL = homeURL + '/' + zone.zonetype.config.homeURI + '?id=' + zoneid + '&tab=photos';
		zone.zonetype.History.pushState(stateURL);
		/*Call event unit*/
		zone.zonetype.photo.Events.unit();
		zone.zonetype.formAddPhoto.Actions.cancel();
		/*Remove album_id*/
		$('#formAddAlbumPhotos input[name=album_id]').remove();

		/*Load photo*/
		zone.zonetype.photo.Actions.loadPhotos();
		return false;
	});
});