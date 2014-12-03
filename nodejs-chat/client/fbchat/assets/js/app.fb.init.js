/**
 * app.init.js
 * @ndaidong
 * @youlook.net
*/

var app = window['app'] || {};

;(function(scope){
	
	var host = document.location.host;

	if(host=='demo.bjlab.us'){
		var CONFIGS = {
			server : '108.168.247.49:13166',
			options : {
				resource :'node/socket.io',
			}
		}
		document.write('<script type="text/javascript" src="http://bjlab.us/node/socket.io/socket.io.js"></script>');
	}
	else{
		var CONFIGS = {
			server : '127.0.0.1:13166'
		};	
		document.write('<script type="text/javascript" src="http://127.0.0.1:13166/socket.io/socket.io.js"></script>');	
	}
	
	bj.setOnloadCallback(function(){
		
		// configure connection
		var cfg = CONFIGS || false;
		if(!!cfg){
			bjd.configure(cfg.server, cfg.options);
		}	
		
		if(!!_CONTACT){
			app.fbchat.loadCache(_CONTACT);
		}

	});
	
})(window);
