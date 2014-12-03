$(document).ready(function() {
	if (typeof io != "undefined") {
//		jlbd.notification.Action.connect(notificationUrl, 'global');
		var currentLocation = history.location || document.location;
		var url = $.url(currentLocation.href);
		var interest = url.param('interest');
		var filterBy = url.param('filterBy');
		
		if (typeof interest == "undefined" || interest == "") {
			interest = "all";
		}
		if (typeof filterBy == "undefined" || filterBy == "") {
			filterBy = "all";
		}
		
		var notificationNamespace = 'zonetype-activities-' + interest + '-' + filterBy;
		zone.activity.notification.Action.register(notificationNamespace, function(data) {
			if (typeof user != "undefined") {
				
				var loginInfo = {
					clientID : data.clientID,
					filterBy : filterBy,
					interest : interest,
					namespace : notificationNamespace
				};
				
				zone.activity.notification.Action.login(user, loginInfo);
				
//				jlbd.notification.pool.socket.on("notification", function(data) {
//					if (data.type == 'requestFriend') {
//						jlbd.notification.Action.addRequestFriend(data);
//						return;
//					}
//					// Add notification on top
//					jlbd.notification.Action.add(data);
//					if (data.type == 'postArticle' || data.type == 'postAlbum' || data.type == 'followNode') {
//						if (typeof page != "undefined") {
//							if (page.type == 'NodeDetail' || (page.type == "ProfileHome")) {
//								var activities = [data.activity];
//								loadArticles(activities);
//							} else {
//								
//							}
//						}
//					}
//					// Run callbacks
//					
//				});
			}
			
		});
		
//		jlbd.notification.Action.register('command', function(data) {
//			jlbd.notification.pool.socket.on("command", function(data) {
//				if (data.command == "reset") {
//					jlbd.notification.instances.number.html(0);
//					jlbd.notification.instances.number.css('display', 'none');
//					jlbd.notification.pool.unread = 0;
//					//jlbd.notification.instances.notificationContainer.find('li').removeClass('unread');
//				}
//				for (var callbackID in jlbd.notification.callbacks) {
//					jlbd.notification.callbacks[callbackID]("command", data);
//				}
//			});
//		});
		
	}
});