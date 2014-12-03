// Class
;(function($, scope){
	scope['databinding'] = {
		// pool variables
		_pool : {},
		
		// init function
		init : function(selector) {
			$(selector).each(function() {
				
			});
		},
		
		find : function(selector) {
			var items = selector;
			if (typeof selector == "string") {
				items = $(selector);
			}
			return new scope.databinding.Items(items);
		},
		Items : function(items) {
			this._items = items;
			this.bind = function(options) {
				var _defaultOptions = {
					data : null,
					beforeBinding : function(item, data) {},
					afterBinding : function(item, data) {}
				};
				options = $.extend(true, {}, _defaultOptions, options);
				
				with(options.data) {
					this._items.each(function(i, _item) {
						var item = $(_item);
						var template = item.attr('data-bind');
						
						// callback for before binding
						if (typeof options.beforeBinding == "function") {
							options.data = options.beforeBinding(item, options.data);
						}
						 
						var obj = eval("var _bindingString = " + template + ";_bindingString");
						
						// binding attributes
						if (typeof obj.attributes == "object") {
							for (var prop in obj.attributes) {
								item.attr(prop, obj.attributes[prop]);
							}
						}
						
						// binding input value
						if (typeof obj.value == "string") {
							if (_item.tagName == 'input') {
								item.val(obj.value);
							}
						}
						
						// biding text
						if (typeof obj.text == "string") {
							_item.text(obj.text);
						}
						
						// binding content
						
						// callback for before binding
						if (typeof options.afterBinding == "function") {
							options.afterBinding(item, options.data);
						}
						//item.attr(RegExp.$1, out);
					});
				}
			};
		}
	};
})(jQuery, zone);

// Examples
// zone.databinding.find(selector).bind(data);