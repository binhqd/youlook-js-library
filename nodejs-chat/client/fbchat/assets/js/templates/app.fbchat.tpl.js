/**
 * app.chat.tpl.js
 * Author by @ndaidong at Twitter
 * Copyright by *.bjlab.us, *.youlook.net
*/

var Template = Template || {}

Template.oneUser = [
	'<div class="user-item" id="_friend_{USERID}" related="{USERID}">',
		'<div class="indent">',
			'<div class="left">',
				'<div class="avatar" style="background-image:url({AVATAR});"></div>',
			'</div>',
			'<div class="right">',
				'<div class="display-name">{DISPLAY_NAME}</div>',
			'</div>',
		'</div>',
	'</div>'
].join('');

Template.me = [
	'<div class="user-me" id="_me_{USERID}" related="{USERID}">',
		'<div class="indent">',
			'<div class="avatar" style="background-image:url({AVATAR});"></div>',
			'<div class="display-name">{DISPLAY_NAME}</div>',
		'</div>',
	'</div>'
].join('');

Template.msgTextBlock = [
	'<div class="msg-text-block">',
		'<div class="left">',
			'<div class="avatar" style="background-image:url({AVATAR});"></div>',
		'</div>',
		'<div class="right">',
			'<div class="msg-text" id="_m_{MSGID}"><div class="msg-phrase">{TEXT}</div></div>',
		'</div>',
	'</div>'
].join('');

Template.dialog = {};

Template.dialog.confirm = [
	'<div class="head">{TITLE}</div>',
	'<div class="body">{MESSAGE}</div>',
	'<div class="foot">',
		'<button class="positive" id="btnPositive">Yes, I do</button>',
		'<button class="negative" id="btnNegative">Cancel</button>',
	'</div>',
].join('');

Template.inviteBox = [
	'<div class="head">Hi {NAME}</div>',
	'<div class="body">It seems that you are alone here. You should invite a few your Facebook friends to join this room.</div>',
	'<div class="foot">',
		'<a href="{LINK}" target="_blank">',
			'<button class="positive" id="btnInvite">Share on Facebook</button>',
		'</a>',
		'<button class="negative" id="btnCancelInvite">Dismiss</button>',
	'</div>'
].join('');

