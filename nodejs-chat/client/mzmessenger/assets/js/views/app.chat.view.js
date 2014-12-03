/**
 * app.chat.view.js
 * A demo for how to control view layer of chat tool.
 * Author by @ndaidong at Twitter
 * Copyright by *.bjlab.us, *.youlook.net
*/

var app = window.app || {};

;(function(){
	
	'use strict';
	
	var friendListHTML = '', meHTML = '';
	
	var R = bj.createView(app.chat, {
		init : function(){
			friendListHTML = bj.element('friendList').innerHTML;
			meHTML = bj.element('myInfo').innerHTML;
		},
		displayMe : function(){
			var me = R.Model.getCurrentUser();
			if(!me){
				return false;
			}
			var tpl = Template.me;
			tpl = tpl.replaceAll('{USERID}', me.userid);
			tpl = tpl.replaceAll('{AVATAR}', me.avatar);
			tpl = tpl.replaceAll('{DISPLAY_NAME}', me.displayName);
			bj.element('myInfo').innerHTML = tpl;
			
			var us = R.Model.getUserList();
			if(!!us){
				this.listUsers(us, 'userList', me);
			}
			this.showSignout();
		},
		showSignout : function(){
			
		},
		updateFriendList : function(){
			var fs = R.Model.getFriendList();
			if(!!fs){
				fs.forEach(function(user){
					var status = user.status || 0;
					var si = bj.element('_statusIcon_friendList_'+user.userid);
					var st = bj.element('_statusText_friendList_'+user.userid);
					if(!!si && !!st){
						if(status==1){
							si.addClass('online');
							st.innerHTML = 'Online';
						}
						else{
							si.removeClass('online');
							st.innerHTML = 'Offline';
						}
					}
				});
			}
		},
		listFriends : function(){
			var fs = R.Model.getFriendList();
			if(!!fs && fs.length>0){
				this.listUsers(fs, 'friendList');
			}
			else{
				var us = R.Model.getUserList();
				if(!!us){
					this.resetUI(us, 'userList');
				}
			}
		},
		listUsers : function(users, elm, exeptMe){
			var s = '';
			users.forEach(function(user){
				var tpl = Template.oneUser;
				tpl = tpl.replaceAll('{USERID}', user.userid);
				tpl = tpl.replaceAll('{AVATAR}', user.avatar);
				tpl = tpl.replaceAll('{DISPLAY_NAME}', user.displayName);
				tpl = tpl.replaceAll('{COLLECTION}', elm);
				s+=tpl;
			});
			bj.element(elm).innerHTML = s;
			this.updateList();
		},
		updateList : function(collection){
			var ls = bj.query('.user-item');
			var me = R.Model.getCurrentUser();
			ls.forEach(function(el){
				var uid = el.getAttribute('related');
				var col = el.getAttribute('collection');
				if(!collection || col==collection){
					if(col=='userList'){
						if(!me || uid!=me.userid){
							el.click(function(){
								R.Model.selectUser(uid);
							});
						}
						else{
							el.addClass('active');
						}
					}
					else{
						el.click(function(){
							R.Model.chatWithUser(uid);
						});						
					}
				}
			});
		},
		updateUserState : ChatBox.updateState,
		startChatWidth : ChatBox.open,
		showDialog : function(type, title, message, callback){
			var tpl = Template.dialog[type];
			tpl = tpl.replace('{TITLE}', title);
			tpl = tpl.replace('{MESSAGE}', message);
			
			bj.element('overlay').show();
			var el = bj.element('dialog');
			el.show();
			el.innerHTML = tpl;
			
			var ws = bj.getWindowSize();
			bj.element('dialog').css({top:(ws.h-110)/2, left:(ws.w-320)/2});
			bj.element('overlay').click(function(){
				R.hideDialog();
			});	
					
			if(type=='confirm'){
				bj.element('btnPositive').click(function(){
					R.hideDialog();
					callback(true);
				});	
				bj.element('btnNegative').click(function(){
					R.hideDialog();
				});				
			}
		},
		hideDialog : function(){
			bj.element('overlay').hide();
			var el = bj.element('dialog');
			el.hide();
			el.innerHTML = '';
		},
		onProcessing : function(msg){
			bj.element('overlay').show();
			var ws = bj.getWindowSize();
			var el = bj.element('messbox');
			el.show();
			el.css({top:(ws.h)/2-ws.h/5, left:(ws.w-320)/2});
			el.innerHTML = '<div class="processing">'+msg+'...</div>';
		},
		onFinish : function(){
			bj.element('overlay').hide();
			var el = bj.element('messbox');
			el.hide();
			el.innerHTML = '';
		},
		resetUI : function(us, el){
			this.listUsers(us, el);
			bj.element('friendList').innerHTML = friendListHTML;
			bj.element('myInfo').innerHTML = meHTML;
		},
		resetChatBox : function(){
			ChatBox.reset();
		}
	});
})();
