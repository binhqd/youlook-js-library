/**
 * app.chat.model.js
 * A demo for handling business logic of chat tool.
 * Author by @ndaidong at Twitter
 * Copyright by *.bjlab.us, *.youlook.net
*/

var app = window.app || {};

;(function(){
	
	'use strict';
	
	var originalUserList = false;
	var thisUser = null, friends = [];
	
	function updateState(state, userid, junctionId){
		var jid = bjd.getJunctionId();
		if(state==0){
			thisUser = null;
			friends = [];
			L.View.resetUI(originalUserList, 'userList');
		}
		else if(state==1){
			if(!thisUser || thisUser.userid!=userid){
				var user = L.getUserById(userid);
				if(!!user){
					L.markUserAs(user);
				}			
			}	
		}	
	}
	
	function updateUserState(uid, state){
		for(var i=0;i<friends.length;i++){
			var one = friends[i];
			if(one.userid == uid){
				if(one.status!=state){
					friends[i].status = state;
					L.View.updateUserState(uid, state);//chatbox icon
				}
				break;
			}
		}
	}
	function updateFriendList(state, friendId){
		if(friends.length>0){
			if(bj.isString(friendId)){
				updateUserState(friendId, state);
			}
			else if(bj.isArray(friendId)){
				friendId.forEach(function(fid){
					updateUserState(fid, state);
				});
			}
			
			L.View.updateFriendList();
		}
	}
	
	function onSendMessage(msg){
		// do anything here with this sent message such as save, cache...
		console.log('Message you send');
		//console.log(msg);
	}
	
	function onReceiveMessage(msg){
		// do anything here with this sent message such as save, cache...
		// here we simple insert it to chat box 
		
		// in this demo, we us chat main model to help ChatBox object detect sender and receiver
		if(!!thisUser){
			var sender, receiver;
			if(msg.from==thisUser.userid){ // this is a sent message
				sender = thisUser;
				receiver = L.getFriendById(msg.to);
			}
			else{
				sender = L.getFriendById(msg.from);
				receiver = thisUser;
			}
			msg.sender = sender;
			msg.receiver = receiver;
			ChatBox.receive(msg);
		}
	}
	
	var L = app.chat = bj.createModel({
		init : function(){
			bjd.onClientStateChange(updateState);
			bjd.onConnectorStateChange(updateFriendList);
			bjd.onSendMessage(onSendMessage);
			bjd.onReceiveMessage(onReceiveMessage);
		},
		listAllUser : function(){
			if(!!window['USER_LIST']){
				if(!originalUserList){
					var arr = bj.msort(USER_LIST, 'displayName');
					originalUserList = arr;
				}
				L.View.listUsers(originalUserList, 'userList');	
				
				// demo for auto login with client caching data
				var uid = bj.cookies.get('userid');
				if(!!uid){
					var user = this.getUserById(uid);
					if(!!user){
						L.View.listUsers(originalUserList, 'userList', user);	
						L.signinAs(user);
					}	
				}
			}		
		},
		getUserById : function(uid){
			for(var i=0;i<USER_LIST.length;i++){
				if(USER_LIST[i].userid==uid){
					return USER_LIST[i];
				}
			}	
			return null;		
		},
		getConnectors : function(uid){
			var rels = [];
			CONNECTIONS.forEach(function(c){
				if(c.from===uid){
					rels.push(c.to);
				}
				else if(c.to===uid){
					rels.push(c.from);
				}
			});
			var arr = [];
			if(rels.length>0){
				arr = USER_LIST.filter(function(item){
					return bj.contains(rels, item.userid);
				});
				arr = bj.msort(arr, 'displayName');
			}			
			return arr;
		},
		markUserAs : function(us, fs){
			
			thisUser = us;
			friends = fs || this.getConnectors(us.userid);
			
			L.View.displayMe();
			L.View.listFriends();
			L.View.onFinish();
			
			ChatBox.init(us);
		},
		signinAs : function(user){
			
			var us = thisUser = user;
			var fs = friends = this.getConnectors(user.userid);
			
			L.View.onProcessing('Logging in as '+user.displayName);
			bjd.signin(
				thisUser,
				friends,
				function(){
					var tmp = bj.cookies.get('userid');
					if(tmp!=user.userid){
						bj.cookies.set('userid', user.userid);
					}
					L.markUserAs(us, fs);
				}
			);
		},
		selectUser : function(uid){
			var user = this.getUserById(uid);
			L.View.showDialog('confirm', 'Confirm', 'Do you want to view as '+user.displayName+'?', function(c){
				if(!!c){
					L.signinAs(user);
				}
			});
		},
		chatWithUser : function(uid){
			var user = this.getUserById(uid);
			if(!!user){
				L.View.startChatWidth(user);
			}
		},
		getCurrentUser : function(){
			return thisUser;
		},
		getFriendById : function(id){
			var re = false;
			for(var i=0;i<friends.length;i++){
				if(friends[i].userid==id){
					re = friends[i];
					break;
				}
			}
			return re;
		},
		getFriendList : function(){
			return friends;
		},
		getUserList : function(){
			return originalUserList;	
		}
	});
})();
