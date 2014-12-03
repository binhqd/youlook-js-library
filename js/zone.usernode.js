//zone.usernode.config = $.extend({}, zone.usernode.config, {
//	homeURI : 'person'
//});

;(function($, scope){
	scope['usernode'] = {
		mainContainer : null,
		config : {
			homeURI : 'user'
		},
		init : function() {
			this.mainContainer = $('#mainContainer');
			this.listActivitiesContainer = $('#listActivities');
		},
		History : {
			pushState : function(url) {
				if (!zone.zonetype.isPopState) {
					isHistory = typeof isHistory !== 'undefined' ? isHistory : 1;
					
					if (isHistory) {
						history.pushState( null, null , url);
					}
				}
			}
		},
		Actions : {
			
		},
		GUI : {
			showContainer:function(){
				zone.usernode.mainContainer.fadeIn(500);
				zone.usernode.activity.listActivityContainer.show();
			},
			cleanup : function() {
				// hide all
				$('.list-container, .page-container').hide();
				$('.js-loadmore-button').css({'display':'none'});
				$('.js-loadmore-button').removeAttr('album_id');
				$('form#formAddAlbumPhotos input[name="album_id"]').remove();
				$("#photo-not-found").hide();
				zone.usernode.photo.config.page = 1;
				var lists = $('.list-container');
				lists.html('');
				lists.infinitescroll('destroy');
				lists.data('infinitescroll', null);
			},
			clearPostPhotoForm: function() {
				$('#pull-form-upload').fadeOut(500);
				if($("#formAddAlbumPhotos input[name='album_id']").length == 0) {
					$('#txtAlbumTitle').val('');
					
				}

				$( "div[id*='pushImages']" ).html('');
				$( "div[id*='filesContainer']" ).html('');
				//$('#hiddenAlbumID').val('');
				objCountFile.photo.addFile = 0;
				objCountFile.photo.doneFile = 0;
				$("#btnPostAlbumPhoto").attr("disabled","disabled");
			}
		}
	};
})(jQuery, zone);