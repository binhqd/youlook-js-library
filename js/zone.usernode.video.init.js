$(document).ready(function() {
	/**
	 * Video section
	 */
	var typeVideos = 'all';
	var pageVideos = 1;
	
	var options = {
		mainContainer 	: $('#container-videos')
	};
	options.videoContainer = options.mainContainer.find('ul.container-videos');
	zone.usernode.video.init(options);
	
	var pathPart = homeURL + '/api/user/videos?page=';
	var queryPart = '&u='+encodeURIComponent(viewingUser.username)+'&limit='+zone.zonetype.video.config.limit+'&type=all';
	
	// Handling event on state poping
	$( window ).bind( "popstate", function( e ) {
		var returnLocation = history.location || document.location;
		if(returnLocation.href.indexOf('tab=videos') > 0 ){
			$("html, body").animate({ scrollTop:"200px" },1000);
			
			zone.usernode.GUI.cleanup();
			zone.usernode.video.GUI.showContainer();
			
			zone.zonetype.video.Actions.loadVideos(pathPart, queryPart);
		}
	});
	
	$(".view-page-videos").on('click',function(e){
		$("html, body").animate({ scrollTop:"200px" },1000);
		
		zone.usernode.GUI.cleanup();
		zone.usernode.video.GUI.showContainer();
		
		var stateURL =  $(this).attr('href');
		// push state
		zone.History.pushState(stateURL);
		
		// Perform loading videos
		zone.zonetype.video.Actions.loadVideos(pathPart, queryPart);
		return false;
	});
	// ======= End video section ==================================================
});