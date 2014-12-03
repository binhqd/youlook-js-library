/**
 * app.chat.tpl.js
 * Author by @ndaidong at Twitter
 * Copyright by *.bjlab.us, *.youlook.net
*/

var Template = Template || {}

Template.oneUser = [
	'<div class="user-item" collection="{COLLECTION}" related="{USERID}">',
		'<div class="indent">',
			'<div class="left">',
				'<div class="avatar" style="background-image:url({AVATAR});"></div>',
			'</div>',
			'<div class="right">',
				'<div class="display-name">{DISPLAY_NAME}</div>',
				'<div class="user-status" related="{USERID}">',
					'<span class="status-icon" id="_statusIcon_{COLLECTION}_{USERID}" related="{USERID}"></span>',
					'<span class="status-text" id="_statusText_{COLLECTION}_{USERID}" related="{USERID}">Offline</span>',
				'</div>',
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

