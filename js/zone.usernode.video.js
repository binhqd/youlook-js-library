/**/
;
(function($, scope) {
	scope['video'] = {
		mainContainer : null,
		videoContainer : null,
		albumContainer : null,
		config: {
			limit : 12
		},
		init: function(options) {
			zone.zonetype.video.init();
			
			var _defaultOptions = {
				mainContainer 	: $('#container-videos')
			};
			
			options = $.extend(true, {}, _defaultOptions, options);
			
			this.mainContainer = options.mainContainer;
			
			// photo container
			if (typeof options.videoContainer != "undefined") {
				this.videoContainer = options.videoContainer;
			} else {
				this.videoContainer = this.mainContainer.find('ul.container-videos');
			}
			
		},
		GUI : {
			showContainer : function() {
				zone.usernode.video.mainContainer.show();
				zone.usernode.video.videoContainer.show();
			}
		}
	};
})(jQuery, zone['usernode']);