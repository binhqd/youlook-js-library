var express 	= require('express'),
	app			= express(),
    server  	= require('http').createServer(app),
    io      	= require('socket.io').listen(server),
    bjd  		= require('./bjd'),
    port    	= 13166;

server.listen(port);

io.set('log level', 2);
io.set('transports', ['websocket', 'xhr-polling']);

io.sockets.on('connection', function(socket){

	socket.on('connect', function(){
		bjd.connect(io, socket);
	});
	
	socket.on('disconnect', function(){
		bjd.disconnect(socket);
	});
	
	socket.on('clientSignal', function(data){
		bjd.onClientSignal(io, socket, data);
	});
});

console.log('Service is running at %d...', port);
