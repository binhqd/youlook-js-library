$(document).ready(function() {
	
	zone.zonetype.follower.init();
	
	var pathPart = homeURL+"/followings/list/followers/token/object_" + zoneid;
	var refresh = true;
	// Handling event on state poping
	$( window ).bind( "popstate", function( e ) {
		if(refresh){
			var returnLocation = history.location || document.location;
			if(returnLocation.href.indexOf('tab=followers') > 0 ){
				$('.page-container').hide();
				$('#follower-loading').html('').append(zone.movieState.loadingDiv.show());
				zone.zonetype.follower.destroy();
				
				var url = $.url(returnLocation.href);
				zone.zonetype.follower.Actions.loadFollowers(pathPart);
				
			}
			refresh = false;
		}
	});
	
	$(".view-page-followers").on('click',function(e){
		$('.page-container').hide();
		$(this).addClass('disable-link');
		
		$("html, body").animate({ scrollTop:"400px" },1000);
		
		// push state
		zone.zonetype.History.pushState(homeURL + '/' + zone.zonetype.config.homeURI + '?id=' + zoneid + '&tab=followers');
		
		// Cleanup container
//		zone.zonetype.follower.destroy();
		$('.container-followers').html('');
		
		// Show loading
		$('#follower-loading').html('').append(zone.movieState.loadingDiv.show());
		
		// Perform loading videos
		zone.zonetype.follower.Actions.loadFollowers(pathPart);
		return false;
	});
});