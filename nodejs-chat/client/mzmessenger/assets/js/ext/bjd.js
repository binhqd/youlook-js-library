/**
 * bjd.js
 * BellaJS Deliverer for client
 * Author by @ndaidong at Twitter
 * Copyright by *.bjlab.us, *.youlook.net
*/
;(function(_parent){
	
	"use strict";
	
	var _config = {
		server : '',
		options : {}
	}
	
	var _custom = {
		showOnlineOnly : false,
		disabled : false,
		showAvatar : false,
	}
	
	var _me = null, _connectors = [];

	var socket = null;
	
	var Store = {
		clientId : '',
		socketId : '',
		junctionId : '',
		user : null,
		set : function(key, id){
			if(key=='socketId'){
				this.socketId = id;
			}
			else if(key=='junctionId'){
				this.junctionId = id;
			}
		},
		unset : function(key){
			return this.set(key, '');
		},
		get : function(key){
			if(key=='socketId'){
				return this.socketId;
			}
			else if(key=='junctionId'){
				return this.junctionId;
			}
		},
		 setClientId : function(id){
			 this.clientId = id;
			 bj.cookies.set('clientId', id);
		 },
		 getClientId : function(){
			 var id = this.clientId;
			 if(!id){
				 id = bj.cookies.get('clientId') || bj.createId(32);
				 this.setClientId(id);
			 }
			 return id;
		 },
		 resetClientId : function(){
			 var id = bj.createId(32);
			 this.setClientId(id);
		 }
	}
	
	var Server = {
		status : 0, // 0 = initialized, 1 = connecting, 2 = connected, 3 = disconnected
		connect : function(){
			var clientId = Store.getClientId();
			if(!!_config.server){
				if(!!window['io']){
					socket = io.connect(_config.server, _config.options);
					this.listen();
					this.status = 2;
				}
			}
		},
		signal : function(type, pkg){
			if(!!_me){
				
				var message = pkg || {};
				
				message.clientId = Store.getClientId();
				message.junctionId = Store.get('junctionId');
				message.user = _me.userid;
				message.type = type;
				
				if(type=='signin'){
					message.connectors = parseConnectorId(_connectors);
				}
				if(!!socket){
					socket.emit('clientSignal', message);
				}
				else{
					_onSocketUnusable();
				}
			}
		},
		onServerSignal : function(data){
			if(data.type=='clientStatus'){
				if(!!data.connector){
					// junction update
					if(data.connector!=_me.userid){
						resetAppState();
					}
					_onClientStateChange(data.status, data.connector, data.junctionId);
				}
			}
			else if(data.type=='connectorStatus'){
				_onConnectorStateChange(data.status, data.connector || data.connectors);
			}
			else{
				switch(data.type){
					case 'askIfConnecting' : 
						Server.signal(data.type, {
							socketId : data.socket,
							answer : true
						});
						break;
					case 'message' : 
						_onReceiveMessage(data.message);
						break;
					case 'initialized' :
						if(!!data.socketId){
							Store.set('socketId', data.socketId);
							Store.set('junctionId', bj.createId(32));
							Server.status = 2;
							_onStartJunction();
						}
						break;
				}
			}
		},
		listen : function(){

			socket.on('connect', function(){
				socket.emit('connect');
			});
			socket.on('initialized', function(data){
				Store.set('socketId', data.socketId);
				Store.set('junctionId', bj.createId(32));
				Server.status = 2;
				_onStartJunction();
			});			
			
			socket.on('disconnect', function(){
				Server.signal('disconnect');
			});
			
			socket.on('serverSignal', function(data){
				Server.onServerSignal(data);			
			});	
		}
	}
		
	var loadMessageHistory = function(friendId){
		
	}
	
	var parseConnectorId = function(connectors){
		var c = [];
		connectors.forEach(function(item){
			c.push(item.userid);
		});
		return c;
	}
	
	var resetAppState = function(){
		
	}
	
	var checkMessage = function(msg){
		var cn = parseConnectorId(_connectors);
		return (bj.contains(cn, msg.to) && msg.from==_me.userid && msg.text!='');
	}
	var sendMessage = function(msg){
		Server.signal('message', {msgPacket : msg});
		_onSendMessage(msg);
	}
	
	// Events
	
	var _onSocketUnusable 		= new Function();	
	var _onStartJunction 		= new Function();
	
	// published events
	var _onClientStateChange 	= new Function();
	var _onConnectorStateChange = new Function();
	var _onSendMessage			= new Function();
	var _onReceiveMessage 		= new Function();
	
	var G = _parent['bjd'] = {
		configure : function(server, options){
			bj.copies({server:server, options:options}, _config);	
		},
		setPersonalOptions : function(config){
			bj.copies(config, _custom);			
		},
		setCurrentUser : function(user){
			_me = user;
		},
		loadConnectors : function(list){
			_connectors = list;
		},
		signin : function(user, connectors, callback){
			_onStartJunction = function(){
				var uid = bj.cookies.get('userid');
				G.setCurrentUser(user);
				G.loadConnectors(connectors);	
				Server.signal('signin');
				if(callback){
					callback();
				}
			}
			if(Server.status==0){
				Server.connect();
			}			
			else{
				_onStartJunction();
			}
		},
		signout : function(){
			Server.signal('signout');
		},
		sendMessage : function(msg){
			if(!!checkMessage(msg)){
				sendMessage(msg);
			}
		},
		init : function(contact){
			if(!!contact){
				this.setCurrentUser(contact.me);
				this.loadConnectors(contact.connectors);
			}
			if(!_custom.disabled){
				Server.connect();
				if(!!_me && !!_connectors){
					this.signin(_me, _connectors);
				}
			}
		},
		getStatus : function(){
			return Server.status;
		},
		getUser : function(){
			return _me;
		},
		getConnectors : function(){
			return _connectors;
		},
		getSocketId : function(){
			return Store.get('socketId');
		},
		getJunctionId : function(){
			return Store.get('junctionId');
		},
		// events
		onClientStateChange : function(f){
			_onClientStateChange = f;
		},
		onConnectorStateChange : function(f){
			_onConnectorStateChange = f;
		},
		onSendMessage : function(f){
			_onSendMessage = f;
		},
		onReceiveMessage : function(f){
			_onReceiveMessage = f;
		}
	}
})(window);
