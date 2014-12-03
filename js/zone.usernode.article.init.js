$(document).ready(function() {
	zone.usernode.article.init();

	$( window ).bind( "popstate", function( e ) {
		var returnLocation = history.location || document.location;
		
		if (returnLocation.href.indexOf('tab=articles') > 0) {
			$("html, body").animate({ scrollTop:"200px" },1000);
			
			zone.usernode.GUI.cleanup();
			zone.usernode.article.GUI.showContainer();
			
			var pathPart = homeURL+"/api/user/articles?page=";
			var queryPart = "&u=" + encodeURIComponent(viewingUser.username);
			zone.usernode.article.Actions.loadArticles(pathPart, queryPart);
			
			return false;
		} else if (returnLocation.href.indexOf('action=article-detail') > 0) {
			$("html, body").animate({ scrollTop:"200px" }, 1000);
			
			zone.usernode.GUI.cleanup();
			zone.usernode.article.GUI.showDetailContainer();
			
			var url = $.url(returnLocation.href);
			var articleID = url.param('a_id');
			
			zone.usernode.article.Actions.loadArticleDetail(articleID);
			return false;
		}
	});

	$('#lnkViewMoreArticles, .lnkViewMoreArticles').click(function() {
		$("html, body").animate({ scrollTop:"200px" },1000);
		
		var stateURL = $(this).attr('href');
		zone.History.pushState(stateURL);
		
		zone.usernode.GUI.cleanup();
		zone.usernode.article.GUI.showContainer();
		
		var pathPart = homeURL+"/api/user/articles?page=";
		var queryPart = "&u=" + encodeURIComponent(viewingUser.username);
		zone.usernode.article.Actions.loadArticles(pathPart, queryPart);
		
		return false;
	});

	$('.js-attachment-photos').on('click',function(){
		var _this = $(this);
		var _token = _this.attr('token');

		$(".gallery"+_token).find("#disable input[type='file']").trigger("click");
	});
});