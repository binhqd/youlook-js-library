$(document).ready(function() {
	var options = {
		mainContainer 	: $('div.main-zonetype-container')
	};
	
	options.listActivityContainer = options.mainContainer.find('ul.listActivities');
	
	zone.zonetype.activity.init(options);
	
	zone.zonetype.GUI.cleanup();
	
	var returnLocation = history.location || document.location;
	if(returnLocation.href.indexOf('tab=')==-1){
		zone.zonetype.GUI.showContainer();
	}
	
	zone.zonetype.activity.getActivities({
		pathPart	: homeURL + '/api/node/activities?page=',
		queryPart	: '&limit=' + zone.zonetype.activity.config.limit + '&id=' + zoneid
	});
});