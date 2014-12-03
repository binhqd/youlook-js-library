;(function($, scope){
	scope['follower'] = {
		mainContainer : null,
		followerContainer : null,
		config : {
			limit : 10
		},
		init : function() {
			this.mainContainer = $("#container-followers");
			this.followerContainer = this.mainContainer.find('ul.container-followers');
		},
		destroy : function() {
			$("ul.wd-type-view-all-follower").html('');
			zone.zonetype.follower.followerContainer.infinitescroll('destroy');
			zone.zonetype.follower.followerContainer.data('infinitescroll', null);
		},
		Pagination : {
			setup : function(pathPart, queryPart, pages, callback) {
				if (typeof pages == "undefined") {
					console.log("Invalid page number");
					pages = 1;
				}

				zone.zonetype.follower.followerContainer.infinitescroll({
					navSelector  : '#' + zone.zonetype.follower.mainContainer.attr('id') + ' .page-infinitive-nav',	// selector for the paged navigation
					nextSelector : '#' + zone.zonetype.follower.mainContainer.attr('id') + ' .page-infinitive-nav a',  // selector for the NEXT link (to page 2)
					//itemSelector : 'li.movie-photo-item',	 // selector for all items you'll retrieve
					//debug:true,
					dataType:'json',
					maxPage: pages,
					appendCallback:false,
					pixelsFromNavToBottom : $(document).height() - $('#' + zone.zonetype.follower.mainContainer.attr('id') + ' .page-infinitive-nav').offset().top - 120,
					path : [pathPart, queryPart],
					loading: {
						finishedMsg: 'No more pages to load.',
						img: homeURL+'/myzone_v1/img/front/ajax-loader.gif'
					}
				},function(res) {
						if (typeof callback != "function") {
							console.log("Invalid callback for infinite scroll");
						} else {
							callback(res);
						}
					}
				);
			}
		},
		Actions : {
			loadFollowers:function(pathPart) {
				zone.zonetype.follower.Event.showFollowersContainer();
				
				var cacheData = zone.zonetype.follower.mainContainer.data('followers');
				
				if (typeof cacheData == "undefined") {
					$.ajax({
						url: pathPart,
						type: 'POST',
						dataType : 'json',
						success: function(res){
							
							if (!res.error) {
								
								zone.zonetype.follower.Actions.renderFollowers(res);
								
								var pages = res.data.linkPager.pages.pageCount;
								
								zone.zonetype.follower.mainContainer.data('followers', res);
								
								zone.zonetype.follower.Pagination.setup(pathPart, pages, function(res) {
									var followers = $.tmpl($("#tmplFollowers"), res);
									
									$("ul.container-followers").append(followers);
									$.Friends.initLinks($('ul.container-followers').find(".js-friend-request"));
									$('.wd-tooltip-hover').tipsy({gravity: 's'});
								});
							} else {
								console.log(res.message);
							}
						}
					});
				} else {
					console.log('Load followers from cache');
					zone.zonetype.follower.Actions.renderFollowers(cacheData);
					
					var pages = Math.ceil(cacheData.total / zone.zonetype.follower.config.limit);
					
					zone.zonetype.follower.Pagination.setup(pathPart, pages, function(res) {
						var followers = $.tmpl($("#tmplFollowers"), res);
						
						$("ul.container-followers").append(followers);
						$.Friends.initLinks($('ul.container-followers').find(".js-friend-request"));
						$('.wd-tooltip-hover').tipsy({gravity: 's'});
					});
				}
			},
			renderFollowers : function(res) {
				
				var followers = $.tmpl($("#tmplFollowers"), res.data);
				
				$("ul.container-followers").append(followers);
				$.Friends.initLinks($('ul.container-followers').find(".js-friend-request"));
				
				zone.movieState.loadingDiv.hide();
				$('.view-page-followers').removeClass('disable-link');
				$('.wd-tooltip-hover').tipsy({gravity: 's'});
				
			}
		},
		Event : {
			showFollowersContainer : function() {
				zone.zonetype.follower.mainContainer.show();
			}
		}
	};
})(jQuery, zone['zonetype']);