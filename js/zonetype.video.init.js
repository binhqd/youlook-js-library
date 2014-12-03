$(document).ready(function() {
	
	var typeVideos = 'all';
	var pageVideos = 1;
	var refresh = true;
	zone.zonetype.video.init();
	
	var pathPart = homeURL+"/api/node/videos?page=";
	var queryPart = "&id="+zoneid+"&limit="+zone.zonetype.video.config.limit+"&type=";
	
	// Handling event on state poping
	$(window).bind( "popstate", function(e) {
		if(refresh){
			var returnLocation = history.location || document.location;
			if(returnLocation.href.indexOf('tab=videos') > 0 ){
				$('.page-container').hide();
				$('#video-loading').html('').append(zone.movieState.loadingDiv.show());
				zone.zonetype.video.destroy();
				var url = $.url(returnLocation.href);
				var type = url.param('type');
				
				zone.zonetype.video.Actions.loadVideos(pathPart, (queryPart + type), 'all');
			}
			refresh = false;
		}
	});
	
	$(".view-page-videos").on('click',function(e){
		$('.page-container').hide();
		$(this).addClass('disable-link');
		
		var type = $(this).attr('type');
		
		$("html, body").animate({ scrollTop:"310px" },1000);
		
		// push state
		zone.zonetype.History.pushState(homeURL + '/' + zone.zonetype.config.homeURI + '?id=' + zoneid + '&tab=videos&type=' + type);
		
		// Cleanup container
		zone.zonetype.video.destroy();
		
		// Show loading
		$('#video-loading').html('').append(zone.movieState.loadingDiv.show());
		
		// Perform loading videos
		
		zone.zonetype.video.Actions.loadVideos(pathPart, (queryPart + type), type);
		return false;
	});
});