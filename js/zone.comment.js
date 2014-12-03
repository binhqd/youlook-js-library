;(function($, scope){
	scope['comment'] = {
		container : null,
		object_id : null,
		button : null,
		direction : {
			up : 'upsidedown',
			down : 'downsideup'
		},
		config : {
			
		},
		Actions : {
			attachDeleteAction : function(commentItem, options, data) {
				var btnDelete = commentItem.find(options.deleteComment.deleteSelector);
				if (btnDelete.length) {
					if (user.id == data.poster.id) {
						btnDelete.show();
						btnDelete.click(function() {
							jConfirm('Are you sure you want to delete this comment?', 'Delete comment', function(r) {
								if(r){
									$.ajax({
										url		: options.deleteComment.deleteURI + '?id=' + data.id,
										dataType: 'JSON',
										success : function(res) {
											// Call callback
											options.deleteComment.afterDelete(res);
											if (!res.error) {
												// remove item
												commentItem.remove();
												options.currentComments--;
												if(typeof res.total != undefined) {
													options.text.container.html('').append(options.text.renderer(res.total));
												}
												/*Remove tooltip*/
												$(".tipsy-south").hide();
											} else {
												console.log(res.message);
											}
										}
									});
								}
							});
							return false;
						});
					} else {
						btnDelete.hide();
					}
				}
			},
			renderItem : function(options, data, container, itemTemplateID, direction, revert) {
				// call beforeRender callback
				data = options.beforeRender(data);
				if (typeof revert == undefined || revert !== true) {
					revert = false;
				}
				// render comment item base on input data
				var commentItem = $.tmpl($('#' + itemTemplateID), data).hide();
				
				commentItem.find(".timeago").timeago();
				
				// revert adding order
				if ((direction == zone.comment.direction.up && !revert) || (revert && direction == zone.comment.direction.down)) {
					container.append(commentItem);
				} else {
					container.prepend(commentItem);
				}
				options.afterRender(data, commentItem);
				// attach delete action if valid
				if (data.id != null) {
					zone.comment.Actions.attachDeleteAction(commentItem, options, data);
				}
				commentItem.fadeIn(1000);
				commentItem.data('temp', data);
				/*Tooltip*/
				$('.wd-tooltip-hover').tipsy({gravity: 's'});
				return commentItem;
			},
			renderListItems : function(options, arrComments, container, itemTemplateID, direction, revert) {
				if (typeof revert == undefined || revert !== true) {
					revert = false;
				}
				
				if (revert) {
					for (var i = 0; i < arrComments.length; i++) {
						zone.comment.Actions.renderItem(options, arrComments[i], container, itemTemplateID, direction, revert);
					}
				} else {
					for (var i = arrComments.length - 1; i >= 0; i--) {
						zone.comment.Actions.renderItem(options, arrComments[i], container, itemTemplateID, direction, revert);
					}
				}
				
				options.afterRenderAll();
			}
		},
		setup : function(elem, options) {
			// default options
			var _defaultOptions = {
				formTemplateID : 'tmplCommentForm',
				itemTemplateID	: 'tmplCommentItem',
				object_id : null,
				listComments : '.list-comments',
				direction : 'upsidedown', // downsideup
				inputSelector : 'textarea',
				showForm : true,
				showListComments : true,
				showCommentsBox : true, // show module comment
				comments : [],
				total : 0,
				moreComments : {
					elem : null,
					moreElemContainer : null, // hide when all comments are loaded
					text : "View more",
					moreURI : homeURL + '/comments/comment/viewMore',
					pageSize : 100
				},
				text : {
					container : null,
					renderer : function(total) {
						return "<span class=\"wd-number\">"+total+"</span> <span>"+((total == 1) ? "comment" : "comments")+"</span>";
					}
				},
				beforeRender : function(data) {return data;},
				afterRender : function(data, renderedElem) {return data;},
				afterRenderAll : function() {},
				deleteComment : {
					deleteSelector : '.delete',
					deleteURI : homeURL + '/comments/comment/delete',
					afterDelete : function(res) {}
				},
				post : {
					commentFormContainer : '.comment-form',
					formData : {},
					dataType : 'JSON',
					action : homeURL + '/comments/comment/addComment',
					onError : {
						showError : function(res, commentItem) {
							var message = '';
							if (typeof res.message == "string") {
								message = res.message;
							} else if (typeof res.statusText == 'string') {
								message = "Send failed";
							}
							var errorNotice = commentItem.find('.error');
							if (errorNotice.length == 0) {
								errorNotice = $("<div style='color:#ff0000;float:right;clear:both;font-size:10px;font-style:italic'>"+message+"</div>");
								commentItem.append(errorNotice);
							} else {
								errorNotice.html(message);
								errorNotice.show();
							}
						}
					}
				}
			};
			options = $.extend(true, {}, _defaultOptions, options);
			options.currentComments = options.comments.length;
			
			elem.data('options', options);

			// Hide comment box
			if (!options.showCommentsBox) {
				elem.hide();
			}

			// render list of comments
			var listCommentContainer = elem.find(options.listComments);
			if (options.showListComments) {
				zone.comment.Actions.renderListItems(options, options.comments, listCommentContainer, options.itemTemplateID, options.direction);
			}
			
			// render status text
			options.text.container.html('').append(options.text.renderer(options.total));
			options.text.container.click(function(){
				elem.fadeIn();
			});
			
			// setup more comments
			if (options.moreComments.elem != null) {
				// Hide view more action by default
				options.moreComments.elem.hide();
				options.moreComments.moreElemContainer.hide();
				if(typeof options.moreComments.elem[0] != undefined && typeof options.moreComments.elem[0].tagName== undefined) return;
				var viewMoreTagName = (options.moreComments.elem[0].tagName).toLowerCase();

				// check if viewmore is an 'a' tag or a button
				if (viewMoreTagName != 'a' && viewMoreTagName != 'button' && (viewMoreTagName != 'input' || viewMoreTagName.attr('type') != 'button')) {
					console.log('Invalid readmore element');
				} else {
					if (viewMoreTagName == 'a') {
						options.moreComments.elem.html(options.moreComments.text);
					} else {
						options.moreComments.elem.attr('value', options.moreComments.text); 
					}
				}

				if (options.total > options.comments.length) {
					options.moreComments.elem.show();
					options.moreComments.moreElemContainer.show();

					// setup event for view more link
					options.moreComments.elem.click(function() {
						options.moreComments.elem.addClass('disabled');
						$.ajax({
							url : options.moreComments.moreURI + '?startList='+options.currentComments+'&objectId='+options.object_id+'&limit=' + options.moreComments.pageSize, // limit = null mean load all
							dataType : 'json',
							success : function(res) {
								options.moreComments.elem.removeClass('disabled');
								zone.comment.Actions.renderListItems(options, res.comments, listCommentContainer, options.itemTemplateID, options.direction, true);
								
								options.currentComments += res.comments.length;
								
								// if all comments are loaded, hide view more button
								if (!(parseInt(res.info.total) > options.currentComments)) {
									options.moreComments.moreElemContainer.hide();
								}
							}
						});
						
						return false;
					});
				}
			}
			
			// setup form
			if (options.showForm) {
				
				var formContainer = elem.find(options.post.commentFormContainer);
				if (formContainer.length == 0) {
					formContainer = $("<div class='"+options.post.commentFormContainer+"'></div>");
					elem.append(formContainer);
				}
				
				var formTemplate = $.tmpl($('#' + options.formTemplateID), options.post.formData);
				var objForm = formTemplate.find('form');
				
				// setup object_id
				var inputObjectID = objForm.find('input.object_id');
				if (inputObjectID.length == 0) {
					inputObjectID = $("<input type=\"hidden\" value=\"\" name=\"objectId\" class=\"object_id\"/>");
					objForm.append(inputObjectID);
				}
				inputObjectID.val(options.object_id);
				
				// create token input
				var inputToken = objForm.find('input.token');
				if (inputToken.length == 0) {
					inputToken = $("<input type=\"hidden\" value=\"\" name=\"token\" class=\"token\"/>");
					objForm.append(inputToken);
				}
				
				// append form
				formContainer.append(formTemplate);
				
				// check input event
				var input = formTemplate.find(options.inputSelector);
				
				// force name of input to be 'content'
				input.attr('name', 'content');
				input.keydown(function(e) {
					if (e.keyCode == 13){
						var val = input.val().trim();
						
						if (val == '') {
							input.val('');
							console.log('Empty input for comment');
							return false;
						}
						
						// sending
						var commentData = {
							content	: input.val().replace(/(<([^>]+)>)/ig,"").replace("\n", "<br />"),
							poster	: user,
							created: (new Date()).toISOString(),
							data_status: 1,
							date: (new Date()).toISOString(),
							id: null,
							object_id: options.object_id,
							token : window.Libs.makeid(10)
						};
						
						// render comment item base on input data
						//var commentItem = zone.comment.Actions.renderItem(options, commentData, listCommentContainer, options.itemTemplateID, options.direction);
						
						// set token
						inputToken.val(commentData.token);
						
						var dataToSend = objForm.serialize();
						
						// reset input
						input.val('');
						
						$.ajax({
							url			: options.post.action,
							data		: dataToSend,
							dataType	: 'json',
							type		: 'POST',
							success		: function (res) {
								//_this.removeAttr("disabled");
								if (res.error) {
									// render comment item base on input data
									var commentItem = zone.comment.Actions.renderItem(options, commentData, listCommentContainer, options.itemTemplateID, options.direction);
									options.post.onError.showError(res, commentItem);
								} else {
									var commentItem = zone.comment.Actions.renderItem(options, res.content, listCommentContainer, options.itemTemplateID, options.direction);
									zone.comment.Actions.attachDeleteAction(commentItem, options, res.content);
									options.text.container.html('').append(options.text.renderer(res.total));
//									$("#box-comment-"+token).removeClass("bdbno");
//									var startPage = parseInt(objViewMore.attr('totalrecord'));
//									if($.isNumeric(startPage)){
//										startPage = parseInt(startPage) + 1;
//									}
//									
//									// fix count comment on page profile
//									var numberComment = parseInt($("#wd-comment-viewall"+objectId).find('#numberComment').html()) + 1;
//									if(numberComment == 1){
//										$("#wd-comment-viewall"+objectId).find("#textNumberComment").html(" comment");
//									}else 
//										$("#wd-comment-viewall"+objectId).find("#textNumberComment").html(" comments");
//									if(typeof $("#wd-comment-viewall"+objectId) !="undefined"){
//										$("#wd-comment-viewall"+objectId).find('#numberComment').html(numberComment);
//									}
//									objViewMore.attr('totalrecord',startPage);
//									
//									
//									try {
//										$("#contentComments"+token).find("a.truncate_more_link").first().on('click',function(e){
//											var _this = $(this);
//											_this.parent().parent().find('label:first').show();
//											_this.parent().parent().find('label:last').hide();
//										});
//									}catch(etime){
//										console.log(etime.message);
//									}
//									registerDeleteComment($('.js-delete-comment'));
//									zone.Common.Event.loadEmoticon();
								}
								
								
							},error: function (xhr, ajaxOptions, thrownError) {
								options.post.onError.showError(xhr, commentItem);
								
								console.log(xhr.responseText);
//								input.removeAttr("disabled");
							}
						});
						return false;
					}
				});
			}
		}
	};
})(jQuery, zone);