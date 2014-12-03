function calHeightItemCast() {
	var heightItemCast = [];
	$.each($("#oCast li"), function(x, y) {
		heightItemCast.push($(y).height())
	});
	if (heightItemCast.length == 0)
		return "auto";
	else
		return Array.max(heightItemCast);
}
function sliderRelated() {
	if ($('.wd-node-categories-related').children("li").length > 4) {
		$('.wd-node-categories-related').carouFredSel({
			auto: {
				play: false,
				delay: 7000
			},
			width: '140',
			height: calHeightItemCast(),
			scroll: 1,
			prev: '#wd-prev-type-related',
			next: '#wd-next-type-related',
			pagination: false,
			mousewheel: true,
			items: {
				height: 'auto',
				visible: {
					min: 2,
					max: 10
				}
			},
			swipe: {
				onMouse: true,
				onTouch: true
			}
		});
	}
}

// Function to get the Maximam value in Array
Array.max = function(array) {
	return Math.max.apply(Math, array);
};

// Function to get the Minimam value in Array
Array.min = function(array) {
	return Math.min.apply(Math, array);
};

(function($, scope) {
	scope['tempCategories'] = {
		name: "movie",
		init: function() {
			zone.tempCategories.obj.cast = $("#" + zone.tempCategories.template[zone.tempCategories.name].cast.o);
			$('.js-movie-home-link').click(function() {
				var url = $(this).attr('href');
				isHistory = typeof isHistory !== 'undefined' ? isHistory : 1;
				$('.page-container').css('display', 'none');
				zone.movieState.Event.showMainContainer();
				if (isHistory)
					history.pushState(null, null, url);
				zone.tempCategories.Actions.getActivities(zoneid);
				return false;
			});
		},
		Actions: {
			getRelateds: function(zoneid) {
				$.get(homeURL + "/api/search/related", {
					type: "detail",
					id: zoneid
				}, function(data) {
					if (typeof data == "string") {
						data = $.parseJSON(data);
					}
					zone.tempCategories.data.related = data.relateds;
					zone.tempCategories.Actions.renderRelated();
					zone.tempCategories.Actions.renderYouMayAlsoLike();
					sliderRelated();
					/*Tooltip*/
					$('.wd-tooltip-hover').tipsy({gravity: 's'});
					checkLazyLoadImage();
				}).fail(function(xhr, ajaxOptions, thrownError) {
					console.log(xhr.responseText);
				}, "json");
			},
			getActivities: function(zoneid) {
				$('#js-loading-homepage').fadeIn();
				$.ajax({
					type: 'get',
					dataType: 'html',
					url: homeURL + '/' + zone.zonetype.config.homeURI + '/activities?zone_id=' + zoneid + '&timestamp=' + (new Date().getTime()),
					success: function(response) {
						$('#js-loading-homepage').fadeOut();
						zone.tempCategories.Actions.renderActivities(response);
					}
				});
			},
			getUserActivities: function(uid) {
				$('#js-loading-homepage').fadeIn();
				$.ajax({
					type: 'get',
					dataType: 'html',
					url: homeURL + '/activities/default?uid=' + uid + '&timestamp=' + (new Date().getTime()),
					success: function(response) {
						$('#js-loading-homepage').fadeOut();
						zone.tempCategories.Actions.renderActivities(response);
					}
				});
			},
			renderActivities: function(response) {
				$('#articleSelector').hide().html(response).fadeIn();
				try {
					zone.articles.initLinks($('#articleSelector').find(".js-article-delete"));
				} catch (e) {
				}
			},
			renderOwner: function() {
				// console.log(zone.tempCategories.data.owner);
				/** render owner **/
				if (typeof zone.tempCategories.data.owner != "undefined") {
					zone.tempCategories.data.owner.avatar = zone.tempCategories.data.owner.avatar.replace("193-193", "44-44");
					var owner = $.tmpl($(zone.tempCategories.template[zone.tempCategories.name].owner.t), zone.tempCategories.data.owner);
					$("#" + zone.tempCategories.template[zone.tempCategories.name].owner.o).html(owner);
				}
			},
			renderInfo: function() {
				// console.log(zone.tempCategories.data.info);
				if (typeof zone.tempCategories.data.info != "undefined") {
					var info = $.tmpl($(zone.tempCategories.template[zone.tempCategories.name].info.t), zone.tempCategories.data.info);
					$("#" + zone.tempCategories.template[zone.tempCategories.name].info.o).html(info);


					var info = $.tmpl($(zone.tempCategories.template[zone.tempCategories.name].image.t), zone.tempCategories.data.info);
					$("#" + zone.tempCategories.template[zone.tempCategories.name].image.o).html(info);
				}
			},
			renderCast: function(preload) {
				// console.log(zone.tempCategories.data.cast);
				if(!zone.tempCategories.data.cast.length){
					$('.youlook-cast').hide();
				}
				
				if (typeof zone.tempCategories.data.cast != "undefined") {
						var data = [], idx = Math.min(4, zone.tempCategories.data.cast.length);
						if (typeof preload != 'undefined') {
							for (i = 0; i < idx; i++) {
								data[i] = zone.tempCategories.data.cast[i];
								data[i]['lazy'] = false;
							}
						} else {
							if (zone.tempCategories.data.cast.length > 4)
								for (i = 4; i < zone.tempCategories.data.cast.length; i++) {
									data[i - 4] = zone.tempCategories.data.cast[i];
									data[i - 4]['lazy'] = false;
								}
						}
						var cast = $.tmpl($(zone.tempCategories.template[zone.tempCategories.name].cast.t), data);
						$("#" + zone.tempCategories.template[zone.tempCategories.name].cast.o).append(cast);
				}
			},
			renderTopPhotos: function() {
				// console.log(zone.tempCategories.data.cast);
				if (typeof zone.tempCategories.data.topPhotos != "undefined") {
					var topPhotos = $.tmpl($(zone.tempCategories.template[zone.tempCategories.name].topPhotos.t), zone.tempCategories.data.topPhotos);
					$("#" + zone.tempCategories.template[zone.tempCategories.name].topPhotos.o).html(topPhotos);
				}
			},
			renderTopReviews: function() {
				// console.log(zone.tempCategories.data.cast);
				if (typeof zone.tempCategories.data.topPhotos != "undefined") {
					var topReviews = $.tmpl($(zone.tempCategories.template[zone.tempCategories.name].topReviews.t), zone.tempCategories.data.topReviews);
					$("#" + zone.tempCategories.template[zone.tempCategories.name].topReviews.o).html(topReviews);
				}
			},
			renderRelated: function() {
				
				if (typeof zone.tempCategories.data.related != "undefined") {
					var related = $.tmpl($(zone.tempCategories.template[zone.tempCategories.name].related.t), zone.tempCategories.data.related);
					$("#" + zone.tempCategories.template[zone.tempCategories.name].related.o).html(related);
					try {
						checkLazyLoadImage();
					} catch (e) {
						console.log(e.message);
					}

				}
			},
			renderYouMayAlsoLike: function() {
				
				if (typeof zone.tempCategories.data.related != "undefined") {
					var _tmpData = [];
					var i = 0;
					$.each(zone.tempCategories.data.related, function(x, y) {
						if (i > 5)
							return false;

						if (y.avatar != null) {
							zone.tempCategories.data.related[x].avatar = y.avatar.replace("140-140", "96-144");
						}
						var str_directed_by = "";
						if (typeof y['/film/film/directed_by'] != "undefined" && typeof y['/film/film/directed_by']['items'] != "undefined") {
							var total = y['/film/film/directed_by']['items'].length;
							$.each(y['/film/film/directed_by']['items'], function(x, y) {
								str_directed_by += y['name'];
								if ((total - 1) != x)
									str_directed_by += ", ";
							});
						}
						y['directed_by'] = str_directed_by;

						var str_genre = "";
						if (typeof y['/film/film/genre'] != "undefined" && typeof y['/film/film/genre']['items'] != "undefined") {
							var totalgenre = y['/film/film/genre']['items'].length;

							$.each(y['/film/film/genre']['items'], function(x, y) {

								str_genre += y['name'];
								if ((totalgenre - 1) != x)
									str_genre += " | ";
							});
						}
						y['genre'] = str_genre;

						var str_stars = "";
						if (typeof y['/film/film/stars'] != "undefined" && typeof y['/film/film/stars']['items'] != "undefined") {
							var totalstars = y['/film/film/stars']['items'].length;
							$.each(y['/film/film/stars']['items'], function(x, y) {
								str_stars += y['name'];
								if ((totalstars - 1) != x)
									str_stars += ", ";
							});
						}
						y['stars'] = str_stars;

						_tmpData.push(y);
						i++;
					});

					var related = $.tmpl($(zone.tempCategories.template[zone.tempCategories.name].youmayalsolike.t), _tmpData);
					$("#" + zone.tempCategories.template[zone.tempCategories.name].youmayalsolike.o).html(related);
					try {
						checkLazyLoadImage();
					} catch (e) {
						console.log(e.message);
					}

				}
			},
			renderTrailer: function() {
				// console.log(zone.tempCategories.data.cast);
				if (typeof zone.tempCategories.data.trailers != "undefined") {
					var trailers = $.tmpl($(zone.tempCategories.template[zone.tempCategories.name].trailer.t), zone.tempCategories.data.trailers);
					$("#" + zone.tempCategories.template[zone.tempCategories.name].trailer.o).html(trailers);

				}
			},
			renderVideos: function() {

				if (typeof zone.tempCategories.data.videos != "undefined") {
					var videos = $.tmpl($(zone.tempCategories.template[zone.tempCategories.name].videos.t), zone.tempCategories.data.videos);
					$("#" + zone.tempCategories.template[zone.tempCategories.name].videos.o).html(videos);

				}
			}
		},
		Event: {
		},
		data: [],
		obj: {
			cast: null,
			related: null
		},
		zoneId: null,
		template: {
			movie: {
				owner: {t: "#tmplOwner", o: "oOwner"},
				info: {t: "#tmplInfo", o: "oInfo"},
				cast: {t: "#tmplCast", o: "oCast"},
				image: {t: "#tmplImage", o: "oImage"},
				topPhotos: {t: "#tmplTopPhotos", o: "oTopPhotos"},
				topReviews: {t: "#tmplTopReviews", o: "oTopReviews"},
				related: {t: "#tmplRelated", o: "oRelated"},
				youmayalsolike: {t: "#tmplyoumayalsolike", o: "oyoumayalsolike"},
				trailer: {t: "#tmplTrailer", o: "oTrailer"},
				videos: {t: "#tmplVideo", o: "oVideo"}
			}
		}
	}
})(jQuery, zone);