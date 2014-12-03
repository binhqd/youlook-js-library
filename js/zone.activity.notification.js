// Class
;(function($, scope){
	scope['notification'] = {
		callbacks : {},
		pagination:{
			notification:{
				page:1,
				friendPage: 1
			}
		},
		addCallBack : function(callback) {
			var callbackID = this.Libs.makeid(8);
			this.callbacks[callbackID] = callback;
		},
		instances : {
			notificationContent		: $('div#jl-notification-layout'),
			notificationContainer	: $('ul#listNotifications'),
			notificationRequestFriendContainer	: $('ul#listRequestFriendNotifications'),
			notificationRequestFriendPopup	: $('.js-popup-request-friend-notofications'),
			contentHeight			: $('#jl-notification-layout').outerHeight(),
			numberLink				: $('.wd-top-head-right a.jl-notifications'),
			notificationArea		: $('div#notification-content'),
			number					: $('span#jl-notification-number'),
			numberRequestFriend		: $('span#jl-notification-number-request-friend'),
			scroller				: $('.jl-notification-list-scroll')
		},
		pool : {
			unread : parseInt($('#jl-notification-number').html()),
			unreadRequestFriend : parseInt($('#jl-notification-number-request-friend').html())
		},
		Event : {
			onConnect : function(data) {
				for (var fid in scope.notification.Libs.registeredFunction) {
					scope.notification.Libs.registeredFunction[fid](data);
				}
			}
		},
		Action : {
			register : function(namespace, callback) {
				var clientID = Libs.makeid(8);
				if (typeof scope.notification.pool.socket == "undefined") {
					scope.notification.pool.socket = io.connect(notificationUrl);
					
					scope.notification.Libs.registeredFunction[namespace] = callback;
					
					scope.notification.pool.socket.on("connect", function(data) {
						data = {
							clientID : clientID
						}
						
						scope.notification.pool.socket.emit("register", {
							namespace	: namespace,
							clientID	: clientID
						});
						
						scope.notification.Event.onConnect(data);
					});
					
					var namespace = 'zonetype-activities-event-all';
					scope.notification.pool.socket.on(namespace, function(data) {
						
					});
				} else {
					scope.notification.pool.socket.emit("register", {
						namespace : namespace,
						clientID	: clientID
					});
					
					scope.notification.Libs.registeredFunction[namespace] = callback;
				}
			},
			
			add : function(data) {
				// Increase notification
				//jlbd.notification.instances.numberLink.show();
				scope.notification.pool.unread++;
				scope.notification.instances.number.html(scope.notification.pool.unread);
				scope.notification.instances.number.css('display', scope.notification.pool.unread == 0 ? 'none' : 'block');
				var item = new scope.notification.Libs.JLNotificationItem(data);
				item.find('.timeago').timeago();
				scope.notification.instances.notificationContainer.prepend(item);
				
				scope.notification.instances.notificationContainer.removeClass('js-notify-loaded');
				if (scope.notification.instances.notificationArea.css('display') != 'none') {
					jlbd.notification.Action.loadNotifications(true);
					scope.notification.instances.number.html(0);
					scope.notification.instances.number.css('display', 'none');
					scope.notification.pool.unread = 0;
				}
//					if (jlbd.notification.instances.numberLink.hasClass('jl-notifications-active')) {
//						scope.notification.instances.contentHeight = scope.notification.instances.notificationContent.outerHeight() + 25;
//						scope.notification.instances.notificationArea.animate({height: scope.notification.instances.contentHeight}, 200, function() {
//							
//						});
//					}
			},
			addRequestFriend : function(data) {
				scope.notification.pool.unreadRequestFriend++;
				scope.notification.instances.numberRequestFriend.html(scope.notification.pool.unreadRequestFriend);
				scope.notification.instances.numberRequestFriend.css('display', scope.notification.pool.unreadRequestFriend == 0 ? 'none' : 'block');
				scope.notification.instances.notificationRequestFriendContainer.removeClass('js-notify-loaded');
				var item = new scope.notification.Libs.JLRequestFriendNotificationItem(data);
				scope.notification.instances.notificationRequestFriendContainer.prepend(item);

				
				if (scope.notification.instances.notificationRequestFriendPopup.css('display') != 'none') {
					jlbd.notification.Action.loadNotificationsRequestFriend(true);
				}
			},
			/**
			 * This method is used to perform an initialize of connection to server
			 * @param user
			 * @param loginInfo
			 */
			login : function(user, loginInfo) {
				var currentLocation = history.location || document.location;
				//user.clientID = Libs.makeid();
				loginInfo.location = currentLocation.href;
				
				//user.loginInfo = loginInfo;
				loginInfo.user = user;
				scope.notification.pool.socket.emit("handshake", loginInfo);
			},
			loadNotifications : function(is_Add) {
				if (scope.notification.instances.notificationContainer.hasClass('js-notify-loaded'))
					return false;
				scope.notification.instances.notificationContainer.addClass('js-notify-loaded');
				page = jlbd.notification.pagination.notification.page;
				$.ajax({
					url : homeURL + '/pull/?id=' + Math.random()+"&p="+page,
					success : function(res) {
						if (res['object'].length > 0) {
							if(!is_Add) {
								scope.notification.instances.notificationContainer.html("");
								for (var i = 0; i < res['object'].length; i++) {
									var item = new scope.notification.Libs.JLNotificationItem(res['object'][i]);
									item.find('.timeago').timeago();
									scope.notification.instances.notificationContainer.append(item);
								}
								if(page*6 >= res['totalNotification'])
									$('#see-all-notifi-other').hide();
							}
							jlbd.notification.instances.notificationContainer.removeClass('not-load');
						} else {
							scope.notification.instances.notificationContainer.html("<li class=\"jl-notification-iterm\" align=\"center\"><p class=\"youlook-notification\">There currently no notification yet</p></li>");
							$('#see-all-notifi-other').hide();
						}
						
						scope.notification.instances.number.html(0);
						scope.notification.instances.number.css('display', 'none');
						scope.notification.pool.unread = 0;
					}
				});
			},
			loadNotificationsRequestFriend : function(is_Add) {
				if (scope.notification.instances.notificationRequestFriendContainer.hasClass('js-notify-loaded'))
					return false;
				scope.notification.instances.notificationRequestFriendContainer.addClass('js-notify-loaded');
				friendPage = jlbd.notification.pagination.notification.friendPage;
				$.ajax({
					url : homeURL + '/pull/requestFriend/?id=' + Math.random()+"&p="+friendPage,
					success : function(res) {
						if (res['object'].length > 0) {
								if(!is_Add) {
									scope.notification.instances.notificationRequestFriendContainer.html("");
									for (var i = 0; i < res['object'].length; i++) {
										var item = new scope.notification.Libs.JLRequestFriendNotificationItem(res['object'][i]);
										scope.notification.instances.notificationRequestFriendContainer.append(item);
									}
									if(friendPage*6 >= res['totalFriendNotification'])
										$('#see-all-notifi-friend').hide();
								}
							$.Friends.initLinks(scope.notification.instances.notificationRequestFriendContainer.find(".js-friend-request"));
						} else {
							scope.notification.instances.notificationRequestFriendContainer.html("<li class=\"jl-notification-iterm\" align=\"center\"><p class=\"youlook-notification\">There currently no notification yet</p></li>");
							$('#see-all-notifi-friend').hide();
						}

						scope.notification.instances.numberRequestFriend.html(0);
						scope.notification.instances.numberRequestFriend.css('display', 'none');
						scope.notification.pool.unreadRequestFriend = 0;
					}
				});
			}
		},
		Libs : {
			registeredFunction : {},
			makeid : function(length) {
				if (typeof length == "undefined") length = 5;
				var text = "";
				var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
				for( var i=0; i < length; i++ )
					text += possible.charAt(Math.floor(Math.random() * possible.length));
				return text;
			},
			JLNotificationItem : function(data) {
				var item = $.tmpl($("#tmpNotiItem"), data);
				if (data.is_clicked == 0) {
					item.addClass('unread');
				}
				if (data.read == 0) {
					item.addClass('wd-jewelItemNew');
				}
				
				if (typeof data.defaultLink != "undefined") {
					item.attr('ref', data.defaultLink);
					item.click(function() {
						
						window.location = homeURL + data.defaultLink;
					});
				}

				return item;
			},
			JLRequestFriendNotificationItem : function(data) {
				var item = $.tmpl($("#tmpNotiItemRequestFriend"), data.userInfo);
				return item;
			}
		}
	};
})(jQuery, zone.activity);