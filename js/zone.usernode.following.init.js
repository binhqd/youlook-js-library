$(document).ready(function() {
	zone.zonetype.following.init();
	// Handling event on state poping
	$( window ).bind( "popstate", function( e ) {
		var returnLocation = history.location || document.location;
		if(returnLocation.href.indexOf('tab=followings') > 0 ){
			$("html, body").animate({ scrollTop:"200px" },1000);
			
			// Perform loading followings
			zone.zonetype.following.Actions.loadFollowings();
		}
	});
	
	$(".view-page-followings").on('click',function(e){
		// push state
		var stateURL = $(this).attr('href');
		zone.History.pushState(stateURL);
		$("html, body").animate({scrollTop: "200px"}, 1000);
		
		// Perform loading followings
		zone.zonetype.following.Actions.loadFollowings();
		return false;
	});
});