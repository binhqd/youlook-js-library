;(function($, scope){
	scope['notification']	= {
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
			notificationContainerBar: $('#js-notifications-bar'),
			notificationContainer	: $('ul#listNotifications'),
			notificationRequestFriendContainer	: $('ul#listRequestFriendNotifications'),
			notificationRequestFriendPopup	: $('.js-popup-request-friend-notofications'),
			notificationContainerRequestFriendBar: $('#js-notifications-friend-request-bar'),
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
				var clientID = scope.notification.Libs.makeid(8);
				if (typeof scope.notification.pool.socket == "undefined") {
					scope.notification.pool.socket = io.connect(notificationUrl);
					
					scope.notification.Libs.registeredFunction[namespace] = callback;
					
					scope.notification.pool.socket.on("connect", function(data) {
						data = {
							clientID : clientID,
							namespace	: namespace,
							user : user
						}
						
						scope.notification.pool.socket.emit("register", data);
						scope.notification.pool.data = data;
						
						scope.notification.Event.onConnect(data);
					});
				} else {
					scope.notification.pool.socket.emit("register", {
						namespace : namespace,
						clientID	: clientID,
						user : user
					});
					
					scope.notification.Libs.registeredFunction[namespace] = callback;
				}
			},
			
			add : function(data) {
				// Increase notification
				//jlbd.notification.instances.numberLink.show();
				scope.notification.instances.notificationContainer.find('.js-loading-img').remove();
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
//				if (jlbd.notification.instances.numberLink.hasClass('jl-notifications-active')) {
//					scope.notification.instances.contentHeight = scope.notification.instances.notificationContent.outerHeight() + 25;
//					scope.notification.instances.notificationArea.animate({height: scope.notification.instances.contentHeight}, 200, function() {
//						
//					});
//				}
			},
			addRequestFriend : function(data) {
				scope.notification.instances.notificationRequestFriendContainer.find('.js-loading-img').remove();
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
			login : function(user, loginInfo) {
//				user.clientID = scope.notification.Libs.makeid(8);
//				user.location = window.location.href;
//				user.loginInfo = loginInfo;
				
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
						scope.notification.instances.notificationContainer.find('.js-loading-img').remove();
						if (res['object'].length > 0) {
							if(!is_Add) {
								scope.notification.instances.notificationContainer.html("");
								for (var i = 0; i < res['object'].length; i++) {
									var item = new scope.notification.Libs.JLNotificationItem(res['object'][i]);
									item.find('.timeago').timeago();
									scope.notification.instances.notificationContainer.append(item);
								}
								if (scope.notification.instances.notificationContainer.find('li').length <= 6) {
									var h = scope.notification.instances.notificationContainer.css('height');
									scope.notification.instances.notificationContainerBar.css('height', h);
								} else {
									scope.notification.instances.notificationContainerBar.css('height', '350px');
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
						
//						scope.notification.instances.scroller.jScrollPane({
//							showArrows: true,
//							scrollbarMargin : '0',
//							animateDuration:'0',
//							dragMaxHeight : '355'
//						});
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
						scope.notification.instances.notificationRequestFriendContainer.find('.js-loading-img').remove();
						if (res['object'].length > 0) {
								if(!is_Add) {
									scope.notification.instances.notificationRequestFriendContainer.html("");
									for (var i = 0; i < res['object'].length; i++) {
										var item = new scope.notification.Libs.JLRequestFriendNotificationItem(res['object'][i]);
										scope.notification.instances.notificationRequestFriendContainer.append(item);
									}
									if (scope.notification.instances.notificationRequestFriendContainer.find('li').length <= 6) {
										var h = scope.notification.instances.notificationRequestFriendContainer.css('height');
										scope.notification.instances.notificationContainerRequestFriendBar.css('height', h);
									} else {
										scope.notification.instances.notificationContainerRequestFriendBar.css('height', '342px');
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
						// thinhpq remove code set notification readed
						// if (data.is_clicked == 0) {
							// var date = new Date();
							// date.setTime(date.getTime() + (30 * 60 * 1000));
							
							// var newOptions = {
								// domain: cookieDomain,
								// path: '/',
								// expiresAt: date
							// }
							// $.cookies.setOptions(newOptions);
							// $.cookies.set("notificationClicked", data.id);
						// }
						
						window.location = homeURL + data.defaultLink;
					});
				}

//				if (typeof data.notifier != "undefined") {
//					var uri = data.notifier.type=='bm'?'/business/details?uuid='+data.notifier.id:homeURL+"/profile?u="+data.notifier.id;
//					var imageLink = $("<a class=\"jl-thumb-avata\" href='"+uri+"'></a>");
//					var iPath = data.notifier.type=='bm'?data.filepath:(homeURL+"/upload/user-photos/fill/40-40/"+data.avatar.filename);				
//					var image = $('<img src="'+iPath+'" alt="avatar">');
//					imageLink.append(image);
//					item.append(imageLink);
//				}
//				
//				var messageContainer = $("<div class=\"jl-notification-content\"></div>");
//				var message = $("<h4>"+data.message+"</h4>");
//				
//				messageContainer.append(message);
//				item.append(messageContainer);
//				
				return item;
			},
			JLRequestFriendNotificationItem : function(data) {
				var item = $.tmpl($("#tmpNotiItemRequestFriend"), data.userInfo);
				return item;
			}
		}
	}
})(jQuery, jlbd);

$(document).ready(function() {
	$(window).unload(function() {
		jlbd.notification.pool.socket.emit('disconnect', jlbd.notification.pool.data);
	});
	
	if (typeof io != "undefined") {
		//jlbd.notification.Action.connect(notificationUrl, 'global');
		var notificationNamespace = 'global';
		jlbd.notification.Action.register(notificationNamespace, function(data) {
			if (typeof user != "undefined") {
				var loginInfo = {
					clientID : data.clientID,
					namespace : notificationNamespace
				};
				
				jlbd.notification.Action.login(user, loginInfo);
				
				jlbd.notification.pool.socket.on(notificationNamespace, function(data) {
					if (data.type == 'requestFriend') {
						jlbd.notification.Action.addRequestFriend(data);
						return;
					}
					// Add notification on top
					jlbd.notification.Action.add(data);
					
					if (data.type == 'postArticle' || data.type == 'postAlbum' || data.type == 'followNode') {
						if (typeof page != "undefined") {
							if (page.type == 'NodeDetail' || (page.type == "ProfileHome")) {
								var activities = [data.activity];
								loadArticles(activities);
							} else {
								
							}
						}
					}
					// Run callbacks
					/*for (var callbackID in jlbd.notification.callbacks) {
						jlbd.notification.callbacks[callbackID]("notification", data);
					}*/
					
					/*// Show tray notification
					var notifyOptions = {
						title : "MyZone Notification",
						text : data.message,
						sticky: false
					};
					
					if (typeof data.avatar.filename != "undefined") {
						notifyOptions.image = homeURL+"/upload/user-photos/fill/40-40/"+data.avatar.filename;
					} else if (typeof data.avatar.filepath != "undefined") {
						notifyOptions.image = homeURL+"/"+data.avatar.filepath;
					}
					
					jlbd.dialog.showTrayNotify(notifyOptions, function(elem, gritter) {
						if (typeof data.defaultLink != "undefined") {
							gritter.find('.gritter-with-image').click(function() {
								if (data.is_clicked == 0) {
									var date = new Date();
									date.setTime(date.getTime() + (30 * 60 * 1000));
									
									var newOptions = {
										domain: cookieDomain,
										path: '/',
										expiresAt: date
									}
									$.cookies.setOptions(newOptions);
									$.cookies.set("notificationClicked", data.id);
								}
								
								window.location = homeURL + data.defaultLink;
							});
						}
					});*/
				});
			}
		});
		
		jlbd.notification.Action.register('command', function(data) {
			jlbd.notification.pool.socket.on("command", function(data) {
				if (data.command == "reset") {
					jlbd.notification.instances.number.html(0);
					jlbd.notification.instances.number.css('display', 'none');
					jlbd.notification.pool.unread = 0;
					//jlbd.notification.instances.notificationContainer.find('li').removeClass('unread');
				}
				for (var callbackID in jlbd.notification.callbacks) {
					jlbd.notification.callbacks[callbackID]("command", data);
				}
			});
		});
		
		// added by dongnd, to hide notification when a click event occurring outside of notification area.
		/*$(document).click(function(event){
			var ni = jlbd.notification.instances;
			if(ni.numberLink.hasClass('jl-notifications-active')) {
				ni.notificationArea.animate({height: 0}, 200, function() {
					ni.numberLink.removeClass('jl-notifications-active');
				});
			}
		});*/		
	}
	
	/*var item = $('#notification-page li.noti-item');
	item.each(function() {
		var _item = $(this);
		_item.find('a.wd-remove').click(function() {
			var ref = $(this).attr('ref');
			$.ajax({
				url : homeURL + '/notifications/remove?id=' + ref,
				success : function(response) {
					if (!response.error) {
						_item.remove();
					}
					
					var notifyOptions = {
						message	: response.message,
						autoHide : true,
						timeOut : 2
					}
					jlbd.dialog.notify(notifyOptions);
				}
			});
			return false;
		});
		
		_item.click(function() {
			var defaultLink = _item.attr('defaultLink');
			var ref = _item.attr('ref');
			if (defaultLink != "") {
				if (_item.hasClass('unread')) {
					var date = new Date();
					date.setTime(date.getTime() + (30 * 60 * 1000));
					
					var newOptions = {
						domain: cookieDomain,
						path: '/',
						expiresAt: date
					}
					$.cookies.setOptions(newOptions);
					$.cookies.set("notificationClicked", ref);
				}
				window.location = homeURL + defaultLink;
			}
		});
		
	});*/
	
	// process common task when having new notification
	/*jlbd.notification.addCallBack(function(eventName, data) {
		if (typeof data.type != "undefined" && data.type == "acceptFriend" || (eventName == "command" || data.command == "unFriend")) {
			var now = parseInt(new Date().getTime() / 1000);
			
			var newOptions = {
				domain: cookieDomain,
				path: '/'
			}
			$.cookies.setOptions(newOptions);
			$.cookies.set("userInfoCache-" + user.id, now - 190*86400);
		}
	});*/
});