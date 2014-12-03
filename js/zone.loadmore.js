;(function($, scope){
	scope['loadmore'] = {
		init: function(options, response) {
			var defaultOptions = {
				pageAutoLoad: 3,
				itemContainer: null,
				itemTemplate: null,
				loadingAuto: null,
				loadingButton: null,
				notFoundElement: null,
				urlAddingParams: null,
				afterRender: function(rendered) {},
				renderScript: function(response) {}
			};
			var options = options || defaultOptions;
			var object = new scope.loadmore.Libs(options);
			if (typeof response != 'undefined')
				object.setResponse(response);
		},
		Libs: function(options) {
			var _this = this;
			// define properties
			_this.currentPage = 1;
			_this.responseContainLinkPager = null;
			_this.options = {
				dataUrl : null,
				pageAutoLoad : 3,
				itemContainer : null,
				itemTemplate : null,
				loadingAuto : null,
				loadingButton : null,
				notFoundElement: null,
				urlAddingParams: null,
				afterRender : function(rendered) {},
				renderScript: function(response) {}
			};

			// method for set options
			_this.setOptions = function(options) {
				$.each(options, function(index, value){
					_this.options[index] = value;
				})
			};

			// method loadmore
			_this.loadmore = function() {
				_this.currentPage++;
				var responseContainLinkPager = _this.responseContainLinkPager;

				var dataUrl = window.location.href;
				if (_this.options.dataUrl != null)
					dataUrl = _this.options.dataUrl;
				if (dataUrl.indexOf('#') >= 0)
					dataUrl = dataUrl.substring(0, dataUrl.indexOf('#'));
				var i = dataUrl.indexOf('page=');
				if (i >= 0) {
					var f = dataUrl.substring(0, i);
					var l = dataUrl.substring(dataUrl.indexOf('&', i)+1, dataUrl.length);
					dataUrl = f + l;
				}
				if (dataUrl.indexOf('?') >= 0)
					dataUrl += '&page=' + _this.currentPage;
				else
					dataUrl += '?page=' + _this.currentPage;
				dataUrl += '&timestamp=' + (Number(new Date()));

				if (responseContainLinkPager != null && typeof responseContainLinkPager.linkPager != 'undefined') {
					// hide loading if over page
					if (responseContainLinkPager.linkPager.pages.currentPage >= responseContainLinkPager.linkPager.pages.pageCount - 1) {
						if (_this.options.loadingAuto.length)
							_this.options.loadingAuto.hide();
						if (_this.options.loadingButton.length)
							_this.options.loadingButton.hide();
						return;
					}
					if (typeof responseContainLinkPager.linkPager.buttons != 'undefined'
						&& typeof responseContainLinkPager.linkPager.buttons[responseContainLinkPager.linkPager.buttons.length-2] != 'undefined'
					)
						dataUrl = responseContainLinkPager.linkPager.buttons[responseContainLinkPager.linkPager.buttons.length-2].url;
				}

				if (_this.options.urlAddingParams != null) {
					if (dataUrl.indexOf('#') >= 0)
						dataUrl = dataUrl.substring(0, dataUrl.indexOf('#'));
					var arrParams = [];
					$.each(_this.options.urlAddingParams, function(key, val) {
						if (dataUrl.indexOf(key) <= 0)
							arrParams[arrParams.length] = key + '=' + val;
					});
					var strParams = arrParams.join('&');
					if (strParams != '') {
						if (dataUrl.indexOf('?') >= 0)
							dataUrl += '&' + strParams;
						else
							dataUrl += '?' + strParams;
					}
				}

				_this.options.loadingAuto.addClass('js-loading');
				_this.options.loadingButton.addClass('js-loading');
				_this.options.loadingButton && _this.options.loadingButton.find('input').attr('disabled', 'disabled');
				$.ajax({
					type: 'POST',
					dataType: 'JSON',
					url: dataUrl,
					success: function(response) {
						if (_this.currentPage < _this.options.pageAutoLoad) {
							_this.options.loadingAuto.show();
							_this.options.loadingButton.hide();
						} else {
							_this.options.loadingAuto.hide();
							_this.options.loadingButton.show();
							_this.options.loadingButton && _this.options.loadingButton.find('input').removeAttr('disabled');
						}

						_this.options.loadingAuto.removeClass('js-loading');
						_this.options.loadingButton.removeClass('js-loading');
						_this.responseContainLinkPager = response;

						_this.options.renderScript(response);

						if (_this.options.itemContainer != null) {
							var id = 'loadmore-' + (new Date().getTime()) + 'rnd' + Math.round(9999999*Math.random());
							_this.options.itemContainer.append('<div id="'+id+'"></div>');
							var rendered = _this.options.itemContainer.find('#'+id);
							rendered.append(
								$.tmpl(_this.options.itemTemplate, response)
							);

							_this.options.afterRender(rendered);
						}

						// hide loading if over page
						if (typeof response != 'undefined' && typeof response.linkPager != 'undefined' && response.linkPager.pages.currentPage >= response.linkPager.pages.pageCount - 1) {
							if (_this.options.loadingAuto.length)
								_this.options.loadingAuto.hide();
							if (_this.options.loadingButton.length)
								_this.options.loadingButton.hide();
							return;
						}

						$(window).trigger('scroll');
					}
				});
			}

			// method init loadmore action for auto loading with scroll
			_this.initScrollLoadmore = function() {
				var $elementLoading = _this.options.loadingAuto;
				if ($elementLoading.length == 0) return;
				if (_this.currentPage < _this.options.pageAutoLoad) {
					_this.options.loadingAuto.show();
					_this.options.loadingButton.hide();
				} else {
					_this.options.loadingAuto.hide();
					_this.options.loadingButton.show();
				}
				var callback = function() {
					var offsetTop = $elementLoading.offset().top;
					if ($elementLoading.css('display') != 'none' && !$elementLoading.hasClass('js-loading') && offsetTop < $(window).scrollTop() + $(window).height()) {
						_this.loadmore();
					}
				}
				$(window).scroll(function() {
					callback();
				});
			}

			// method init button loadmore
			_this.initButtonLoadmore = function() {
				var $elementLoading = _this.options.loadingButton;
				if ($elementLoading.length == 0) return;
				$elementLoading.find('input').click(function(){
					if (!$elementLoading.hasClass('js-loading'))
						_this.loadmore();
				});
			}

			_this.setResponse = function(response) {
				_this.responseContainLinkPager = response;
				var responseContainLinkPager = _this.responseContainLinkPager;
				if (responseContainLinkPager != null && typeof responseContainLinkPager.linkPager != 'undefined') {
					// show result not found
					if (responseContainLinkPager.linkPager.pages.pageCount <= 1 && responseContainLinkPager.linkPager.pages.itemCount == 0) {
						_this.options.notFoundElement != null && _this.options.notFoundElement.show();
					} else {
						_this.options.notFoundElement != null && _this.options.notFoundElement.hide();
					}

					// hide loading if over page
					if (responseContainLinkPager.linkPager.pages.pageCount <= 1) {
						if (_this.options.loadingAuto.length)
							_this.options.loadingAuto.hide();
						if (_this.options.loadingButton.length)
							_this.options.loadingButton.hide();
						return;
					}
				}
			}

			// init object
			_this.init = function() {
				if (typeof options != 'undefined') {
					_this.setOptions(options);
					_this.initScrollLoadmore();
					_this.initButtonLoadmore();
				}
			}

			// call init
			_this.init();
		}
	};
})(jQuery, zone);