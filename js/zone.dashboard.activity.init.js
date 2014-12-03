$(document).ready(function() {
	var options = {
		mainContainer 	: $('#dashboard-main-container')
	};
	
	options.listActivityContainer = options.mainContainer.find('ul#dashboard-activity-container');
	
	zone.dashboard.activity.init(options);
	
	zone.dashboard.activity.getActivities({
		pathPart	: homeURL + '/api/user/activities?page=',
		queryPart	: '&limit=' + zone.dashboard.activity.config.limit + '&id=' + user.id
	});
});