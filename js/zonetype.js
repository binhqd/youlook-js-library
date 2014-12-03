var paramsCategories = "";
var loadFirstNode = true;

;(function($, scope){
	scope['zonetype'] = {
		isPopState : false,
		config : {
			'root' : 'root'
		},
		init : function(zoneid) {
			this.zoneid = zoneid;
		},
		History : {
			pushState : function(url) {
				if (!zone.zonetype.isPopState) {
					isHistory = typeof isHistory !== 'undefined' ? isHistory : 1;
					
					if (isHistory) {
						if(history.pushState!==undefined){
							history.pushState( null, null , url);
						}
					}
				}
			}
		},
		// Variables
		zoneid : null,
		GUI : {
			showContainer:function(){
				zone.zonetype.activity.mainContainer.fadeIn(500);
				zone.zonetype.activity.listActivityContainer.show();
			},
			cleanup : function() {
				// hide all
				$('.list-container, .page-container').hide();
				$('.js-loadmore-button').css({'display':'none'});
				$('.js-loadmore-button').removeAttr('album_id');
				
				$("#photo-not-found").hide();
				
				var lists = $('.list-container');
				lists.html('');
				lists.infinitescroll('destroy');
				lists.data('infinitescroll', null);
			}
		}
	};
})(jQuery, zone);

$(document).ready(function() {
	zone.movieState.init();
});

;(function($, scope){
	scope['movieState'] = {
		name: "movie",
		paramsPageAlbum:null,
		albumUrl:null,
		loadingDiv : $('#content-loading'),
		init : function(){
			zone.movieState.objHtml.main = $("#movie-container-main");
		},
		Actions:{
			main:function(url,isHistory){
				isHistory = typeof isHistory !== 'undefined' ? isHistory : 1;
				zone.movieState.Event.showMainContainer();
				if(isHistory) history.pushState( null, null , url);
			}
		},
		Event:{
			showMainContainer:function(){
				zone.movieState.objHtml.main.fadeIn(500);
			},
			unveil:function(){
				try{
					checkLazyLoadImage();
				}catch(e){
					console.log(e.message);
				}
			}
		},
		data:{
			page: 1,
			pageAlbum: 1,
			limit: 15,
			totalPagePhoto: 1,
			totalPageAlbum: 1,
			photo:[],
			checkLoad: false
		},
		objHtml:{
			photos:null,
			main:null
		}

	}
})(jQuery, zone);