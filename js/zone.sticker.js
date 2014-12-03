// Class
;(function($, scope){
	scope['sticker'] = {
		// pool variables
		_pool : {},
		
		// init function
		setup : function(options) {
			var _defaultOptions = {
				//limit : 10,
				//partPart : '',
				//queryPart : '',
				//itemRenderer : function(data) {
				//	console.log('Need to implement ');
				//}
			};
			
			//options = $.extend(true, {}, _defaultOptions, options);
			
			// setup
			/*zone.List.setup({
				pathPart : options.pathPart, 
				queryPart : options.queryPart,
				cache : {
					enable : true,
					dataset : 'activities' 
				},
				limit : options.limit,
				success : function(res) {
					for (var i = 0; i < res.data.length; i++) {
						// render item
						zone.usernode.article.Actions.renderArticleItem(res.data[i]);
					}
				},
				container : zone.usernode.article.listArticleContainer
			});*/
		}
	};
})(jQuery, zone);