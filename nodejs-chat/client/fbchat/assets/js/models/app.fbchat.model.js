/**
 * app.fbchat.model.js
 * A demo for handling business logic of chat tool.
 * Author by @ndaidong at Twitter
 * Copyright by *.bjlab.us, *.youlook.net
*/

var app = window.app || {};

;(function(){
	
	'use strict';
	
	var Me = null, Connectors = [];
	
	function updateState(state, userid, junctionId){
		var jid = bjd.getJunctionId();
		if(state==0){
			Me = null;
			Connectors = [];
		}
	}
	
	function updateFriendState(uid, state){
		for(var i=0;i<Connectors.length;i++){
			var one = Connectors[i];
			if(one.userid == uid){
				if(one.status!=state){
					Connectors[i].status = state;
					L.View.updateFriendState(uid, state);//chatbox icon
				}
				break;
			}
		}
	}
	function updateFriendList(state, friendId){
		if(Connectors.length>0){
			if(bj.isString(friendId)){
				updateFriendState(friendId, state);
			}
			else if(bj.isArray(friendId)){
				friendId.forEach(function(fid){
					updateFriendState(fid, state);
				});
			}
			L.View.updateFriendList();
		}
	}
	
	function convert(user){
		return {
			userid : user.id,
			username : '',
			displayName : user.name,
			avatar : 'https://graph.facebook.com/'+user.id+'/picture',
			status : 0
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
		if(!!Me){
			var sender, receiver;
			if(msg.from==Me.userid){ // this is a sent message
				sender = Me;
				receiver = L.getConnectorById(msg.to);
			}
			else{
				sender = L.getConnectorById(msg.from);
				receiver = Me;
			}
			msg.sender = sender;
			msg.receiver = receiver;
			L.View.onreceive(msg);
		}
	}
	
	var L = app.fbchat = bj.createModel({
		init : function(){
			bjd.onClientStateChange(updateState);
			bjd.onConnectorStateChange(updateFriendList);
			bjd.onSendMessage(onSendMessage);
			bjd.onReceiveMessage(onReceiveMessage);
		},
		setMe : function(user, isCache){
			Me = user;
			if(!isCache){
				var store = bj.storage.select(2);
				store.setItem('Me', JSON.stringify(Me));
			}
			ChatBox.init(Me);
		},
		getMe : function(){
			return Me;
		},
		setConnectors : function(users, isCache){
			Connectors = bj.msort(users, 'displayName');
			if(!isCache){
				var store = bj.storage.select(2);
				store.setItem('Connectors', JSON.stringify(Connectors));
			}
		},
		getConnectors : function(){
			return Connectors;
		},
		getOnlineConnectors : function(){
			return Connectors.filter(function(c){
				return c.status==1;
			});
		},
		getConnectorById : function(id){
			var re = false;
			for(var i=0;i<Connectors.length;i++){
				if(Connectors[i].userid==id){
					re = Connectors[i];
					break;
				}
			}
			return re;
		},
		onconnect : function(){
			FB.api('/me', function(response){
				// Me - current user
				var user = convert(response);
				L.setMe(user);
				L.View.render();
				FB.api('/me/friends', function(response){
					var arr = [];
					response.data.forEach(function(item){
						var _c = convert(item);
						arr.push(_c);
					});
					// Connectors - friend list
					L.setConnectors(arr);
					//L.View.renderFriendList();
					
					// start connect to node service
					L.signin();
				});
			});
		},
		signin : function(){
			if(!!Me && !!Connectors){
				bjd.init({
					me : Me,
					connectors : Connectors
				});
			}
		},
		loadCache : function(contact){
			
			var _me = bj.isString(contact.me)?JSON.parse(contact.me):contact.me;
			var _connectors = bj.isString(contact.connectors)?JSON.parse(contact.connectors):contact.connectors;
			L.setMe(_me, 1);
			L.setConnectors(_connectors, 1);
			L.View.render();
			
			this.signin();
		}
	});
})();
