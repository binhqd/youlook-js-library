;(function($, scope){
	scope['invites'] = {
		contactTmpl : null,
		friendTmpl : null,
		facebookContactContainer : null,
		facebookAppId : null,
		gmailContactContainer : null,
		yahooContactContainer : null,
		getFacebookContacts : function()
		{
			scope.invites.facebook.dataUrl = '/invites/facebook';
			scope.invites.facebook.callbackError = function() {
				$("#invite-by-facebook").fadeOut(function(){
					$("#invite-by-facebook-notconnect").fadeIn();
				});
			};
			scope.invites.facebook.callback = function(res) {
				FB.init({appId: scope.invites.facebookAppId, status : true, oauth: true, cookie: true});

				var notMembers = $.tmpl(scope.invites.contactTmpl, res.people.notMembers);
				scope.invites.facebookContactContainer.find(".not-member").empty();
				notMembers.appendTo(scope.invites.facebookContactContainer.find(".not-member"));
				if (res.people.notMembers.length == 0)
					scope.invites.facebookContactContainer.find(".not-member").append('<div style="text-align: center;margin: 50px;font-size: 30px;color: #aaa;">Not found!</div>');

				var members = $.tmpl(scope.invites.friendTmpl, res.people.members);
				scope.invites.facebookContactContainer.find(".member").empty();
				members.appendTo(scope.invites.facebookContactContainer.find(".member"));
				$.Friends.initLinks(scope.invites.facebookContactContainer.find(".js-friend-request"));
				if (res.people.members.length == 0)
					scope.invites.facebookContactContainer.find(".member").append('<div style="text-align: center;margin: 50px;font-size: 30px;color: #aaa;">Not found!</div>');
				scope.invites.facebook.Libs.initInviteAction(scope.invites.facebookContactContainer);
			};
			scope.invites.facebook.getContacts();
		},
		getGmailContacts : function()
		{
			scope.invites.gmail.dataUrl = '/invites/gmail';
			scope.invites.gmail.callbackError = function() {
				$("#invite-by-gmail").fadeOut(function(){
					$("#invite-by-gmail-notconnect").fadeIn();
				});
			};
			scope.invites.gmail.callback = function(res) {
				if (res.error) {
					if (res.message == 'Not connected or access token has expired') {
						$("#invite-by-gmail").fadeOut(function(){
							$("#invite-by-gmail-notconnect").fadeIn();
						});
					} else {
						scope.invites.gmailContactContainer.find(".not-member").empty();
						scope.invites.gmailContactContainer.find(".member").empty();
						scope.invites.gmailContactContainer.find(".not-member").append('<div style="text-align: center;margin: 50px;font-size: 30px;color: #aaa;">Not found!</div>');
						scope.invites.gmailContactContainer.find(".member").append('<div style="text-align: center;margin: 50px;font-size: 30px;color: #aaa;">Not found!</div>');
					}
					return;
				}
				var notMembers = $.tmpl(scope.invites.contactTmpl, res.notMembers);
				scope.invites.gmailContactContainer.find(".not-member").empty();
				notMembers.appendTo(scope.invites.gmailContactContainer.find(".not-member"));
				if (res.notMembers.length == 0)
					scope.invites.gmailContactContainer.find(".not-member").append('<div style="text-align: center;margin: 50px;font-size: 30px;color: #aaa;">Not found!</div>');

				var members = $.tmpl(scope.invites.friendTmpl, res.members);
				scope.invites.gmailContactContainer.find(".member").empty();
				members.appendTo(scope.invites.gmailContactContainer.find(".member"));
				$.Friends.initLinks(scope.invites.gmailContactContainer.find(".js-friend-request"));
				if (res.members.length == 0)
					scope.invites.gmailContactContainer.find(".member").append('<div style="text-align: center;margin: 50px;font-size: 30px;color: #aaa;">Not found!</div>');
				scope.invites.gmail.Libs.initInviteAction(scope.invites.gmailContactContainer);
			}
			scope.invites.gmail.getContacts();
		},
		getYahooContacts : function()
		{
			scope.invites.yahoo.dataUrl = '/invites/yahoo';
			scope.invites.yahoo.callbackError = function() {
				$("#invite-by-yahoo").fadeOut(function(){
					$("#invite-by-yahoo-notconnect").fadeIn();
				});
			};
			scope.invites.yahoo.callback = function(res) {
				var notMembers = $.tmpl(scope.invites.contactTmpl, res.notMembers);
				scope.invites.yahooContactContainer.find(".not-member").empty();
				notMembers.appendTo(scope.invites.yahooContactContainer.find(".not-member"));
				if (res.notMembers.length == 0)
					scope.invites.yahooContactContainer.find(".not-member").append('<div style="text-align: center;margin: 50px;font-size: 30px;color: #aaa;">Not found!</div>');

				var members = $.tmpl(scope.invites.friendTmpl, res.members);
				scope.invites.yahooContactContainer.find(".member").empty();
				members.appendTo(scope.invites.yahooContactContainer.find(".member"));
				$.Friends.initLinks(scope.invites.yahooContactContainer.find(".js-friend-request"));
				if (res.members.length == 0)
					scope.invites.yahooContactContainer.find(".member").append('<div style="text-align: center;margin: 50px;font-size: 30px;color: #aaa;">Not found!</div>');
				scope.invites.yahoo.Libs.initInviteAction(scope.invites.yahooContactContainer);
			}
			scope.invites.yahoo.getContacts();
		},
		initFilterMembersInput : function($input)
		{
			$input.keyup(function() {
				var _this = $(this);
				var _val = _this.val();
				var _parent = _this.parent().parent();
				// check if filter value has at least 2 characters
				if (_val.length == 0) {
					_parent.find(".not-member li").show();
				}
				if (_val.length < 1) return;
				var r = new RegExp(_val, 'i'); 
				_parent.find(".not-member li").hide().removeHighlight()
					.filter(function(){ return $(this).find('.wd-name').text().match(r) }).highlight(_val).show();
			});
		}
	};
})(jQuery, zone);