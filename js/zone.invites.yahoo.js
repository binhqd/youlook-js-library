;(function($, scope){
	scope['yahoo'] = {
		dataUrl : '',
		callback : function(res) {},
		callbackError : function() {},
		getContacts : function()
		{
			$.ajax({
				url : scope['yahoo'].dataUrl,
				dataType : 'json',
				cache : false,
				error: function() {
					scope['yahoo'].callbackError();
				},
				success: function(res) {
					scope['yahoo'].callback(res);
				}
			});
		},
		Libs: {
			initInviteAction: function($container) {
				$container.find('li a.js-invite').click(function() {
					var _this = $(this);

					var itemID = $(this).parent().find('div.info').attr('ref');

					$.ajax({
						dataType: 'json',
						cache : false,
						type: 'POST',
						url: "/invites/yahoo/send/to/" + encodeURIComponent(itemID),
						beforeSend : function() {
							_this.html('Processing...');
							_this.addClass('wd-invite-processing-bt');
						},
						success: function(response){
							_this.removeClass('wd-invite-processing-bt');
							if(response.error) {
								_this.html('Invite');
								_this.addClass('wd-invite-bt');
								_this.removeClass('wd-re-invite-bt');
							} else {
								_this.html('Re-Invite');
								_this.removeClass('wd-invite-bt');
								_this.addClass('wd-re-invite-bt');
								jAlert("Your invitation has been sent.", "Invite Friend");
							}
						}
					});
					
					return false;
				});
			}
		}
	};
})(jQuery, zone['invites']);