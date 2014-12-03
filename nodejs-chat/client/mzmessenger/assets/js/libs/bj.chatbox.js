/**
 * bj.chatbox.js
 * BellaJS ChatBox provide an global ChatBox object to manage chat windows
 * Author by @ndaidong at Twitter
 * Copyright by *.bjlab.us, *.youlook.net
*/
;(function(_parent){
	
	"use strict";
	
	var chatSender = null;
	var limit = 3; // max number of chatbox opened in same time, when user opens the 4th, 1st will be closed (similar Gmail chat, but it allows 4 or 5);
	var collection  = []; // all chatbox
	var opening = []; // all opened chatbox
	
	var Conversation = {}; //an object contains all messages object in order of time
	
	
//					var sender = R.Model.getCurrentUser();
				//	var receiver = R.Model.getFriendById(winid);
	var _cb = {
		id : null,
		el : null,
		icon : null,
		reader : null,
		input : null,
		lastActive : null, // used to control more window state in future
		status : 0, // 0=unitialized, 1=created, 2=opened, 3=minimized, 4=closed
		friend : '', // who you are chatting with, this user's ID is also unique id of chatbox object
		conversation : null, // 
		onopen : function(){
			ChatBox.onopen(this);
			this.reader.scrollTop = this.reader.scrollHeight;
			this.input.focus();
			this.lastActive = bj.now();
		},
		close : function(){
			if(this.status!=4){
				this.el.hide();
				this.status = 4;
				ChatBox.onclose(this);
			}
		},
		open : function(){
			if(this.status!=2){
				this.el.show();
				this.status = 2;
				this.onopen();
			}			
			else{
				this.input.focus();
			}
		},
	/** Todo:
		restore : function(){},
		minimize : function(){},
		focus : function(){},
		blur : function(){},
		onTyping : function(){},
		onSending : function(){},
		onReceiving : function(){},
	**/
		onInserted : function(){
			this.reader.scrollTop = this.reader.scrollHeight;
			this.lastActive = bj.now();
		},
		insert : function(msg){
			var id = msg.id;
			var txt = msg.text;
			var sender = msg.sender;
			var receiver = msg.receiver;
			
			if(!!ChatBox.textHandle){
				txt = ChatBox.textHandle(txt);
				msg.text = txt;
			}
			
			var lastMsg = this.conversation[0] || null;
			if(!!lastMsg){
				var lastSender = lastMsg.sender;
				if(lastSender.userid==sender.userid){
					// same sender, do not insert new block
					lastMsg.text+='<div class="msg-phrase">'+txt+'</div>';
					bj.element('_m_'+lastMsg.id).innerHTML = lastMsg.text;
					this.conversation[0].text = lastMsg.text;
					this.onInserted();
					return true;
				}
			}
			var s = this.reader.innerHTML;
			if(this.conversation.length>0){
				 s+='<div class="after-block"></div>';
			}
			var textBlock = Template.msgTextBlock;
			textBlock = textBlock.replaceAll('{MSGID}', id);
			textBlock = textBlock.replaceAll('{AVATAR}', sender.avatar);
			textBlock = textBlock.replaceAll('{TEXT}', txt);
			
			s+=textBlock;
			this.reader.innerHTML = s;
			this.onInserted();
			
			this.conversation.unshift(msg);
		},
		getText : function(){
			return this.input.value.trim();
		},
		setUserState : function(on){
			this.friend.status = on;
			if(!!on){
				this.icon.addClass('online');
			}
			else{
				this.icon.removeClass('online');
			}
		},
		destroy : function(){
			this.el.destroy();
		}
	}
	
	function createChatbox(user){
		var id = user.userid;
		var el = bj.addElement('DIV');
		el.addClass('chatbox');
			var titleBar = bj.addElement('DIV', el);
			titleBar.addClass('title-bar');
				var icon = bj.addElement('DIV', titleBar);
				icon.addClass('status-icon');
				var title = bj.addElement('span', titleBar);
				title.addClass('title');
				title.innerHTML = user.displayName;
				var close = bj.addElement('span', titleBar);
				close.addClass('close');
				close.innerHTML = 'x';
				
			var reader = bj.addElement('DIV', el);
			reader.addClass('reader');
			reader.innerHTML = '';
			var form = bj.addElement('FORM', el);
			var input = bj.addElement('INPUT', form);
			input.addClass('input');
			
		bj.listen(form, 'submit', function(e){
			bj.exitEvent(e);
			ChatBox.sendAt(id);
		});		
		bj.listen(close, 'click', function(e){
			bj.exitEvent(e);
			ChatBox.close(id);
		});				
			
		var win = bj.inherits(_cb);
		
		win.id = id;
		win.el = el;
		win.icon = icon;
		win.reader = reader;
		win.input = input;
		win.status = 0;
		win.friend = user;
		Conversation[id] = [];
		win.conversation = Conversation[id];
		
		return win;
	}
	
	function pushMessage(win, message){
		win.insert(message);
		// send it via bjd
		bjd.sendMessage({
			id : message.id,
			from : message.sender.userid,
			to : message.receiver.userid,
			text : message.text
		});
		win.input.value = '';
		win.input.focus();
	}
				
	var ChatBox = {
		init : function(user){
			this.reset();
			chatSender = user || app.chat.getCurrentUser();
		},
		onopen : function(win){
			var c = opening;
			c.unshift(win);
			if(c.length>limit){
				var el = c.pop();
				el.close();
				opening = c;
			}
			var i=0;
			c.forEach(function(item){
				item.el.style.right = 12+((i)*(240+10))+'px';
				i++;
			});
		},
		onclose : function(win){
			var c = opening;
			for(var i=c.length-1;i>=0;i--){
				if(c[i].id==win.id){
					c.splice(i, 1); break;
				}
			}
			opening = c;
			var i=0;
			c.forEach(function(item){
				item.el.style.right = 12+((i)*(240+10))+'px';
				i++;
			});
		},
		updateState : function(id, state){
			var win = ChatBox.getItem(id);
			if(!!win){
				win.setUserState(state);
			}
		},
		setItem : function(win){
			collection.push(win);
		},
		getItem : function(id){
			var c = collection;
			for(var i=0; i<c.length; i++){
				if(c[i].id==id){
					return c[i];
				}
			}
			return false;
		},
		open : function(user){
			var uid = user.userid;
			var name = user.displayName;
			var win = ChatBox.getItem(uid);
			if(!!win){
				win.open();
			}
			else{
				win = createChatbox(user);
				ChatBox.setItem(win);
				win.open();
				win.setUserState(user.status);
			}
			return win;
		},
		close : function(id){
			var win = ChatBox.getItem(id);
			if(!!win){
				win.close();
			}
		},
		sendAt : function(id){
			if(!!chatSender){
				var win = ChatBox.getItem(id);
				if(!!win){
					this.send(win);
				}
			}
		},
		send : function(win){
			if(!!chatSender){
				var txt = win.getText();
				if(!!txt){
					pushMessage(win, {
						id : bj.createId(32, 'bjd'),
						text : txt, 
						sender : chatSender, 
						receiver : win.friend
					});
				}
			}
		},
		receive : function(message){
			var mid = message.id;
			var win = null;
			if(message.from!=chatSender.userid){
				win = this.open(message.sender);
			}
			else{
				win = this.open(message.receiver);
			}
			win.insert(message);
		},
		textHandle : function(txt){
			return !!bj.emoticon?bj.emoticon.parse(txt):txt;
		},
		reset : function(){
			collection.forEach(function(item){
				item.destroy();
			});
			bj.empty(opening);
			bj.empty(collection);
			chatSender = null;
		}
	}
	_parent['ChatBox'] = ChatBox;
})(window);
