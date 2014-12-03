/**/
;(function($, scope){
	scope['following'] = {
		mainContainer : null,
		config : {
			 limit : 10
		},
		init : function(zoneid) {
			this.mainContainer = $('#usernode-followings');
			this.listFollowingContainer = $('ul#usernode-list-followings');
		},
		Actions : {
			loadFollowings : function() {
				zone.usernode.GUI.cleanup();
				zone.zonetype.following.Actions.showContainer();
				
				/*Load photo*/
				var pathPart = homeURL + '/api/user/followings?page=';
				var queryPart = '&u='+encodeURIComponent(viewingUser.username)+'&limit=' + zone.zonetype.following.config.limit;
				
				zone.List.setup({
					pathPart : pathPart, 
					queryPart : queryPart,
					cache : {
						enable : true,
						dataset : 'followings'
					},
					limit : zone.zonetype.following.config.limit,
					success : function(res) {
						jQuery.each( res.data || [], function( i, val ) {	
						
							// render item
							zone.List.renderItem(val, {
								templateID : 'tmplUserNodeFollowingItem',
								callback : function(renderedItem) {
									//renderedItem.find('.timeago').timeago();
									zone.zonetype.following.listFollowingContainer.append(renderedItem);
									
									$.Followings.initLinks(renderedItem.find('.js-following-request'));
									
									renderedItem.find('.node-description').greennetExpand({
										readMoreText	: 'Read more',
										readLessText	: 'Read less',
										numberOfWord	: 220,
										readLess		: false,
										readMore		: false
									});
								}
							});
						})
					},
					container : zone.zonetype.following.listFollowingContainer
				});
			},
			loadTopics : function() {
				zone.usernode.GUI.cleanup();
				zone.zonetype.following.Actions.showContainer();
				
				/*Load photo*/
				var pathPart = homeURL + '/api/user/topics?page=';
				var queryPart = '&u='+encodeURIComponent(viewingUser.username)+'&limit=' + zone.zonetype.following.config.limit;
				
				zone.List.setup({
					pathPart : pathPart, 
					queryPart : queryPart,
					cache : {
						enable : true,
						dataset : 'owned-topics'
					},
					limit : zone.zonetype.following.config.limit,
					success : function(res) {
						jQuery.each(res.data || [], function(i,val){
							// render item
							zone.List.renderItem(res.data[i], {
								templateID : 'tmplUserNodeFollowingItem',
								callback : function(renderedItem) {
									//renderedItem.find('.timeago').timeago();
									zone.zonetype.following.listFollowingContainer.append(renderedItem);
									
									$.Followings.initLinks(renderedItem.find('.js-following-request'));
									
									renderedItem.find('.node-description').greennetExpand({
										readMoreText	: 'Read more',
										readLessText	: 'Read less',
										numberOfWord	: 220,
										readLess		: false,
										readMore		: false
									});
								}
							});
						})
					},
					container : zone.zonetype.following.listFollowingContainer
				});
			},
			showContainer:function(){
				zone.zonetype.following.mainContainer.show();
				zone.zonetype.following.listFollowingContainer.fadeIn(500);
			}
		}
	};
})(jQuery, zone['zonetype']);