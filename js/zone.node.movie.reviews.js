var loadFirstNode = true;
$(document).ready(function(){
	zone.node.movie.reviews.init();
	zone.node.movie.form.init();
	$('.js-view-movie-reviews').on('click',function(){
		$url = $(this).attr('href');
		$('html,body').animate({scrollTop:"370px"},1000);
		zone.node.movie.reviews.data.page = 1;
		zone.node.movie.reviews.Actions.loadReviews($url);
		return false;
	});

	$('.js-write-review').on('click',function(){
		$('.js-review-inputbox').toggle();
	});

	$('#doneReview').on('click',function(){
		var frmReview = $('#frm_Review');
		zone.node.movie.form.Action.submit(frmReview);
		return false;
	});

	$(window).bind("load",function(){
		// back button in browser
		var returnLocation = history.location || document.location;
		if (returnLocation.href.indexOf('zone/movie') == -1) {
			// window.location.href = returnLocation.href;
			console.log('Url not found');
		} else{
			if(returnLocation.href.indexOf('tab=reviews') > 0 ){
				$(".js-view-movie-reviews").trigger('click');
				return false;
			}
		}
	});
});
;(function($, scope) {
	scope['node'] = {
		movie: {
			reviews : {
				init: function() {
					
				},
				Actions:{
					main: function(url,isHistory){
						isHistory = typeof isHistory == 'undefinded' ? isHistory : 1;
						if(isHistory)	history.pushState(null,null,url);
					},
					loadReviews: function(url,isHistory){
						console.log('Load reviews');
						zone.node.movie.reviews.Event.showReviewsContainer();
						isHistory = typeof isHistory == 'undefinded' ? isHistory : 1;
						if(isHistory)	history.pushState(null,null,url);
						$('ul.js-list-review').html('');
						var limit = zone.node.movie.reviews.data.limit;
						var page = zone.node.movie.reviews.data.page;
						$.ajax({
							url: homeURL + '/api/review/index?id='+zoneid+'&limit='+limit+'&page='+page,
							type:'GET',
							success: function(res) {
								console.log(res);
								$('#infscr-loading-first-review').hide();
								if((res.total > zone.node.movie.reviews.data.limit) && (res.total % res.limit > 0))
									zone.node.movie.reviews.data.totalPage =  Math.round(res.total / res.limit,-1) + 1;
								else
									zone.node.movie.reviews.data.totalPage = Math.round(res.total / res.limit);
								console.log('total: '+ zone.node.movie.reviews.data.totalPage);
								var review = $.tmpl($('#tmplReview'),res);
								review.find('.timeago').timeago();
								$('ul.js-list-review').append(review);
								zone.node.movie.reviews.Actions.loadMoreReviews();
							}
						});
					},
					loadMoreReviews: function() {
						var $container = $('ul.js-list-review');
						console.log('load more');
						$container.infinitescroll({
							navSelector  : '#movie-review-page-nav',	// selector for the paged navigation
							nextSelector : '#movie-review-page-nav a',  // selector for the NEXT link (to page 2)
							itemSelector : 'li.movie-review-item',	 // selector for all items you'll retrieve
							debug:true,
							dataType	:'json',
							maxPage		:zone.node.movie.reviews.data.totalPage,
							appendCallback:false,
							state: {
								isDuringAjax: false,
								isInvalidPage: false,
								isDestroyed: false,
								isDone: false,
								isPaused: false,
								currPage: 1
							},
							extraScrollPx: 4500,
								loading: {
									finishedMsg: "No more pages to load.<script type='text/javascript'> $('#infscr-loading-first').hide(); </script>",
									img: homeURL+'/myzone_v1/img/front/ajax-loader.gif'
								}
							},function( newElements ) {
								console.log(newElements);
								var review = $.tmpl($('#tmplReview'),newElements);
								review.find('.timeago').timeago();
								$('ul.js-list-review').append(review);
							}
						);
					}
				},
				Event: {
					showReviewsContainer:function(){
						zone.node.movie.reviews.objHtml.reviews.fadeIn(500);
						zone.node.movie.reviews.objHtml.main.hide();
						zone.node.movie.reviews.objHtml.photos.hide();
						zone.node.movie.reviews.objHtml.videos.hide();
					}
				},
				data: {
					page: 1,
					limit:6,
					totalPage:1
				},
				objHtml: {
					main: $("#movie-container-main"),
					photos: $("#movie-container-photos"),
					videos : $("#container-videos"),
					reviews: $("#movie-container-reviews")
				}
			},
			form: {
				init: function() {
					$('#area-title , #area-content').on('keyup',function(e){
						validate = zone.node.movie.form.Action.validate();
						if(validate) {
							$("#doneReview").removeAttr("disabled");
							if(e.keyCode == 13) {
								$('#doneReview').trigger('click');
							}
						}
						else 
							$("#doneReview").attr("disabled","disabled");
					});
				},
				Action : {
					submit : function(frmReview) {
						$.ajax({
							type : 'POST',
							url : homeURL + frmReview.attr('action'),
							data : frmReview.serialize(),
							success : function(res) {
								//console.log(res);
								zone.node.movie.form.Action.done(res);
								zone.node.movie.reviews.Actions.loadMoreReviews();
							}
						});
					},
					done : function(data) {
						var review = $.tmpl($('#tmplReview'),data);
						review.find('.timeago').timeago();
						$('ul.js-list-review').prepend(review);
						$('#area-title').val('');
						$('#area-content').val('');
						$("#doneReview").attr("disabled","disabled");
					},
					validate: function() {
						var title = $('#area-title').val();
						var content = $('#area-content').val();
						if($.trim(title) == "" || $.trim(content)== "" ){
							return false;
						}
						return true;
					}
				},
				Event : {
					
				}
			}
		}
	};
})(jQuery, zone);