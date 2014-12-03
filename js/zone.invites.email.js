;(function($, scope){
	scope['email'] = {
		sendDataInviteFriend: function($objForm) {
			var urlRequest = $objForm[0].action,
				dataForm = $objForm.find('.groupInviteEmail .valInviteEmail');
			var n = 0;

			$.each(dataForm, function(key, obj) {
				var emailInput = $(obj).find('input.emailInviteFriend');
				var email = emailInput.val();
				$(obj).find('span.inviteSent').html('');
				if($.trim(email) != '') {
					n++;
					$.ajax({
						dataType: 'json',
						type: 'POST',
						cache : false,
						url: urlRequest+"/to/"+email,
						beforeSend : function(){
							$(obj).find('.js-loading').show();
						},
						complete : function(){
							$(obj).find('.js-loading').hide();
						},
						success: function(response){
							if(response.error) {
								if (response.message == 'Email is not a valid email address.')
									response.message = 'Email is invalid.';
								$(obj).find('span.inviteSent')
									.removeClass('wd-succ-mess')
									.addClass('wd-error-mess')
									.html(response.message);
							} else {
								$(emailInput).val('');
								$(obj).find('span.inviteSent')
									.removeClass('wd-error-mess')
									.addClass('wd-succ-mess')
									.html('Invite sent.');
							}
						}
					});
				}
			});
			if (n == 0) {
				$('.js-invite-validate').hide().fadeIn();
			} else {
				$('.js-invite-validate').fadeOut();
			}
		}
	};
})(jQuery, zone['invites']);