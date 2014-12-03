/**
 * app.init.js
 * @ndaidong
 * @youlook.net
*/

var app = window['app'] || {};

;(function(scope){
	
	var host = document.location.host;

	if(host=='demo.bjlab.us'){
		scope['CONFIGS'] = {
			server : '108.168.247.49:13166',
			options : {
				resource :'node/socket.io',
			}
		};
	}
	else{
		scope['CONFIGS'] = {
			server : '127.0.0.1:13166'
		};		
	}
	
	// sample personal chat options
	scope['USER_OPTIONS'] = {
		showOnlineOnly : false,
		disabled : false,
		showAvatar : false,
	}



	
	scope['CONTACT_DATA'] = null;
	/* 
	 * In this demo app, we set this value to null. Tester can choose it's role and connectors to start using app.
	 * The valid value for CONTACT_DATA is an object with the following structure :
	 * 
	  * 
		{
			me : {
				userid : String,
				username : String,
				displayName : String,
				avatar : String URL
			},
			connectors : [
				{
					userid : String,
					username : String,
					displayName : String,
					avatar : String URL
				},
				{
					userid : String,
					username : String,
					displayName : String,
					avatar : String URL
				},
				... and more...
			]
		}
	  * 
	  * 
	**/
	
	bj.setOnloadCallback(function(){
		
		// configure connection
		var cfg = CONFIGS || false;
		if(!!cfg){
			bjd.configure(cfg.server, cfg.options);
		}
		
		// set current user's personal options
		var uso = USER_OPTIONS || false;
		if(!!uso){
			bjd.setPersonalOptions(uso);
		}
		
		// init service with contact list if it's available
		var ctd = CONTACT_DATA || false;
		if(!!ctd){
			bjd.init(ctd);
		}
		
		app.chat.listAllUser();
		
	});
	
})(window);
