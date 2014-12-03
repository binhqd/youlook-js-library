// Load the SDK asynchronously
(function(){
	// If we've already installed the SDK, we're done
	if (document.getElementById('facebook-jssdk')) {return;}

	// Get the first script element, which we'll use to find the parent node
	var firstScriptElement = document.getElementsByTagName('script')[0];

	// Create a new script element and set its id
	var facebookJS = document.createElement('script'); 
	facebookJS.id = 'facebook-jssdk';

	// Set the new script's source to the source of the Facebook JS SDK
	facebookJS.src = '//connect.facebook.net/en_US/all.js';

	// Insert the Facebook JS SDK into the DOM
	firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
}());

function getFacebookContacts() {
	zone.invites.contactTmpl = $('#contact-item');
	zone.invites.friendTmpl = $('#friend-item');
	zone.invites.facebookContactContainer = $('#invite-by-facebook');
	zone.invites.getFacebookContacts();
}
function getGmailContacts() {
	zone.invites.contactTmpl = $('#contact-item');
	zone.invites.friendTmpl = $('#friend-item');
	zone.invites.gmailContactContainer = $('#invite-by-gmail');
	zone.invites.getGmailContacts();
}
function getYahooContacts() {
	zone.invites.contactTmpl = $('#contact-item');
	zone.invites.friendTmpl = $('#friend-item');
	zone.invites.yahooContactContainer = $('#invite-by-yahoo');
	zone.invites.getYahooContacts();
}
$(document).ready(function(){
	var FACEBOOK_REDIRECT = '/welcome';
	zone.invites.initFilterMembersInput($('.filterFriendName'));

	$('#btnInviteFromFacebook').on('click', function() {
		var href=$(this).attr('href');
		var winFacebook = window.open(href, "Facebook Account", 'width=500, height=400');

		var pollFacebookTimer   =   window.setInterval(function() { 
			try {
				if (winFacebook.document.URL.indexOf(FACEBOOK_REDIRECT) != -1) {
					window.clearInterval(pollFacebookTimer);
					winFacebook.close();
					$("#invite-by-facebook-notconnect").fadeOut(function(){
						$("#invite-by-facebook").fadeIn(function(){
							getFacebookContacts();
						});
					});
				}
			} catch(e) {
			}
		}, 500);
		
		return false;
	});

	var GMAIL_REDIRECT = '/welcome';
	$('#btnInviteFromGmail').on('click', function() {
		var href=$(this).attr('href');
		var win = window.open(href, "Google Account", 'width=800, height=600');

		var pollTimer = window.setInterval(function() { 
			try {
				if (win.document.URL.indexOf(GMAIL_REDIRECT) != -1) {
					window.clearInterval(pollTimer);
					win.close();
					$("#invite-by-gmail-notconnect").fadeOut(function(){
						$("#invite-by-gmail").fadeIn(function(){
							getGmailContacts();
						});
					});
				}
			} catch(e) {
			}
		}, 500);
		
		return false;
	});

	var YAHOO_REDIRECT = '/welcome';
	$('#btnInviteFromYahoo').on('click', function() {
		var href=$(this).attr('href');
		var win = window.open(href, "Yahoo Account", 'width=800, height=600');

		var pollTimer = window.setInterval(function() { 
			try {
				if (win.document.URL.indexOf(YAHOO_REDIRECT) != -1) {
					window.clearInterval(pollTimer);
					win.close();
					$("#invite-by-yahoo-notconnect").fadeOut(function(){
						$("#invite-by-yahoo").fadeIn(function(){
							getYahooContacts();
						});
					});
				}
			} catch(e) {
			}
		}, 500);
		
		return false;
	});

	$('#inviteFriendEmailForm').submit(function(){
		zone.invites.email.sendDataInviteFriend($(this));
		return false;
	});
});