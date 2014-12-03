;(function($, scope){
	scope['landing'] = {
		page: 1,
		pageAutoLoad: 1000,
		container: '.js-landing-container',
		loadingMoreImageClass: '.js-landing-loadmore-image',
		loadingMoreButtonClass: '.js-landing-loadmore-button',
		loadingMoreButtonText: '',
		loadMore: function()
		{
			scope.landing.page++;
			var strUrl = window.location.href;
			if (strUrl.indexOf('#') >= 0)
				strUrl = strUrl.substring(0, strUrl.indexOf('#'));
			var i = strUrl.indexOf('page=');
			if (i >= 0) {
				var f = strUrl.substring(0, i);
				var l = strUrl.substring(strUrl.indexOf('&', i)+1, strUrl.length);
				strUrl = f + l;
			}
			if (strUrl.indexOf('?') >= 0)
				strUrl += '&page=' + scope.landing.page;
			else
				strUrl += '?page=' + scope.landing.page;
			strUrl += '&timestamp=' + (Number(new Date()));
			$.ajax({
				dataType: 'json',
				url: strUrl,
				success: function(response) {
					scope.landing.addItems(response, 'appended');
					if (response.result.nodes.length < intLimit)
						$('.js-landing-loading-image').fadeOut(function(){
							$(this).remove();
						});
				}
			});
		},
		addItems: function(data, position)
		{
			// articles
			if (data.result.articles.length) {
				$('#oArticleContainer').append(
					$("#tmplArticle").tmpl(data.result.articles)
				);
				zone.photo.init({});
				$('.js-article-show').hide();
			}
			/*var onAfter = function(curr,next,opts) {
				var msg = (opts.currSlide + 1) + ' of ' + opts.slideCount +' photos';
				$('#caption').html(msg);
				$('.wd-streamstory-view-photo-list.js-not-cycle').removeClass('js-not-cycle');
			};
			$('.wd-streamstory-view-photo-list.js-not-cycle')
			.cycle({
				fx:    'fade',
				speed: 500, 
				timeout:0,
				after: onAfter,
				prev:  '.wd-streamstory-view-photo .control-div .wd-prev',
				next:  '.wd-streamstory-view-photo .control-div .wd-next'
			});*/

			// for (i=0; i<1; i++) {
			// 	var artis = $('.js-article-show');
			// 	if (artis.length) {
			// 		$(artis[0]).fadeIn().removeClass('js-article-show');
			// 	}
			// }

			// nodes
			$('.js-landing-container').append(
				$("#tmplObjectNode").tmpl(data.result.nodes)
			);
			$('.js-landing-container').find('.wd-streamstory-viewall-action-composer.js-new-element').each(function(index, element){
				var _this = $(this);
				_this.hide();
				_this.removeClass('js-new-element');
				var layout = function() {
					_this.imagesLoaded(function(){
						var artis = $('.js-article-show');
						if (artis.length) {
							$(artis[0]).fadeIn().removeClass('js-article-show');
						}
						_this.show();
						$('.js-landing-container').masonry(position, _this, true);
						$('.js-landing-container').masonry('layout');
						setTimeout(function(){
							$('.js-landing-container').masonry('layout');
						}, 1000);
					});
					$('.js-landing-container').masonry('layout');

					_this.find('.wd-container-img').hover(function(){
						$(this).find('.wd-number-follows,.wd-icon-follow-3,.wd-statuscontent-left,span.wd-top-shadow,span.wd-bottom-shadow').stop( true, true ).fadeIn(500);	
					}, function(){
						$(this).find('.wd-number-follows,.wd-icon-follow-3,.wd-statuscontent-left,span.wd-top-shadow,span.wd-bottom-shadow').stop( true, true ).fadeOut(500);
					});

					try {
						$.Followings.initLinks(_this.find(".js-following-request"));
					} catch (ex) {}
				};
				layout();
			});
			$(scope.landing.loadingMoreImageClass).removeClass('js-loading');

			if (scope.landing.page - 2 < scope.landing.pageAutoLoad - 1) {
				$('.js-landing-loadmore-button').hide();
				$('.js-landing-loadmore-image').show();
			} else {
				$('.js-landing-loadmore-button').show();
				$('.js-landing-loadmore-image').hide();
			}
			try {
				// Tooltip
				$('.wd-tooltip-hover').tipsy({gravity: 's'}); // VuNDH add code
			} catch (ex) {}
			$(scope.landing.loadingMoreButtonClass).val(scope.landing.loadingMoreButtonText).removeAttr('disabled');

			return;


			var $newElements = $('.js-landing-new-elements');
			$newElements.append(html);
			calScreen();
			$newElements.find('.wd-streamstory-viewall-action-composer').each(function(index, element){
				var _this = $(this);
				var layout = function() {
					_this.imagesLoaded(function(){
						$(scope.landing.container).masonry(position, _this, true);
						$container.masonry('layout');
					});
				};
				layout();
			});
			$newElements.after('<div class="js-landing-new-elements"></div>');
			$newElements.removeClass('js-landing-new-elements');
			
		},
		initScrollLoadMore: function()
		{
			if (scope.landing.page - 2 < scope.landing.pageAutoLoad - 1) {
				$('.js-landing-loadmore-button').hide();
				$('.js-landing-loadmore-image').show();
			} else {
				$('.js-landing-loadmore-button').show();
				$('.js-landing-loadmore-image').hide();
				return;
			}

			var $elementLoading = $(scope.landing.loadingMoreImageClass);
			if ($elementLoading.length <= 0) return;
			var callback = function() {
				if ($elementLoading.length <= 0) return;
				var offsetTop = $elementLoading.offset().top;
				if ($elementLoading.css('display') != 'none' && !$elementLoading.hasClass('js-loading') && offsetTop < $(window).scrollTop() + $(window).height()) {
					$elementLoading.addClass('js-loading');
					scope.landing.loadMore();
				}
			}
			$(window).scroll(function() {
				callback();
			});
		},
		initButtonLoadMore: function()
		{
			var $elementButton = $(scope.landing.loadingMoreButtonClass);
			scope.landing.loadingMoreButtonText = $elementButton.val();
			$elementButton.click(function(){
				scope.landing.loadMore();
				$elementButton.val('Loading...');
				$elementButton.attr('disabled', 'disabled');
			});
		},
		initButtonShowNewStories: function($button)
		{
			$button.click(function(){
				if ($button.hasClass('js-loading')) return;
				$button.addClass('js-loading');
				$('.js-landing-new-stories-loading').show();
				var strUrl = $button.attr('data-url');
				var skipoffset = $button.attr('data-skipoffset');
				var limit = $button.attr('data-limit');
				$.ajax({
					type: "POST",
					dataType: "html",
					url: strUrl,
					data: {"skipOffset": skipoffset, "limit": limit},
					success: function(response) {
						scope.landing.addItems(response, 'prepended');
						$button.removeClass('js-loading');
						var newSkipOffset = (skipoffset-limit);
						if (newSkipOffset < 0) newSkipOffset = 0;
						$button.attr('data-skipoffset', newSkipOffset);
						$button.attr('data-limit', (newSkipOffset < limit) ? newSkipOffset : limit);
						$('.js-landing-new-stories-loading').hide();
						$('.js-landing-new-stories-value').html(newSkipOffset);
						if (newSkipOffset <= 0) {
							$('.js-landing-new-stories-container').fadeOut();
						}
					}
				});
			});
		}
	};
})(jQuery, zone);

var data = [];
var optionMasonry = {
	gutter: 30,
	columnWidth:1,
	isOriginLeft:true,
	stamp: ".stamp",
	isResizeBound:true,
	itemSelector: '.wd-streamstory-viewall-action-composer'
};
function initMasonry(){
	$('.js-landing-container').imagesLoaded(function(){
		$('.js-landing-container').masonry(optionMasonry);
		$('.js-landing-container').animate({
			opacity: '1'
		});
		// $('.js-landing-container .wd-streamstory-viewall-action-composer.js-new-element').each(function(index, element){
		// 	var _this = $(element);
		// 	_this.fadeIn();
		// });
	});
}
function calMasonry(){
	initMasonry();
}

$().ready(function(e){
	$('.js-article-show').removeClass('js-article-show');
	calMasonry();
	$(window).resize(function() {
		initMasonry();
	});
	zone.landing.initScrollLoadMore();
	zone.landing.initButtonLoadMore();
	zone.photo.init({});
});
