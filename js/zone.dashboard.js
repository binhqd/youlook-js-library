;(function($, scope) {
	scope['dashboard'] = {
		GUI : {
			Titles : {
				myTopics : '',
				myFriends : '',
				recommendedTopics : '',
				newVideos : '',
				newMembers : ''
			},
			FriendRequestsSection : {
				callback : function (link, status, response) {
					if (status == 'accept' || status == 'deny') {
						var user_id = response.user_id;
						var $item = $('.js-friend-request-item[data-user_id="'+user_id+'"]');
						$item.fadeOut(function(){
							$.ajax({
								url: homeURL + '/api/friends/pendingFriends?limit=6',
								dataType: 'json',
								type: 'POST',
								success: function(response) {
									var totalRequests = response.total;
									if (totalRequests <= 3) {
										$('.js-friend-requests-viewall').fadeOut();
									}
									if (totalRequests == 0) {
										$('#containerFriendRequestSection').fadeOut();
										return;
									}
									$('.js-friend-requests-total').html(totalRequests);
									$.each(response.data, function(idata, edata) {
										var isExists = false;
										var data = edata;
										$('.js-friend-request-item').each(function(index, element){
											if (data.id == $(element).data('user_id')) 
												isExists = true;
										});
										if (isExists == false) {
											var res = response;
											res.data = [data]; res.total = 1; res.oneElement = true;
											var html = $.tmpl($('#tmplDashboardFriendRequestSection'), res);
											$('#containerFriendRequestSection ul').append(html);
											html.hide().fadeIn();
											$.Friends.initLinks(html.find(".js-friend-request"));
											$.each(html.find(".js-friend-request"), function(index, element) {
												element.callback = function(link, status, response) {
													zone.dashboard.GUI.FriendRequestsSection.callback(link, status, response);
												}
											})
											return;
										}
									});
								}
							});
						});
					}
				},
				showAll: function() {
					$.ajax({
						url: homeURL + '/api/friends/pendingFriends?limit=1000',
						dataType: 'json',
						type: 'POST',
						success: function(response) {
							var html = $.tmpl($('#tmplDashboardFriendRequestSection'), response);
							$('#containerFriendRequestSection').html(html);
							$.Friends.initLinks(html.find(".js-friend-request"));
							$.each(html.find(".js-friend-request"), function(index, element) {
								element.callback = function(link, status, response) {
									zone.dashboard.GUI.FriendRequestsSection.callback(link, status, response);
								}
							});

							html.find(".js-friend-requests-total,.js-friend-requests-viewall").click(function(){
								if ($(this).text() <= 3) return false;
								zone.dashboard.GUI.FriendRequestsSection.showAll();
								return false;
							});
						}
					});
				}
			}
		}
	};
})(jQuery, zone);

$(document).ready(function(){
	zone.photo.init();
});