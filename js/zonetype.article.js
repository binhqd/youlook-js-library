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
		destroy : function() {
			zone.zonetype.article.listArticleContainer.html('');
			//zone.zonetype.article.listArticleContainer.infinitescroll('destroy');
			//zone.zonetype.article.listArticleContainer.data('infinitescroll', null);
		},
		Actions : {
			loadArticleDetail : function(id) {
				var url = homeURL + '/api/article/detail?article_id=' + id;
				$('#article-loading').html('').append(zone.movieState.loadingDiv.show());
				
				$.ajax({
					url : url,
					dataType: 'json',
					success : function(res) {
						if (!res.error) {
							
							// render article detail
							var article = $.tmpl($("#tmplArticleDetail"), res.data.article);
							//article.find('.article-description').greennetReplaceLink();
							article.find(".timeago").timeago();
							
							zone.like.setup(article.find('.object-like'), {
								object_id : res.data.article.id,
								action : homeURL + '/article/like',
								actionLike : homeURL + '/article/like',
								actionUnlike : homeURL + '/article/unlike',
								text : res.data.article.like.text,
								liked : res.data.article.like.liked
							});
							
							// append to container
							zone.zonetype.article.detailContainer.html('').append(article);
							
							zone.comment.setup(article.find('.object-comment'), {
								formTemplateID	: 'tmplCommentForm',								// jQuery template ID for the form
								itemTemplateID	: 'tmplCommentItem', 								// jQuery template ID for comment item
								object_id : res.data.article.id,											// object_id
								listComments : '.list-comments',									// selector for object that contains comments
								direction : 'downsideup',											// direction of list of comments
								comments : res.data.article.comments,									// init comments
								total : res.data.article.comments_count,									// total comments
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
										return " <span class=\"wd-comment-bt\"></span><span class=\"wd-number\">"+total+"</span> <span>"+((total == 1) ? "Comment" : "Comments")+"</span>";
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
			renderArticleItem : function(res,isAppend) {
				return zone.List.renderItem(res, {
					templateID : 'tmplArticleItem',
					callback : function(article) {
						
						// push state
						//var article = $.tmpl($("#tmplArticleItem"), res);
						article.find('.article-description').greennetReplaceLink();
						article.find('.article-description').greennetExpand({
							readMoreText	: 'Read more',
							readLessText	: 'Read less',
							numberOfWord	: 220,
							readLess		: false,
							readMore		: false
						});

						if(typeof isAppend == "undefined" || isAppend) {
							zone.zonetype.article.listArticleContainer.append(article);
						}else {
							zone.zonetype.article.listArticleContainer.prepend(article);
						}
						zone.like.setup(article.find('.object-like'), {
							object_id : res.id,
							action : homeURL + '/article/like',
							actionLike : homeURL + '/article/like',
							actionUnlike : homeURL + '/article/unlike',
							text : res.like.text,
							liked : res.like.liked
						});
						
						zone.comment.setup(article.find('.object-comment'), {
							formTemplateID	: 'tmplCommentForm',								// jQuery template ID for the form
							itemTemplateID	: 'tmplCommentItem', 								// jQuery template ID for comment item
							object_id : res.id,											// object_id
							listComments : '.list-comments',									// selector for object that contains comments
							direction : 'upsidedown',											// direction of list of comments
							comments : res.comments,									// init comments
							total : res.comments_count,									// total comments
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
							$("html, body").animate({ scrollTop:"330px" },1000);
							
							var id = $(this).attr('ref');
							var href= $(this).attr('href');
							
							zone.zonetype.article.detailContainer.html('');
							zone.zonetype.article.Actions.showDetailContainer();
							zone.zonetype.article.Actions.loadArticleDetail(id);
							zone.zonetype.History.pushState(href);
							return false;
						});
					}
				});
			},
			loadArticles : function(pathPart, queryPart) {
				zone.zonetype.article.destroy();
				
				var cacheData = zone.zonetype.article.mainContainer.data('articles');
				
				if (typeof cacheData == "undefined") {
					$.ajax({
						url: pathPart + '1' + queryPart,
						type: 'GET',
						dataType : 'json',
						success: function(res) {
							if (!res.error) {
								zone.zonetype.article.listArticleContainer.html("");
								jQuery.each(res.data || [], function(i, val){
									zone.zonetype.article.Actions.renderArticleItem(val);
								});
							} else {
								console.log(res.message);
							}
							
							zone.movieState.loadingDiv.hide();
	//						$('.view-page-videos').removeClass('disable-link');
						}
					});
				} else {
					console.log('Load articles from cache');
					zone.zonetype.article.Actions.renderArticles(cacheData);
					zone.movieState.loadingDiv.hide();
				}
			},
			showContainer:function(){
				$('.page-container').hide();
				zone.zonetype.article.mainContainer.fadeIn(500);
			},
			showDetailContainer:function(){
				$('.page-container').hide();
				zone.zonetype.article.detailContainer.fadeIn(500);
			}
		}
	};
})(jQuery, zone['zonetype']);