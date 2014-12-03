/**/
;
(function($, scope) {
	scope['activity'] = $.extend(true, {}, zone.activity, {
		mainContainer : null,
		listActivityContainer : null,
		config: {
			limit : 10
		},
		
		GUI : {
			showActivityContainer : function() {
				zone.zonetype.activity.mainContainer.show();
				zone.zonetype.activity.listActivityContainer.show();
			}
		}
	});
	
})(jQuery, zone['zonetype']);