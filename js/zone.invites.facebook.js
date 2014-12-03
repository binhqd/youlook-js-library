;(function($, scope){
	scope['facebook'] = {
		accessToken : null,
		userInfo : null,
		dataUrl : '',
		callback : function(res) {},
		callbackError : function() {},
		getContacts : function()
		{
			$.ajax({
				url : scope['facebook'].dataUrl,
				dataType : 'json',
				cache : false,
				error: function() {
					scope['facebook'].callbackError();
				},
				success: function(res) {
					scope['facebook'].callback(res);
				}
			});
		},
		Libs: {
			initInviteAction: function($container) {
				$container.find('li a.js-invite').click(function() {
					var _this = $(this);
					FB.ui({
						method: 'send',
						name: 'Join Youlook',
						link: 'http://youlook.net/',
						description : '',
						to : $(this).parent().find('.info').attr('ref'),
						picture : CDNUrl + '/upload/user-photos/' + user.id + '/fill/200-200/' + user.profile.image + '?album_id=' + user.id,
						display : 'iframe'
					},
					function(response) {
						if (typeof response != "undefined" && response != null && response.success) {
							_this.removeClass('wd-invite-bt').addClass('wd-re-invite-bt').html('Re-Invite');

							var itemID = _this.parent().find('div.info').attr('ref');

							var receiver = {
								'name'	: _this.parent().find('.info').text(),
								'image'	: _this.parent().find('img').attr('src')
							};
							$.ajax({
								dataType: 'json',
								type: 'POST',
								cache : false,
								url: "/invites/facebook/send/to/" + encodeURIComponent(itemID) + '?userinfo=' + encodeURIComponent(JSON.stringify(user)) + '&receiver=' + encodeURIComponent(JSON.stringify(receiver)),
								success: function(response){
									if(response.error) {
									} else {
										_this.html('Re-Invite');
										_this.removeClass('wd-invite-bt');
										_this.addClass('wd-re-invite-bt');
									}
								}
							});
						}
					});

					return false;
				});
			}
		}
	};
})(jQuery, zone['invites']);