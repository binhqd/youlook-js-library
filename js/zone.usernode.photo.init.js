$(document).ready(function() {
	var options = {
		mainContainer 	: $('#photoMainContainer')
	};
	
	options.photoContainer = options.mainContainer.find('ul.photoContainer');
	options.albumContainer = options.mainContainer.find('ul.albumContainer');
	
	zone.usernode.photo.init(options);
	zone.zonetype.formAddPhoto.init();

	// Handling event on state poping
	$( window ).bind( "popstate", function( e ) {
		var returnLocation = history.location || document.location;
		if(returnLocation.href.indexOf('tab=photos') > 0 ) {
			zone.usernode.GUI.cleanup();
			zone.usernode.photo.config.page = 1;
			var url = $.url(returnLocation.href);
			var action = url.param('action');
			$('#submenu-photo li').removeClass('wd-active');
			$("html, body").animate({scrollTop: "200px"}, 1000);
			switch (action) {
				case 'albums':
					zone.photo.init();
					zone.usernode.photo.GUI.showAlbumContainer();
					$('#submenu-photo-album').addClass('wd-active');
					zone.usernode.photo.Actions.loadAlbums();
					break;
				case 'relateds':
					zone.usernode.photo.GUI.showProfileContainer();
					$('#submenu-photo-related').addClass('wd-active');
					$('#lnkShowPostPhoto').hide();
					zone.usernode.photo.Actions.loadRelateds();
					break;
				case 'contributeds':
					zone.photo.init();
					zone.usernode.photo.GUI.showAlbumContainer();
					$('#submenu-photo-contributed').addClass('wd-active');
					$('#lnkShowPostPhoto').hide();
					zone.usernode.photo.Actions.loadContributeds();
					break;
				case 'photos_of_object':
					/*Set Photo Init*/
					zone.photo.init();
					zone.usernode.photo.GUI.showPhotoContainer();
					$('#submenu-photo-contributed').addClass('wd-active');
					$('#lnkShowPostPhoto').hide();
					var object_id = url.param('object_id');
					zone.usernode.photo.Actions.photosOfObject(viewingUser.username, object_id);
					break;
				case 'album_detail':
					zone.photo.init();
					zone.usernode.photo.GUI.showPhotoContainer();
					$('#submenu-photo-album').addClass('wd-active');
					var album_id = url.param('album_id');
					/*Append input album_id*/
					zone.usernode.photo.Actions.loadAlbumDetail(album_id);
					$('form#formAddAlbumPhotos').append('<input type="hidden" name="album_id" value="'+album_id+'">');
					break;
				default:
					zone.photo.init();
					zone.usernode.photo.GUI.showProfileContainer();
					$('#submenu-photo-profile').addClass('wd-active');
					$('#lnkShowPostPhoto').hide();
					zone.usernode.photo.Actions.loadProfilePhotos();
					break;
			}
		}
	});
	
	
	// For profile photos
	$(document).on('click',".viewProfilePhotos", function(e) {
		var _this = $(this);
		_this.css("pointer-events","none").removeClass("viewProfilePhotos");
		_this.attr("onClick","javascript: void(0); return false");
		/*Set Photo Init*/
		zone.photo.init();

		zone.usernode.GUI.cleanup();
		zone.usernode.photo.GUI.showProfileContainer();
		$('#submenu-photo li').removeClass('wd-active');
		$('#submenu-photo-profile').addClass('wd-active');
		$('#pull-form-upload').hide();
		$('#lnkShowPostPhoto').hide();

		var stateURL = _this.attr('href');
		zone.History.pushState(stateURL);
		$("html, body").animate({scrollTop: "200px"}, 1000);

		$('.js-loading').css({'display':'block'});
		zone.zonetype.formAddPhoto.init();
		zone.usernode.photo.config.page = 1;
		zone.usernode.photo.Actions.loadProfilePhotos();

		return false;
	});
	
	// For related photos
	$(document).on('click', ".viewRelatedPhotos",function(e) {
		var _this = $(this);
		_this.css("pointer-events","none").removeClass("viewRelatedPhotos");
		_this.attr("onClick","javascript: void(0); return false");
		/*Set Photo Init*/
		//zone.photo.init();

		zone.usernode.GUI.cleanup();
		zone.usernode.photo.GUI.showProfileContainer();

		$('#submenu-photo li').removeClass('wd-active');
		$('#submenu-photo-related').addClass('wd-active');
		$('#pull-form-upload').hide();
		$('#lnkShowPostPhoto').hide();

		var stateURL = _this.attr('href');
		zone.History.pushState(stateURL);
		$("html, body").animate({scrollTop: "200px"}, 1000);

		$('.js-loading').css({'display':'block'});
		zone.usernode.photo.config.page = 1;
		zone.usernode.photo.Actions.loadRelateds();
		
		return false;
	});
	
	/* View albums*/
	$(document).on('click',".viewAlbums", function(e) {
		var _this = $(this);
		_this.css("pointer-events","none").removeClass("viewAlbums");
		_this.attr("onClick","javascript: void(0); return false");

		/*Set Photo Init*/
		zone.photo.init();

		zone.usernode.GUI.cleanup();
		zone.usernode.photo.GUI.showAlbumContainer();

		$('#submenu-photo li').removeClass('wd-active');
		$('#submenu-photo-album').addClass('wd-active');
		$('#pull-form-upload').hide();
		$('#lnkShowPostPhoto').show();
		zone.usernode.GUI.clearPostPhotoForm();

		var stateURL = _this.attr('href');
		zone.History.pushState(stateURL);
		$("html, body").animate({scrollTop: "200px"}, 1000);

		$('.js-loading').css({'display':'block'});
		zone.zonetype.formAddPhoto.init();
		zone.usernode.photo.config.page = 1;
		zone.usernode.photo.Actions.loadAlbums();
		
		return false;
	});

	/* View contributed photos*/
	$(document).on('click',".viewContributedPhotos", function(e) {
		var _this = $(this);
		_this.css("pointer-events","none").removeClass("viewContributedPhotos");
		_this.attr("onClick","javascript: void(0); return false");

		/*Set Photo Init*/
		zone.photo.init();

		zone.usernode.GUI.cleanup();
		zone.usernode.photo.GUI.showAlbumContainer();

		$('#submenu-photo li').removeClass('wd-active');
		$('#submenu-photo-contributed').addClass('wd-active');
		$('#pull-form-upload').hide();
		$('#lnkShowPostPhoto').hide();

		var stateURL = _this.attr('href');
		zone.History.pushState(stateURL);

		$("html, body").animate({scrollTop: "200px"}, 1000);

		$('.js-loading').css({'display':'block'});
		zone.usernode.photo.config.page = 1;
		zone.usernode.photo.Actions.loadContributeds();

		return false;
	});
	
	// scroll form post
	$("#containerPostedPhotos").jScrollPane({
		horizontalGutter: 5,
		verticalGutter: 0,
		mouseWheelSpeed: 50,
		autoReinitialise: true,
		showArrows: false
	});

	/*Load more*/
	var $elementLoading = $('.js-loadmore-button');
	if ($elementLoading.length <= 0) return;
	var callback = function() {
		if ($elementLoading.length <= 0) return;
		var offsetTop = $elementLoading.offset().top;
		if ($elementLoading.css('display') != 'none' && offsetTop < $(window).scrollTop() + $(window).height()) {
			$elementLoading.trigger("click");
		}
	};
	$(window).scroll(function() {
		callback();
	});
	$('.js-loadmore-button').on("click",function(){
		var _type = $(this).attr('data-type');
		$('.js-loadmore-button').css({'display':'none'});
		$('.js-loading').css({'display':'block'});
		switch(_type) {
			case 'profile' :
				zone.usernode.photo.config.page++;
				zone.usernode.photo.Actions.loadProfilePhotos();
				break;
			case 'album' :
				zone.usernode.photo.config.page++;
				zone.usernode.photo.Actions.loadAlbums();
				break;
			case 'album-detail' :
				var _albumID = $(this).attr('album_id');
				zone.usernode.photo.config.page++;
				zone.usernode.photo.Actions.loadAlbumDetail(_albumID);
				break;
			case 'related' :
				zone.usernode.photo.config.page++;
				zone.usernode.photo.Actions.loadRelateds();
				break;
			case 'contributed' :
				zone.usernode.photo.config.page++;
				zone.usernode.photo.Actions.loadContributeds();
				break;
			default:
				var _username = $(this).attr('data-user');
				var _objectID = $(this).attr('object_id');
				zone.usernode.photo.config.page++;
				zone.usernode.photo.Actions.photosOfObject(_username,_objectID);
		}
	});

	
});