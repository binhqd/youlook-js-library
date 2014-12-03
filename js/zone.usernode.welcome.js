/**/
;
(function($, scope) {
	scope['welcome'] = {
		suggestPeople : {
			currentOffset : 10,
			listFriendsContainer : null,
			listFriendsTemplate : null,
			loadingContainer : null,
			initShowMoreButton : function($element, res) {
				if (res.error) return;
				if (res.data.length == 10) {
					$element.fadeIn();
				} else {
					$element.fadeOut();
					return;
				}
				$element.click(function(){
					scope['welcome'].suggestPeople.currentOffset += 10;
					var loadingContainer = zone.usernode.welcome.suggestPeople.loadingContainer;
					$.ajax({
						dataType	: 'json',
						method		: 'POST',
						cache		: false,
						url			: '/api/node/suggestFriends?limit=10&offset='+scope['welcome'].suggestPeople.currentOffset,
						beforeSend	: function() {
							$element.hide();
							loadingContainer.show();
						},
						success		: function(res) {
							$element.show();
							loadingContainer.hide();
							if (res.error) return;
							if (res.data.length == 10) {
								$element.fadeIn();
							} else {
								$element.fadeOut();
							}
							var listFriendsContainer = zone.usernode.welcome.suggestPeople.listFriendsContainer;
							var listFriendsTemplate = zone.usernode.welcome.suggestPeople.listFriendsTemplate;
							if (listFriendsContainer) {
								listFriendsContainer.append('<div id="list-friends-page-'+scope['welcome'].suggestPeople.currentOffset+'"></div>');
								var rendered = listFriendsContainer.find('#list-friends-page-'+scope['welcome'].suggestPeople.currentOffset);
								rendered.append(
									$.tmpl(listFriendsTemplate, res)
								);
								$.Friends.initLinks(rendered.find(".js-friend-request"));
							}
						}
					});
				});
			}
		},
		findFriends : {
			currentPage : 1,
			keyword : '',
			listFriendsContainer : null,
			listFriendsTemplate : null,
			loadingContainer : null,
			searchUrl : '/friends/list/find?filterByStrangers=true&keyword=',
			initShowMoreButton : function($element, res) {
				if (res.error) return;
				if (res.data.linkPager.pages.currentPage < res.data.linkPager.pages.pageCount-1) {
					$element.fadeIn();
				} else {
					$element.fadeOut();
					return;
				}
				$element.click(function(){
					scope['welcome'].findFriends.currentPage++;
					var loadingContainer = zone.usernode.welcome.findFriends.loadingContainer;
					$.ajax({
						dataType	: 'json',
						method		: 'POST',
						cache		: false,
						url			: scope['welcome'].findFriends.searchUrl+scope['welcome'].findFriends.keyword+'&page='+scope['welcome'].findFriends.currentPage,
						beforeSend	: function() {
							$element.fadeOut(function(){
								loadingContainer.fadeIn();
							});
						},
						success		: function(res) {
							loadingContainer.fadeOut(function(){
								$element.fadeIn();
							});
							if (res.error) return;
							if (res.data.linkPager.pages.currentPage < res.data.linkPager.pages.pageCount-1) {
								$element.fadeIn();
							} else {
								$element.fadeOut();
							}
							var listFriendsContainer = zone.usernode.welcome.findFriends.listFriendsContainer;
							var listFriendsTemplate = zone.usernode.welcome.findFriends.listFriendsTemplate;
							if (listFriendsContainer) {
								listFriendsContainer.append('<div id="list-friends-page-'+res.data.linkPager.pages.currentPage+'"></div>');
								var rendered = listFriendsContainer.find('#list-friends-page-'+res.data.linkPager.pages.currentPage);
								rendered.append(
									$.tmpl(listFriendsTemplate, res)
								);
								$.Friends.initLinks(rendered.find(".js-friend-request"));
							}
						}
					});
				});
			}
		},
		findTopics : {
			currentPage : 1,
			keyword : '',
			listTopicsContainer : null,
			listTopicsTemplate : null,
			loadingContainer : null,
			searchUrl : '/landingpage?notSelectFollowing=true&limit=15&notGetArticles=true&keyword=',
			initShowMoreButton : function($element, res) {
				if (res.data.nodes.length >= 15) {
					$element.fadeIn();
				} else {
					$element.fadeOut();
					return;
				}
				var loadingContainer = zone.usernode.welcome.findTopics.loadingContainer;
				$element.click(function(){
					scope['welcome'].findTopics.currentPage++;
					$.ajax({
						dataType	: 'json',
						method		: 'POST',
						cache		: false,
						url			: scope['welcome'].findTopics.searchUrl+scope['welcome'].findTopics.keyword+'&page='+scope['welcome'].findTopics.currentPage,
						beforeSend	: function() {
							$element.fadeOut(function(){
								loadingContainer.fadeIn();
							});
						},
						success		: function(res) {
							loadingContainer.fadeOut(function(){
								$element.fadeIn();
							});
							if (res.data.nodes.length >= 15) {
								$element.fadeIn();
							} else {
								$element.fadeOut();
							}
							var listTopicsContainer = zone.usernode.welcome.findTopics.listTopicsContainer;
							var listTopicsTemplate = zone.usernode.welcome.findTopics.listTopicsTemplate;
							if (listTopicsContainer) {
								listTopicsContainer.append('<div id="list-topics-page-'+res.page+'"></div>');
								var rendered = listTopicsContainer.find('#list-topics-page-'+res.page);
								rendered.append(
									$.tmpl(listTopicsTemplate, res)
								);
								$.Followings.initLinks(rendered.find(".js-following-request"));
							}
						}
					});
				});
			}
		}
	};
})(jQuery, zone['usernode']);