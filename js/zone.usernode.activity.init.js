$(document).ready(function() {
	var options = {
		mainContainer 	: $('#mainContainer')
	};
	
	options.listActivityContainer = options.mainContainer.find('ul.listActivities');
	
	zone.usernode.activity.init(options);
	
	$( window ).bind( "popstate", function( e ) {
		var returnLocation = history.location || document.location;
		if (
			returnLocation.href.indexOf('tab=articles') < 0
			&& returnLocation.href.indexOf('tab=followings') < 0
			&& returnLocation.href.indexOf('tab=topics') < 0
			&& returnLocation.href.indexOf('tab=videos') < 0
			&& returnLocation.href.indexOf('tab=photos') < 0
			&& returnLocation.href.indexOf('action=article-detail') < 0
		) {
			// get activities
			zone.usernode.GUI.cleanup();
			zone.usernode.GUI.showContainer();
			
			zone.usernode.activity.getActivities({
				pathPart	: homeURL + '/api/user/activities?page=',
				queryPart	: '&limit=' + zone.usernode.activity.config.limit + '&id=' + viewingUser.id
			});
			//zone.tempCategories.Actions.getUserActivities(zoneid);
		}
	});
});