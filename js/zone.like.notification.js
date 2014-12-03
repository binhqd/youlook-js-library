;(function($, scope){
	scope['likeNotification'] = {
		init : function(){
			zone.likeNotification.objHtml.item = $('.item-notification');
			$('body').on('click', '.item-notification', function(e){
				var _this = $(this);
				if($(this).find('a').hasClass('like-status')){
					var _this = $(this).find('a.like-status');
					window.location.href = homeURL + "/status/view?id="+_this.attr('status_id');
				}
				if($(this).find('a').hasClass('like-article-notification')){
					var _this = $(this).find('a.like-article-notification');
					window.location.href = _this.attr('href');
				}
				
			});
		},
		data:{

		},
		objHtml:{
			item:null
		}
	}
})(jQuery, zone);
;(function($, scope){
	scope['commentNotification'] = {
		init : function(){
			zone.likeNotification.objHtml.item = $('.item-notification');
			$('body').on('click', '.item-notification', function(e){
				var _this = $(this);
				if($(this).find('a').hasClass('comment-status')){
					var _this = $(this).find('a.comment-status');
					window.location.href = homeURL + "/status/view?id="+_this.attr('status_id')+"&anchor="+_this.attr('comment_id');
				}
				if($(this).find('a').hasClass('comment-article')){
					var _this = $(this).find('a.comment-article');
					window.location.href = homeURL + "/article?article_id="+_this.attr('article_id');
				}
			});
			
		},
		scrollTop:function(anchorTarget){
			zone.likeNotification.objHtml.commentBox = $('.wd-comment-box');
			$.each(zone.likeNotification.objHtml.commentBox.find('.item-box'),function(x,y){
				if($(this).attr('anchor') == anchorTarget){
					$(this).css({backgroundColor:'#FFFFC2'});
					zone.commentNotification.data.idItem = Libs.makeid(50);
					$(this).attr('id',zone.commentNotification.data.idItem);
					$("html, body").animate({ scrollTop:($(this).offset().top-150)+"px" });
					setTimeout(function(){
						$("#"+zone.commentNotification.data.idItem).css({backgroundColor:'transparent'});
					},2000);
					return false;
				}
			});
		},
		data:{
			idItem:null
		},
		objHtml:{
			item:null,
			commentBox:null
		}
	}
})(jQuery, zone);
$().ready(function(e){
	zone.likeNotification.init();
	zone.commentNotification.init();
	
	


	$('#pane-friend').bind(
		'jsp-scroll-y',
		function(event, scrollPositionY, isAtTop, isAtBottom)
		{
			if(isAtBottom){
				
				return false;
			}
			
		}
	);
	$('#pane-other').bind(
		'jsp-scroll-y',
		function(event, scrollPositionY, isAtTop, isAtBottom)
		{
			if(isAtBottom){
				// $("#load-more-notification-tab-other").show();
				
				return false;
			}
		}
	);
	
	$('body').on('click', '#see-all-notifi-other', function(e){
		var _this = $(this);
		$(this).find('img').show();
		nuberPage = ++jlbd.notification.pagination.notification.page;
		$.ajax({
			url : homeURL + '/pull/?id=' + Math.random()+"&p="+nuberPage,
			success : function(res) {
				if (res['object'].length > 0) {
					for (var i = 0; i < res['object'].length; i++) {
						var item = new jlbd.notification.Libs.JLNotificationItem(res['object'][i]);
						item.find('.timeago').timeago();
						jlbd.notification.instances.notificationContainer.append(item);
					}
					if (jlbd.notification.instances.notificationContainer.find('li').length <= 6) {
						var h = jlbd.notification.instances.notificationContainer.css('height');
						jlbd.notification.instances.notificationContainerBar.css('height', h);
					} else {
						jlbd.notification.instances.notificationContainerBar.css('height', '350px');
					}
					if(nuberPage*6 >= res['totalNotification'])
						$('#see-all-notifi-other').hide();
				} else {
					_this.hide();
				}
				_this.find('img').hide();

			}
		});
		e.preventDefault();
	});
	$('body').on('click', '#see-all-notifi-friend', function(e){
		var _this = $(this);
		$(this).find('img').show();
		numberPage = ++jlbd.notification.pagination.notification.friendPage;
		$.ajax({
			url : homeURL + '/pull/requestFriend?id=' + Math.random()+"&p="+numberPage,
			success : function(res) {
				if (res['object'].length > 0) {
					for (var i = 0; i < res['object'].length; i++) {
						var item = new jlbd.notification.Libs.JLRequestFriendNotificationItem(res['object'][i]);
						jlbd.notification.instances.notificationRequestFriendContainer.append(item);
					}
					if (jlbd.notification.instances.notificationRequestFriendContainer.find('li').length <= 6) {
						var h = jlbd.notification.instances.notificationRequestFriendContainer.css('height');
						jlbd.notification.instances.notificationContainerRequestFriendBar.css('height', h);
					} else {
						jlbd.notification.instances.notificationContainerRequestFriendBar.css('height', '342px');
					}
					if(numberPage*6 >= res['totalFriendNotification'])
						$('#see-all-notifi-friend').hide();
				} else {
					_this.hide();
				}
				_this.find('img').hide();
				$.Friends.initLinks(jlbd.notification.instances.notificationRequestFriendContainer.find(".js-friend-request"));
			}
		});
		e.preventDefault();
	});
});