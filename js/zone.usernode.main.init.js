zone.usernode.init();
$(document).ready(function() {
	// init main usernode information
	
	
	// init photo library
	zone.photo.init({});
	
	// init activity library, may to move to zone.activity
	
	$.Friends.initLinks($('.js-friend-request'));
	
	$('.lnkHome').click(function() {
		var stateURL = $(this).attr('href');
		zone.usernode.History.pushState(stateURL);
		
		zone.usernode.GUI.cleanup();
		zone.usernode.GUI.showContainer();
		
		// get activities
		zone.usernode.activity.Actions.getActivities(viewingUser.id);
		
		//zone.tempCategories.Actions.getUserActivities(zoneid);
		
		return false;
	});
//	
//	// ========== Friends ==========
//	$('#btnAddfriend').click(function() {
//		
//	});
//
//	$('#btnUnfriend').click(function() {
//		
//	});
	
});