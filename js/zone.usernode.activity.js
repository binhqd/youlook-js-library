/**/
;(function($, scope) {
	scope['activity'] = $.extend(true, {}, zone.activity, {
		mainContainer : null,
		listActivityContainer : null,
		config: {
			limit : 10
		},
		
		GUI : {
			showActivityContainer : function() {
				zone.usernode.photo.mainContainer.show();
				zone.usernode.photo.photoContainer.show();
			}
		}
	});
	
})(jQuery, zone['usernode']);

zone.usernode.activity.statusForm = zone.Form.Default;