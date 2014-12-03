;(function($, scope){
	scope['like'] = {
		container : null,
		object_id : null,
		button : null,
		config : {
			
		},
		setup : function(elem, options) {
			//zone.like.container = elem;
			
			var _defaultOptions = {
				classLiked : 'wd-liked-bt',
				classNormal : 'wd-like-bt',
				object_id : null,
				button : 'a.btnLike',
				actionLike : homeURL + '/like/liked/liked',
				nodeId : '',
				acceptClick : true,
				actionUnlike : homeURL + '/like/liked/like',
				number : '',
				rating_value : 'Like',
				action : homeURL + '/like/liked/like',
				textSelector : 'like-text',
				defaultClass : 'wd-like-bt wd-liked-bt btnLike required_login login_complete coregreennet-rating wd-tooltip-hover',
				text : '',
				defaultText : 'Like'
			};
			options = $.extend(true, {}, _defaultOptions, options);
			
			//zone.like.object_id = options.object_id;
			var button = elem.find(options.button);

			// create like button if not exist
			if (button.length == 0) {
				button = $("<a href='#' class='"+options.defaultClass+"'></a>");
				elem.append(button);
			}
			// set state for button
			if (options.liked) {
				button.addClass(options.classLiked);
				options.action = options.actionUnlike;
			} else {
				button.removeClass(options.classLiked);
				options.action = options.actionLike;
			}
			
			var textContainer = elem.find(options.textSelector);
			
			// add text container if not exist
			if (textContainer.length == 0) {
				textContainer = $("<span class='"+options.textSelector+"'>"+options.defaultText+"</span>");
				elem.append(textContainer);
			}
			
			// set like text
			if (options.text != '') {
				textContainer.html(options.text);
			}
			
			// 
			elem.attr('object_id', options.object_id);
			elem.attr('rating_type', 'like');
			
			// setup for button
			button.attr('actionlike', options.actionLike);
			button.attr('nodeid', options.nodeId);
			button.attr('acceptclick', options.acceptClick);
			button.attr('actionunlike', options.actionUnlike);
			button.attr('actionlike', options.actionUnlike);
			button.attr('classLike', options.classNormal);
			button.attr('number', options.number);
			button.attr('rating_value', options.rating_value);
			button.attr('action', options.action);
			button.attr('original-title', options.rating_value).tipsy({gravity: 's'});;
			
			button.click(function() {
				if(button.attr('acceptClick') == "false") return false;
				
				button.attr('acceptclick',"false");
				
				var $node_id		= button.attr('nodeid');
				var $action			= button.attr('action');
				
				var $rating_value	= button.attr('rating_value');
				var $rating_type	= elem.attr('rating_type');
				
				$.ajax({
					url		: $action,
					type	: 'POST',
					dataType: 'json',
					data	: 'object_id=' + options.object_id
								+ '&rating_type=' + $rating_type
								+ '&node_id=' + $node_id
								+ '&rating_value=' + $rating_value,
					success	: function(res) {
						if (res != null) {
							textContainer.html(res.people);
							
							button.attr('rating_value', res.value);
							button.attr('original-title', res.value);
							button.attr('number', res.number);
							button.text(res.value);
							
							if (res.value=='Like') {
								button.removeClass(options.classLiked);
								button.addClass(options.classNormal);
								button.attr('action', options.actionLike);
							} else {
								// button.removeClass(options.classNormal);
								button.addClass(options.classLiked);
								button.attr('action', options.actionUnlike);
							}
//							
//							try{
//								$('.wd-tooltip-hover-html').tipsy({html: true,gravity: 's',fade: true});
//							}catch(e){
//							
//							}
							
							if (typeof options.callback == "function") {
								callback(res);
							}
						}
						button.attr('acceptClick',"true");
					}
				});
				
				return false;
			});
		}
	};
})(jQuery, zone);