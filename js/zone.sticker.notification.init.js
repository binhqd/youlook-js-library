$(document).ready(function() {
	if (typeof io != "undefined") {
//		jlbd.notification.Action.connect(notificationUrl, 'global');
		var currentLocation = history.location || document.location;

		var notificationNamespace = 'zone-sticker';
		zone.sticker.notification.Action.register(notificationNamespace, function(data) {
			if (typeof user != "undefined") {
				var loginInfo = {
					clientID : data.clientID,
					namespace : notificationNamespace
				};
				
				zone.sticker.notification.Action.login(user, loginInfo);
				
				zone.sticker.notification.pool.socket.on("zone-sticker", function(data) {
					console.log(data);
					var stickerItem = $.tmpl($('#tmplStickerItem'), data.data);
					
					zone.sticker.notification.instances.container.prepend(stickerItem);
				});
			}
		});
		
		$(window).unload(function() {
			zone.sticker.notification.pool.socket.emit('disconnect', zone.sticker.notification.pool.data);
		});
	}
});