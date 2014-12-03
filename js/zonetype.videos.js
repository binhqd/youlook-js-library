;(function($, scope){
	scope['video'] = {
		mainContainer : null,
		videoContainer : null,
		config : {
			limit : 10,
			videoDescriptionReadmore : {
				readMoreText	: 'Read more',
				readLessText	: 'Read less',
				numberOfWord	: 220,
				readLess		: false,
				readMore		: false
			}
		},
		init : function() {
			this.mainContainer = $("#container-videos");
			this.videoContainer = this.mainContainer.find('ul.container-videos');
		},
		destroy : function() {
			$("ul.wd-type-view-all-video").html('');
			zone.zonetype.video.videoContainer.infinitescroll('destroy');
			zone.zonetype.video.videoContainer.data('infinitescroll', null);
		},
		Pagination : {
			setup : function(pathPart, queryPart, pages, callback) {
				if (typeof pages == "undefined") {
					console.log("Invalid page number");
					pages = 1;
				}

				zone.zonetype.video.videoContainer.infinitescroll({
					navSelector  : '#' + zone.zonetype.video.mainContainer.attr('id') + ' .page-infinitive-nav',	// selector for the paged navigation
					nextSelector : '#' + zone.zonetype.video.mainContainer.attr('id') + ' .page-infinitive-nav a',  // selector for the NEXT link (to page 2)
					//itemSelector : 'li.movie-photo-item',	 // selector for all items you'll retrieve
					//debug:true,
					dataType:'json',
					maxPage: pages,
					appendCallback:false,
					pixelsFromNavToBottom : $(document).height() - $('#' + zone.zonetype.video.mainContainer.attr('id') + ' .page-infinitive-nav').offset().top - 120,
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
			loadVideos:function(pathPart, queryPart, type) {
				
				zone.zonetype.video.Event.showVideosContainer();
				
				var cacheData = zone.zonetype.video.mainContainer.data('videos-' + type);

				if (typeof cacheData == "undefined") {
					$.ajax({
						url: pathPart + '1' + queryPart,
						type: 'GET',
						dataType : 'json',
						success: function(res){
							
							if (!res.error) {
								if(res.total==0){
									$('#youlook-no-video').show();
								} else{
									$('#youlook-no-video').hide();
								}
								zone.zonetype.video.Actions.renderVideos(res);
								
								var pages = Math.ceil(res.total / zone.zonetype.video.config.limit);
								
								zone.zonetype.video.mainContainer.data('videos-' + type, res);
								
								zone.zonetype.video.Pagination.setup(pathPart, queryPart, pages, function(res) {
									var topvideos = $.tmpl($("#tmplMovieTopVideos"), res);
									var videos = $.tmpl($("#tmplMovieVideos"), res);
									
									topvideos.find('.wd-description').greennetReplaceLink();
									topvideos.find('.wd-description').greennetExpand(zone.zonetype.video.config.videoDescriptionReadmore);
									topvideos.find("abbr.timeago").timeago();
									
									videos.find('.wd-description').greennetReplaceLink();
									videos.find('.wd-description').greennetExpand(zone.zonetype.video.config.videoDescriptionReadmore);
									videos.find("abbr.timeago").timeago();
									
									$("ul.container-top-videos").append(topvideos);
									$("ul.container-videos").append(videos);
									$('.wd-tooltip-hover').tipsy({gravity: 's'});
								});
							} else {
								console.log(res.message);
							}
						}
					});
				} else {
					console.log('Load videos from cache');
					zone.zonetype.video.Actions.renderVideos(cacheData);
					
					var pages = Math.ceil(cacheData.total / zone.zonetype.video.config.limit);
					
					zone.zonetype.video.Pagination.setup(pathPart, queryPart, pages, function(res) {
						var topvideos = $.tmpl($("#tmplMovieTopVideos"), res);
						var videos = $.tmpl($("#tmplMovieVideos"), res);
						
						topvideos.find('.wd-description').greennetReplaceLink();
						topvideos.find('.wd-description').greennetExpand(zone.zonetype.video.config.videoDescriptionReadmore);
						topvideos.find("abbr.timeago").timeago();

						videos.find('.wd-description').greennetReplaceLink();
						videos.find('.wd-description').greennetExpand(zone.zonetype.video.config.videoDescriptionReadmore);
						videos.find("abbr.timeago").timeago();
						
						
						$("ul.container-top-videos").append(topvideos);
						$("ul.container-videos").append(videos);
						$('.wd-tooltip-hover').tipsy({gravity: 's'});
					});
				}
			},
			renderVideos : function(res) {
				//zone.movieState.data.videos = res.videos;
				
				var topvideos = $.tmpl($("#tmplMovieTopVideos"), res);
				var videos = $.tmpl($("#tmplMovieVideos"), res);
				
				videos.find('.wd-description').greennetReplaceLink();
				videos.find('.wd-description').greennetExpand(zone.zonetype.video.config.videoDescriptionReadmore);
				videos.find("abbr.timeago").timeago();
				
				topvideos.find('.wd-description').greennetReplaceLink();
				topvideos.find('.wd-description').greennetExpand(zone.zonetype.video.config.videoDescriptionReadmore);
				topvideos.find("abbr.timeago").timeago();
				
				if(topvideos.hasClass('youlook-video-item')){
					$("ul.container-top-videos").show();
				}
				$("ul.container-top-videos").append(topvideos);
				$("ul.container-videos").append(videos);

				zone.movieState.loadingDiv.hide();
				$('.view-page-videos').removeClass('disable-link');
				$('.wd-tooltip-hover').tipsy({gravity: 's'});
				
			}
		},
		Event : {
			showVideosContainer : function() {
				zone.zonetype.video.mainContainer.show();
			}
		}
	};
})(jQuery, zone['zonetype']);