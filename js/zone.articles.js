// Class
;(function($, scope){
	scope['articles'] = {
		/**
		 * This method is used to delete article
		 */
		delete: function($link) {
			var strUrl = $link.data('url');
			var $container = $($link.data('container'));
			$.ajax({
				url: strUrl,
				dataType: 'JSON',
				success: function(response) {
					if (!response.error) {
						$container.remove();
					}
				}
			});
		},

		/**
		 * This method is used to init actions friend links
		 */
		initLinks: function($links){
			$links.click(function(){
				var $link = $(this);
				jConfirm('Are you sure you want to delete this article?', 'Delete article', function(answer) {
					if (answer) {
						zone.articles.delete($link);
					}
				});
			});
		}
	};
})(jQuery, zone);