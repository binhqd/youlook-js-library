// Class
;(function($, scope){
	scope['activity'] = {
		// pool variables
		_pool : {},
		
		// init function
		setup : function(options) {
			var _defaultOptions = {
				limit : 10,
				partPart : '',
				queryPart : '',
				itemRenderer : function(data) {
					console.log('Need to implement ');
				}
			};
			
			options = $.extend(true, {}, _defaultOptions, options);
			
			// setup
			zone.List.setup({
				pathPart : options.pathPart, 
				queryPart : options.queryPart,
				cache : {
					enable : true,
					dataset : 'activities' 
				},
				limit : options.limit,
				success : function(res) {
					for (var i = 0; i < res.data.length; i++) {
						// render item
						zone.usernode.article.Actions.renderArticleItem(res.data[i]);
					}
				},
				container : zone.usernode.article.listArticleContainer
			});
		},
		init: function(options) {
			var _defaultOptions = {
				mainContainer 	: $('#mainContainer')
			};
			
			options = $.extend(true, {}, _defaultOptions, options);
			
			this.mainContainer = options.mainContainer;
			
			// photo container
			if (typeof options.listActivityContainer != "undefined") {
				this.listActivityContainer = options.listActivityContainer;
			} else {
				this.listActivityContainer = this.mainContainer.find('ul.listActivities');
			}
			
		},
		buildOptions : function(activity, templateID, isAppend) {
			var _this = this;
			return {
				templateID : templateID,
				callback : function(renderedActivity) {
					if (typeof isAppend == "undefined" || isAppend == "append") {
						_this.listActivityContainer.append(renderedActivity);
					} else {
						_this.listActivityContainer.prepend(renderedActivity);
					}
					
					renderedActivity.find('.timeago').timeago();
					
					if (templateID == "tmplActivityPostArticleItem") {
						renderedActivity.find('.wd-description').greennetExpand({
							readMoreText	: 'Read more',
							readLessText	: 'Read less',
							numberOfWord	: 350,
							readLess		: false,
							readMore		: false
						});
					} else if (templateID == "tmplActivityFollowNodeItem") {
						renderedActivity.find('.nodeDescription').greennetExpand({
							readMoreText	: 'Read more',
							readLessText	: 'Read less',
							numberOfWord	: 100,
							readLess		: false,
							readMore		: false
						});
						try {
							$.Followings.initLinks(renderedActivity.find(".js-following-request"));
						} catch ($ex) {}
					} else if (templateID == "tmplActivityCreateNode") {
						try {
							$.Followings.initLinks(renderedActivity.find(".js-following-request"));
						} catch ($ex) {}
					} else if (templateID == "tmplActivityPostVideoItem") {
						var content = renderedActivity.find('.video-desc').html();
						content = content.replace(/(<([^>]+)>)/ig,"").replace("\n", "<br />");
						
						renderedActivity.find('.video-desc').html(content);
						renderedActivity.find('.video-desc').greennetExpand({
							readMoreText	: 'Read more',
							readLessText	: 'Read less',
							numberOfWord	: 200,
							readLess		: false,
							readMore		: false
						});
					}
					
					// setup comments & likes
					zone.like.setup(renderedActivity.find('.object-like'), {
						object_id : activity.object_id,
						action : homeURL + '/activity/like',
						actionLike : homeURL + '/activity/like',
						actionUnlike : homeURL + '/activity/unlike',
						text : activity.like.text,
						liked : activity.like.liked
					});
					
					zone.comment.setup(renderedActivity.find('.object-comment'), {
						formTemplateID	: 'tmplCommentForm',								// jQuery template ID for the form
						itemTemplateID	: 'tmplCommentItem', 								// jQuery template ID for comment item
						object_id : activity.object_id,										// object_id
						listComments : '.list-comments',									// selector for object that contains comments
						showCommentsBox: false,												// Not show list comment on load page
						direction : 'downsideup',											// direction of list of comments
						comments : activity.comments,										// init comments
						total : activity.countComments,										// total comments
						moreComments : {													// options for read more comments
							elem : renderedActivity.find('a.more-comments'),							// element that trigger the 'read more' action
							moreElemContainer : renderedActivity.find('div.more-comment-section'),	// hide when all comments are loaded
							text : "View more comments",									// text for read more comments
							moreURI : homeURL + '/activity/moreComments',					// the URI (without query string) for get more comments
							pageSize : 10													// number of comments to load each 'read more' action
						},
						text : {
							container : renderedActivity.find('div.comment-status'),
							renderer : function(total) {
								return "<span class=\"wd-comment-bt\"></span><span class=\"wd-number total-comments\" data-bind=\"{text : total}\">"+total+"</span> <span class=\"js-comment-text\">"+((total == 1) ? "Comment" : "Comments")+"</span>";
							}
						},
						beforeRender : function(data) { // callback before render a comment. Comment data need to be passed and it need to be returned after processing
							data.content = data.content.replace(/(<([^>]+)>)/ig,"").replace("\n", "<br />");
							return data;
						},
						afterRender : function(data, renderedComment) { // callback after a comment has been rendered.
							renderedComment.find('.comment-content').greennetExpand({
								readMoreText	: 'Read more',
								readLessText	: 'Read less',
								numberOfWord	: 220,
								readLess		: true,
								readMore		: true
							});
							registerDeleteComment($('.js-delete-comment'));/*VuNDH add code*/
							//zone.databinding.find(renderedComment.find('.total-comments')).bind(data.total);
						},
						deleteComment : {
							deleteSelector : '.delete',
							deleteURI : homeURL + '/activity/deleteComment',
							afterDelete : function(res) {} // callback after a comment has been deleted
						},
						post : {
							commentFormContainer : '.comment-form',								// container that contains form
							action : homeURL + '/activity/addComment',							// action URL for sending comment
							onError : {
								//showError : function(res, commentItem) {}
							}
						}
					});
				}
			};
		},
		getActivities : function(options) {
			var _this = this;
			var _defaultOptions = {
				pathPart	: homeURL + '/api/user/activities?page=',
				queryPart	: '&limit=' + _this.config.limit + '&id='
			};
			
			options = $.extend(true, {}, _defaultOptions, options);
			
			/*Load photo*/
			
			zone.List.setup({
				pathPart : options.pathPart, 
				queryPart : options.queryPart,
				cache : {
					enable : true,
					dataset : 'usernode-activities'
				},
				limit : _this.config.limit,
				dataType : 'json',
				success : function(res) {
					if (res.activities.length > 0) {
						res.total = 1000;
					} else {
						res.total = 0;
						//$('.selector').infinitescroll('pause');
					}
					
					//alert($ res.activities);
					$.each(res.activities || [], function(u,activity) {
						//var activity = res.activities[i];
						
						var templateID = '';
						switch (activity.object_type) {
							case 'Album':
								templateID = 'tmplActivityAlbumItem';
								break;
							case 'Article':
								templateID = 'tmplActivityPostArticleItem';
								break;
							case 'Node':
								switch (activity.type) {
									case 'Follow':
										templateID = 'tmplActivityFollowNodeItem';
										break;
									case 'Post':
										templateID = 'tmplActivityCreateNode';
										break;
								}
								break;
							case 'Video':
								templateID = 'tmplActivityPostVideoItem';
								break;
						}
						
						// render item
//							console.log(activity);
						zone.List.renderItem(activity, _this.buildOptions(activity, templateID));
					});
				},
				container : _this.listActivityContainer
			});
		}
	};
})(jQuery, zone);

;(function($, scope){
	scope['post'] = {
		// token,postPhoto,tokenMerge
		postArticle : function () {
			var title = scope.form.txtStatusTitle.val();
			var content = scope.form.txtStatusContent.val();
			
			if ($.trim(content) == "") {
				scope.form.txtStatusContent.focus();
				return false;
			}
			
			var action = scope.form.frmPostStatus.attr('action');
			
			// $("#loading"+tokenMerge).show();
			
			var dataUrl = scope.form.frmPostStatus.serialize();
			
			// Disable all form input
			scope.form.txtStatusTitle.attr("disabled", "disabled");
			scope.form.txtStatusContent.attr("disabled", "disabled");
			scope.form.btnPostStatus.attr("disabled", "disabled");
			
			$.ajax({
				type	: "POST",
				data	: dataUrl,
				url		: action,
				success	: function(res) {
					var hanlder = zone.usernode.activity.form.btnPostStatus.data("loginCompleted");
					hanlder && hanlder();
					
					// Create object like activity
					var activity = {
						id			: null,
						receiver_id : null,
						user_id		: null,
						type		: "Post",
						object_id	: res.article.id,
						object_type	: "Article",
						created		: "2013-11-17T06:27:23+0100",
						notify		: "0",
						invalid		: "0",
						related		: {
							message	: "",
							user	: res.author,
							article	: res.article,
							object	: null
						},
						like: {
							you_liked: false,
							classRating: "",
							action: "/activity/like",
							value: "Like",
							count: 0,
							text: "Like",
							object_id: res.article.id,
							type: "like",
							actionUnlike: "/activity/unlike"
						},
						comments: [ ],
						countComments: "0"
					};
					
					if(res.error){
						console.log(res);
					} else {
						
						zone.List.renderItem(activity, zone.usernode.activity.buildOptions(activity, 'tmplActivityPostArticleItem', 'prepend'));
						
						zone.usernode.activity.form.txtStatusTitle.removeAttr('disabled').val('');
						zone.usernode.activity.form.txtStatusContent.removeAttr('disabled').val('');
						zone.usernode.activity.form.btnPostStatus.removeAttr('disabled');
					}
					
					//$("#loading"+tokenMerge).hide();
					//zone.formPost.checkGetUrl = false;
					
					$("#filesStatusContainer").html('');
					$(".redactor_editor").html('');
				},
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.responseText);
					$(".wd-top-mess-form-post .wd-top-mess-content-error").hide();
					$("#loading"+tokenMerge).hide();
					$("#title"+token+",#content"+token).removeAttr("disabled");
					//$("#btnSubmit"+token).removeAttr("disabled");
				}
			});
		},
		
		init : function(){
			
		},
		
		triggerAddFile: function(token){
			var btnAttachments = $("#btnAttachments"+token);
			var gallery = $(".gallery"+token);
			var displatzoneUpload = $.trim($("#zoneUpload"+token).css('display'));
			gallery.find('form .fileupload-buttonbar .span7 input:file').trigger('click');
		},
		
		checkValue:function(token,bothField,event){
			$(".redactor_editor").keyup(function(e){
				if($("#content"+zone.formPost.token.post).val() != "" && $("#title"+zone.formPost.token.post).val() != "") $("#btnPostStatus").removeAttr("disabled");
				else $("#btnPostStatus").attr("disabled","disabled");
			});
			
			$("#title"+zone.formPost.token.post).keyup(function(e){
				if($("#content"+zone.formPost.token.post).val() != "" && $("#title"+zone.formPost.token.post).val() != "") $("#btnPostStatus").removeAttr("disabled");
				else $("#btnPostStatus").attr("disabled","disabled");
			});
			$("#content"+zone.formPost.token.post).keyup(function(e){
				var bothField = $(this).attr('bothField');
				if(bothField == ""){
					if($("#content"+zone.formPost.token.post).val() != ""){
						$("#btnPostStatus").removeAttr("disabled");
						var content = $("#content"+zone.formPost.token.post).val();
						var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
						var url= content.match(urlRegex);
						if(url != null){
							zone.formPost.getUrlInfo(url,$(this).attr('tokenMerge'),$(this).attr('token'));
						}
					}else $("#btnPostStatus").attr("disabled","disabled");

					return false;
				}
			});
			
		},
		getUrlInfo : function(url,tokenMerge,token){
			if(!zone.formPost.checkGetUrl){
				zone.formPost.checkGetUrl = true;
				$("#loading"+tokenMerge).show();
				$("#btnSubmit"+token).attr("disabled", "disabled");
				$.post(homeURL+"/status/default/getUrl", {url: url})
				.done( function(res) { 
					if(typeof res.error !="undefined"){
						if(res.error){
							zone.formPost.checkGetUrl = false;
						}else{
							
						}
					}else{
						$("#pullPostLink").html(res);
						$("#pullPostLink").show();
					}
					$("#loading"+tokenMerge).hide();
					$("#btnSubmit"+token).removeAttr("disabled");
					
				}).fail( function(xhr, textStatus, errorThrown) {
					$("#loading"+tokenMerge).hide();
					// $("#dataOther").val("");
					console.log(xhr.statusText);
					
				});
				
			}
		},
		data:{

		},
		objHtml:{
			
		},
		token:{
			post:null
		},
		checkGetUrl: false
	};
	
})(jQuery, zone.activity);