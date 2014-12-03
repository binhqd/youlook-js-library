/**/
;(function($, scope){
	scope['article'] = {
		mainContainer : null,
		config : {
			 limit : 10
		},
		init : function(zoneid) {
			this.mainContainer = $('#container-articles');
			this.detailContainer = $('#container-article-detail');
			this.listArticleContainer = $('ul#list-articles');
		},
		Actions : {
			loadArticleDetail : function(id) {
				var url = homeURL + '/api/article/detail?article_id=' + id;
				
				zone.usernode.article.detailContainer.html('');
				
				$.ajax({
					url : url,
					dataType : 'json',
					success : function(res) {
						if (!res.error) {
							// render article detail
							var article = $.tmpl($("#tmplArticleDetail"), res.data.article);
							
							article.find(".timeago").timeago();
							//article.find('.article-description').greennetReplaceLink();
							zone.like.setup(article.find('.object-like'), {
								object_id : res.data.article.id,
								action : homeURL + '/article/like',
								actionLike : homeURL + '/article/like',
								actionUnlike : homeURL + '/article/unlike',
								text : res.data.article.like.text,
								liked : res.data.article.like.liked
							});
							
							// append to container
							zone.usernode.article.detailContainer.append(article);
							zone.comment.setup(article.find('.object-comment'), {
								formTemplateID	: 'tmplCommentForm',								// jQuery template ID for the form
								itemTemplateID	: 'tmplCommentItem', 								// jQuery template ID for comment item
								object_id : res.data.article.id,									// object_id
								listComments : '.list-comments',									// selector for object that contains comments
								direction : 'downsideup',											// direction of list of comments
								comments : res.data.article.comments,								// init comments
								total : res.data.article.comments_count,							// total comments
								moreComments : {													// options for read more comments
									elem : article.find('a.more-comments'),							// element that trigger the 'read more' action
									moreElemContainer : article.find('div.more-comment-section'),	// hide when all comments are loaded
									text : "View more comments",									// text for read more comments
									moreURI : homeURL + '/article/moreComments',					// the URI (without query string) for get more comments
									pageSize : 10													// number of comments to load each 'read more' action
								},
								text : {
									container : article.find('div.comment-status'),
									renderer : function(total) {
										return "<span class=\"wd-comment-bt\"></span><span class=\"wd-number\">"+total+"</span> <span>"+((total == 1) ? "Comment" : "Comments")+"</span>";
									}
								},
								beforeRender : function(data) { // callback before render a comment. Comment data need to be passed and it need to be returned after processing
									data.content = data.content.replace(/(<([^>]+)>)/ig,"").replace("\n", "<br />");
									return data;
								},
								afterRender : function(data, renderedItem) { // callback after a comment has been rendered.
									renderedItem.find('.comment-content').greennetExpand({
										readMoreText	: 'Read more',
										readLessText	: 'Read less',
										numberOfWord	: 220,
										readLess		: true,
										readMore		: true
									});
									registerDeleteComment($('.js-delete-comment'));/*VuNDH add code*/
								},
								deleteComment : {
									deleteSelector : '.delete',
									deleteURI : homeURL + '/comments/comment/delete',
									afterDelete : function(res) {} // callback after a comment has been deleted
								},
								post : {
									commentFormContainer : '.comment-form',								// container that contains form
									action : homeURL + '/article/addComment',							// action URL for sending comment
									onError : {
										//showError : function(res, commentItem) {}
									}
								}
							});
						} else {
							console.log(res.message);
						}
					}
				});
			},
			renderArticleItem : function(data, isAppend) {
				return zone.List.renderItem(data, {
					templateID : 'tmplArticleItem',
					callback : function(article) {
						article.find('.article-description').greennetReplaceLink();
						article.find('.article-description').greennetExpand({
							readMoreText	: 'Read more',
							readLessText	: 'Read less',
							numberOfWord	: 220,
							readLess		: false,
							readMore		: false
						});
						
						if (typeof isAppend == "undefined" || isAppend === true) {
							zone.usernode.article.listArticleContainer.append(article);
						} else {
							zone.usernode.article.listArticleContainer.prepend(article);
						}
						
						zone.like.setup(article.find('.object-like'), {
							object_id : data.id,
							action : homeURL + '/article/like',
							actionLike : homeURL + '/article/like',
							actionUnlike : homeURL + '/article/unlike',
							text : data.like.text,
							liked : data.like.liked
						});
						
						zone.comment.setup(article.find('.object-comment'), {
							formTemplateID	: 'tmplCommentForm',								// jQuery template ID for the form
							itemTemplateID	: 'tmplCommentItem', 								// jQuery template ID for comment item
							object_id : data.id,											// object_id
							listComments : '.list-comments',									// selector for object that contains comments
							direction : 'upsidedown',											// direction of list of comments
							comments : data.comments,									// init comments
							total : data.comments_count,									// total comments
							moreComments : {													// options for read more comments
								elem : article.find('a.more-comments'),							// element that trigger the 'read more' action
								moreElemContainer : article.find('div.more-comment-section'),	// hide when all comments are loaded
								text : "View more comments",									// text for read more comments
								moreURI : homeURL + '/article/moreComments',					// the URI (without query string) for get more comments
								pageSize : 10													// number of comments to load each 'read more' action
							},
							text : {
								container : article.find('div.comment-status'),
								renderer : function(total) {
									return "<span class=\"wd-number\">"+total+"</span> <span>"+((total == 1) ? "comment" : "comments")+"</span>";
								}
							},
							beforeRender : function(data) { // callback before render a comment. Comment data need to be passed and it need to be returned after processing
								data.content = data.content.replace(/(<([^>]+)>)/ig,"").replace("\n", "<br />");
								return data;
							},
							afterRender : function(data, renderedItem) { // callback after a comment has been rendered.
								renderedItem.find('.comment-content').greennetExpand({
									readMoreText	: 'Read more',
									readLessText	: 'Read less',
									numberOfWord	: 220,
									readLess		: true,
									readMore		: true
								});
								registerDeleteComment($('.js-delete-comment'));/*VuNDH add code*/
							},
							deleteComment : {
								deleteSelector : '.delete',
								deleteURI : homeURL + '/comments/comment/delete',
								afterDelete : function(res) {} // callback after a comment has been deleted
							},
							post : {
								commentFormContainer : '.comment-form',								// container that contains form
								action : homeURL + '/article/addComment',							// action URL for sending comment
								onError : {
									//showError : function(res, commentItem) {}
								}
							}
						});
						
						// read article detail
						article.find('.lnkViewArticleDetail').click(function() {
							$("html, body").animate({ scrollTop:"200px" },1000);
							
							var id = $(this).attr('ref');
							var href= $(this).attr('href');
							zone.History.pushState(href);

							zone.usernode.GUI.cleanup();
							zone.usernode.article.GUI.showDetailContainer();
							
							$('#lnkToggleArticleForm').hide();
							$('#sectionPostArticle').hide();
							$('#container-articles').hide();
							
							zone.usernode.article.Actions.loadArticleDetail(id);
							
							return false;
						});
					}
				});
			},
			loadArticles : function(pathPart, queryPart) {
				// setup
				zone.List.setup({
					pathPart : pathPart, 
					queryPart : queryPart,
					cache : {
						enable : true,
						dataset : 'articles' 
					},
					limit : zone.usernode.article.config.limit,
					success : function(res) {
						jQuery.each(res.data || [], function(i, val){
							// render item
							zone.usernode.article.Actions.renderArticleItem(val);
						});
					},
					container : zone.usernode.article.listArticleContainer
				});
			}
		},
		GUI : {
			showContainer : function() {
				zone.usernode.article.mainContainer.show();
				zone.usernode.article.listArticleContainer.show();
				$('#lnkToggleArticleForm').show();
				$('#sectionPostArticle').hide();
			},
			showDetailContainer : function() {
				zone.usernode.article.mainContainer.show();
				zone.usernode.article.detailContainer.show();
				$('#lnkToggleArticleForm').hide();
				$('#sectionPostArticle').hide();
				$('#container-articles').hide();
			}
		}
	};
})(jQuery, zone['usernode']);