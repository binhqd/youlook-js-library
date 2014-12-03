/**/
// Override config
zone.zonetype.config = $.extend({}, zone.zonetype.config, {
	homeURI : 'itv'
});

// Class
;(function($, scope){
	scope['itv'] = {
		data : {
			
		},
		init : function() {
			// render movies
			//this.Actions.renderMovies(this.data.movies, true);
		},
		Actions : {
			renderMovies : function(movies, preload) {
				//console.log(movies);
				// console.log(zone.tempCategories.data.cast);
				if (typeof movies !="undefined") {
					try {
						var data = [];
						
						if (typeof preload != 'undefined' && preload) {
							for (i=0; i<4; i++) {
								data[i] = movies[i];
								data[i]['lazy'] = false;
							}
						} else {
							if (movies.length > 4)
								for (i=4; i < movies.length; i++) {
									data[i-4] = movies[i];
									data[i-4]['lazy'] = false;
								}
						}
						
						var movies = $.tmpl($('#tmplMovies'), data);
						$("#containerMovies").append(movies);
					} catch(e){
						console.log(e.message);
					}
					
				}
			}
		}
	};
})(jQuery, zone['zonetype']);

$(document).ready(function() {
	zone.zonetype.itv.init();
});