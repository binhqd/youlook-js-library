/**/
;(function($, scope) {
	scope['activity'] = $.extend(true, {}, zone.activity, {
		mainContainer : null,
		listActivityContainer : null,
		config: {
			limit : 10
		},
		
		GUI : {
//			showActivityContainer : function() {
//				zone.dashboard.photo.mainContainer.show();
//			}
		}
	});
	
})(jQuery, zone['dashboard']);

zone.dashboard.activity.statusForm = zone.Form.Default;