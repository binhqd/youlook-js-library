;if(window.jQuery) (function($){
	window['zone'] = {
		redirect: function(strUrl) {
			window.location = strUrl;
		},
		History : {
			pushState : function(url) {
				if (!zone.zonetype.isPopState) {
					isHistory = typeof isHistory !== 'undefined' ? isHistory : 1;
					
					if (isHistory) {
						history.pushState( null, null , url);
					}
				}
			}
		},
		Element : {
			create : function(data, options) {
				var _defaultOptions = {
					callback : function() {
						console.log('Need to implement this callback');
					},
					templateID : 'tmplItem',
					container : null
				};
				
				options = $.extend(true, {}, _defaultOptions, options);
				
				var item = $.tmpl($('#' + options.templateID), data);
				item.find('.wd-description').greennetReplaceLink();
				// binding datasource to current item
				item.data('datasource', data);
				
				if (typeof options.callback == "function") {
					options.callback(item);
				}
				return item;
			},
			recreate : function(item, data, options) {
				var newItem = zone.Element.create(data, options);
				newItem.before(item);
				item.remove();
			}
		},
		/**
		 * Namespace for working with list
		 */
		List : {
			/**
			 * Pagination class
			 */
			Pagination : {
				/**
				 * This method is used to setup new pagination object
				 * @param options
				 */
				setup : function(options) {
					var _defaultOptions = {
						pathPart : '',
						queryPart : '',
						pages : 1,
						navSelector : null,
						nextSelector : null,
						container : null,
						pixelsFromNavToBottom : 100,
						callback : function(res) {
							console.log('Need implementation for paginatio callback');
						}
					};
					options = $.extend(true, {}, _defaultOptions, options);
					
					options.container.infinitescroll({
						navSelector		: options.navSelector,
						nextSelector	: options.nextSelector,
						dataType		: 'json',
						maxPage			: options.pages,
						appendCallback	: false,
						pixelsFromNavToBottom : options.pixelsFromNavToBottom,
						path : [options.pathPart, options.queryPart],
						loading: {
							finishedMsg: 'No more pages to load.',
							img: homeURL+'/myzone_v1/img/front/ajax-loader.gif'
						}
					}, function(res) {
							if (typeof options.callback != "function") {
								console.log("Invalid callback for infinite scroll");
							} else {
								options.callback(res);
							}
						}
					);
				}
			},
			renderItem : function(data, options) {
				return zone.Element.create(data, options);
			},
			/**
			 * This method is used to setup new List object
			 * @param options
			 */
			setup: function(options) {
				var _defaultOptions = {
					pathPart : '', 
					queryPart : '',
					limit : 10,
					cache : {
						enable : true,
						dataset : 'dataset'
					},
					container : null,
					dataType : 'json',
					renderItem : function(data, options) {
						console.log('Need to implement renderItem method');
					},
					success : function(res) {
						console.log('Need to implement success method');
					}
				};
				
				options = $.extend(true, {}, _defaultOptions, options);
				
				var cacheData = null;
				
				if (options.cache.enable) {
					cacheData = options.container.data(options.cache.dataset);
				}
				
				var navSelector = options.container.next('.page-infinitive-nav');
				var nextSelector = navSelector.find('a');
				
				if (!options.cache.enable || typeof cacheData != "object" || cacheData == null) {
					$.ajax({
						url : options.pathPart + '1' + options.queryPart,
						dataType : options.dataType,
						success : function(res) {
							if (options.cache.enable) {
								options.container.data(options.cache.dataset, res);
							}
							
							options.success(res);
							
							// setup pagination
							var pages = Math.ceil(res.total / options.limit);
							var offset = navSelector.offset();
							var pixelsFromNavToBottom = $(document).height() - (offset ? offset.top : 0) - 60;
							
							zone.List.Pagination.setup({
								pathPart	: options.pathPart,
								queryPart	: options.queryPart,
								pages		: pages,
								navSelector		: navSelector,
								nextSelector	: nextSelector,
								container	: options.container,
								pixelsFromNavToBottom : pixelsFromNavToBottom,
								callback : function(res) {
									options.success(res);
								}
							});
						}
					});
				} else {
					console.log('Load from cache');
					options.success(cacheData);
					
					// setup pagination
					var pages = Math.ceil(cacheData.total / options.limit);
					var pixelsFromNavToBottom = $(document).height() - navSelector.offset().top - 60;
					
					zone.List.Pagination.setup({
						pathPart	: options.pathPart,
						queryPart	: options.queryPart,
						pages		: pages,
						navSelector		: navSelector,
						nextSelector	: nextSelector,
						container	: options.container,
						pixelsFromNavToBottom : pixelsFromNavToBottom,
						callback : function(res) {
							options.success(res);
						}
					});
				}
			}
		}
	};
	window['Libs'] = {
		makeid : function(strLength) {
			if (typeof strLength == "undefined") strLength = 5;
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			for( var i=0; i < strLength; i++ )
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			return text;
		}
	}
})(jQuery);
;(function($, scope){
	scope['Common'] = {
		init : function(){

		},
		Event:{
			loadEmoticon:function(){
				try{
					$(".emoticon").emoticon();
				}catch(e){
					console.log(e.message);
				}
			}
		},
		obj:{
			niceScroll:{
				touchbehavior:false,
				cursorcolor:"#282828",
				cursoropacitymax:2.7,
				cursorwidth:5,
				spacebarenabled:false,
				cursorborder:"1px solid #333333",
				cursorborderradius:"8px",
				background:"#ccc",
				autohidemode:"scroll"
			}
		}
	};
	
	scope['Form'] = {
		Default : function(options) {
			var _defaultOptions = {
				form : null,
				txtTitle : null,
				txtDescription : null,
				filesContainer : null,
				btnPost : null,
				allowTitleEmpty : true,
				albumID : "",
				fileInputContainer : null,
				
				// callbacks
				beforePost : function() {console.log('You may implement before post callback');},
				afterPosted : function(res) {console.log('Need to implement after posted callback');},
				
				reset : function() {
					this.txtTitle.val('');
					if (this.txtDescription != null) this.txtDescription.val('');
					this.btnPost.removeAttr('disabled');
					if (this.filesContainer != null) this.filesContainer.html('');
					this.fileIDs = [];
					
					if (this.fileInputContainer != null) this.fileInputContainer.html('');
					
					this.countFiles = 0;
					this.setAvailableStatus();
				}
			};
			
			this.options = $.extend(true, {}, _defaultOptions, options);
			
			this.form = this.options.form;
			this.txtTitle = this.options.txtTitle;
			this.txtDescription = this.options.txtDescription;
			this.filesContainer = this.options.filesContainer;
			this.btnPost = this.options.btnPost;
			
			this.countFiles = 0;
			this.fileIDs = [];
			this.fileInputContainer = this.options.fileInputContainer;
			
			this.reset = this.options.reset;
			
			var _form = this;
			
			/**
			 * Method for popup window for selecting files
			 * Still not implement yet 
			 */
			this.selectFiles = function() {
				
			};
			
			/**
			 * Method for adding files to form
			 * Still not implement yet
			 */
			this.addFile = function() {
				_form.countFiles++;
				
				_form.setAvailableStatus();
			};
			
			/**
			 * Method for removing file from form
			 */
			this.removeFile = function() {
				_form.countFiles--;
				
				_form.setAvailableStatus();
			};
			
			this.enable = function() {
				_form.btnPost.removeAttr("disabled");
			};
			
			/**
			 * This method is used to set available status based on form data
			 */
			this.setAvailableStatus = function() {
				if ((!this.options.allowTitleEmpty && _form.txtTitle == "") || _form.countFiles == 0) {
					_form.btnPost.attr("disabled","disabled");
				} else {
					_form.btnPost.removeAttr("disabled");
				}
			};
			
			// set up events
			// disable button if title of album is empty

			this.txtTitle.keyup(function(e) {
				_form.setAvailableStatus();
			});
			
			// setup event on posting
			this.btnPost.click(function() {
				// callback before posting
				_form.options.beforePost();
				
				var postData	= _form.form.serialize();
				var action		= _form.form.attr('action');
				// perform ajax posting
				$.ajax({
					type	: "POST",
					data	: postData,
					url		: action,
					success	: function(res) {
						//var hanlder = zone.usernode.activity.form.btnPostStatus.data("loginCompleted");
						//hanlder && hanlder();
						
						// hide loading
						if (typeof _form.options.afterPosted == "function") {
							_form.options.afterPosted(res);
							
							_form.reset();
						} else {
							console.log(res);
						}
						
					},
					error: function (xhr, ajaxOptions, thrownError) {
						console.log(xhr.responseText);
						
						/* hide loading */
						//_form.reset();
					}
				});
			});
		}
	};
})(jQuery, zone);
;(function($, scope){
	scope['EventHelper'] = {
		init : function(){
		

		},
		Actions : {
			urlValid:function(url){
				var myVariable = url;
				if(/^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(myVariable)) {
					return true;
				} else {
					return false;
				}
			}
		},
		objHtml:{

		}
	}
})(jQuery, zone);

;(function($, scope){
	scope['MessageBar'] = {
		init : function(){
		

		},
		resendEmail : function(){
			zone.MessageBar.objHtml.resendEmail = $(".resend-email");
			$('body').on('click', '.resend-email', function(e){
				$.get($(this).attr('href'),function(res){
					$(".content-message").html("<span class='wd-intro'>"+res.message+"</span>");
					if(res.error){
						$(".wd-top-mess-content").addClass('wd-top-mess-content-error');
					}else{
						$(".wd-top-mess-content").addClass('wd-top-mess-content-success');
					}
				});
				return false;
				
			});
		},
		closeMessage:function(){
			zone.MessageBar.objHtml.closeMessage = $(".wd-close-topmess");
			$('body').on('click', '.wd-close-topmess,.wd-link', function(e){
				$("."+$(this).attr('target')).fadeOut(500);
				return false;
				
			});
		},
		data:{

		},
		objHtml:{
			resendEmail:null,
			closeMessage:null
		}
	}
})(jQuery, zone);

$(document).ready(function(){
	// disable all empty link href='#'
	$('body').on('click', 'a.empty-link', function() {return false;});
	
	// HuyTBT hot fix this (added try catch)
	try {
		zone.Common.Event.loadEmoticon();
	} catch ($e) {}
	try {
		zone.MessageBar.resendEmail();
		zone.MessageBar.closeMessage();
	} catch ($e) {}

	
	/**
	 * This event used save session categories for myzone
	 **/
	$('body').on('click', '#saveCategoryNav', function(e){
	
		var _this = $(this);
		$.get(homeURL+"/categories/api/changeCat",{cat:_this.attr('typeId'),keyword:_this.attr('key_search')},function(res){
			window.location.href = homeURL+"/landingpage?interest="+_this.attr('key_search');
		});
	});
	
});

function addReview(token,objectId){
	var _this = $("#textareaReview"+token);
	var objForm = $("#frmAddReview"+token);
	var action = objForm.attr('action');
	var objViewMore = $("#viewMore"+token);
	
	$.ajax({
		url			: action,
		data		: objForm.serialize(),
		type		:'POST',
		dataType	: 'json',
		success		: function (res) {
			console.log(res);
			_this.removeAttr("disabled");
			_this.val('');
			_this.css({
				height:'40px'
			});
			if(res.error){
			
			}else{
				$("#contentComments"+token).prepend(res.content);
				$('.hide-row-comment').fadeIn(1000);
				$("#box-comment-"+token).removeClass("bdbno");
				var startPage = parseInt(objViewMore.attr('totalrecord'));
				if($.isNumeric(startPage)){
					startPage = parseInt(startPage) + 1;
				}
				/*if($("#numberComment").length != 0){
					var numberComment = parseInt($("#numberComment").html()) + 1;
					$("#numberComment").html(numberComment);
					if(numberComment == 1){
						$("#textNumberComment").html("comment");
					}else $("#textNumberComment").html("comments");
				}*/
				// fix count comment on page profile
				var numberComment = parseInt($("#wd-comment-viewall"+objectId).find('#numberComment').html()) + 1;
				if(numberComment == 1){
					$("#wd-comment-viewall"+objectId).find("#textNumberComment").html(" comment");
				}else 
					$("#wd-comment-viewall"+objectId).find("#textNumberComment").html(" comments");
				if(typeof $("#wd-comment-viewall"+objectId) !="undefined"){
					$("#wd-comment-viewall"+objectId).find('#numberComment').html(numberComment);
				}
				objViewMore.attr('totalrecord',startPage);
				
				
				try{
					jQuery(" .timeago").timeago();
					$("#contentComments"+token).find("a.truncate_more_link").first().on('click',function(e){
						var _this = $(this);
						_this.parent().parent().find('label:first').show();
						_this.parent().parent().find('label:last').hide();
					});
				}catch(etime){
					console.log(etime.message);
				}
				registerDeleteComment($('.js-delete-comment'));
				/*Tooltip*/
				$('.wd-tooltip-hover').tipsy({gravity: 's'});
				zone.Common.Event.loadEmoticon();
			}
			
			
		},error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.responseText);
			_this.removeAttr("disabled");
		}
	});
}
function submitReview(token,event,objectId){
	if (event.keyCode == 13){
		addReview(token,objectId);
		return false;
	}
}