$(document).ready(function() {
	var pathPart = homeURL + '/api/user/topics?page=';
	var queryPart = '&u='+encodeURIComponent(viewingUser.username)+'&limit=' + zone.zonetype.following.config.limit;
	// Handling event on state poping
	$( window ).bind( "popstate", function( e ) {
		var returnLocation = history.location || document.location;
		if(returnLocation.href.indexOf('tab=topics') > 0 ){
			$("html, body").animate({ scrollTop:"350px" },1000);
			
			// Perform loading topics
			zone.zonetype.following.Actions.loadTopics();
		}
	});
	
	$(".view-page-topics").on('click',function(e){
		// push state
		var stateURL = $(this).attr('href');
		zone.History.pushState(stateURL);
		$("html, body").animate({ scrollTop:"350px" },1000);

		zone.zonetype.following.Actions.loadTopics();
		return false;
	});
	// ======= End video section ==================================================
});