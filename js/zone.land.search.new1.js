var gutter = 61;
var optionMasonry = {
	gutter: gutter,
	columnWidth:1,
	isFitWidth: true,
	isOriginLeft:true,
	stamp: ".stamp",
	isResizeBound:true,
	isAnimated: false,
	itemSelector: '.wd-streamstory-viewall-action-composer'
};

function calScreen(){
	if (($(window).width() > 1599)) {
		optionMasonry.gutter = 32;
		console.log("a"+optionMasonry.gutter)
		
	}else if ($(window).width() > 1439 && $(window).width() < 1600  ){
		optionMasonry.gutter = 32;
		
		// console.log("b"+optionMasonry.gutter)
	}
	else if ($(window).width() > 1359 && $(window).width() < 1440  ){
		optionMasonry.gutter = 20;
		// $(".wd-item-large").css({width:'422px'});
		// $(".wd-person-img .wd-main-image ").css({width:'200px'});
		// $(".wd-gallery-1 li").css({width:'94px'});
		// $(".wd-gallery-1 .wd-mlb-img, .wd-gallery-1 .wd-ml-img").css({marginLeft:'17px'});
		// console.log("c"+optionMasonry.gutter)
	}
	else if ($(window).width() > 1279 && $(window).width() < 1360  ){
		optionMasonry.gutter = 30;
		
		// console.log("cc"+optionMasonry.gutter)
	}else if ($(window).width() > 1023 && $(window).width() < 1280  ){
		optionMasonry.gutter = 40;
		console.log("d"+optionMasonry.gutter)
	}
	else if ($(window).width() > 767 && $(window).width() < 1024  ){
		optionMasonry.gutter = 29;
		$(".wd-item-large").css({width:'432px'});
		$(".wd-person-img .wd-main-image ").css({width:'210px'});
		$(".wd-gallery-1 li").css({width:'99px'});
		
		// $(".wd-item-easy").css({width:'199px'});
		console.log("e"+optionMasonry.gutter)
	}
	
	
}
function sortStamp(){
	var tHeight = 0;
	var tmpStamp = 0;
	$.each($('.wd-item-large'),function(x,y){
		if(x == 0){
			
			$(y).css({'top':'0px'});
			tHeight = parseInt($(y).height())+parseInt(40);
		}else{
			$(y).css({'top':tHeight+'px'});
			tHeight = parseInt(tHeight) + parseInt($(y).height())+parseInt(40);
		}
		tmpStamp ++;
	});
}

function initMasonry(){
	calScreen();
	$.each($('.itemAppend .wd-streamstory-viewall-action-composer'),function(key,value){
		var _this = $(this);
		$(this).imagesLoaded(function(){
			
			_this.animate({ opacity: 1 },800);
			$container.masonry(optionMasonry);
			
		});
	});
}
$().ready(function(e){
	setInterval(function(){
		sortStamp();
	},1000);
	initMasonry();
	$(document).ajaxComplete(function() {
		
	});
	

	$container.infinitescroll({
			navSelector  : '#page-nav ',    // selector for the paged navigation 
			nextSelector : '#page-nav a',  // selector for the NEXT link (to page 2)
			itemSelector : '.wd-streamstory-viewall-action-composer',     // selector for all items you'll retrieve
			animate      :false,
			pixelsFromNavToBottom:10,
			maxPage:100,
			bufferPx:'300',
			loading: {
				finishedMsg: 'No more pages to load.',
				img: homeURL+'/myzone_v1/img/front/ajax-loader.gif'
			}
		},
		// trigger Masonry as a callback
		function( newElements ) {
			calScreen();
			$container.infinitescroll('pause');

			page++;
			// hide new items while they are loading
			var $newElems = $( newElements ).css({opacity:0});
			var tmpCnt = 1;
			
			$.each($( newElements ),function(key,value){
				// ensure that images load before adding to masonry layout
				var _this = $(this);
				// _this.css({opacity:0});
				$(this).imagesLoaded(function(){
					
					// _this.animate({opaticy:1},700);
					$container.masonry( 'appended', _this ,true ); 
					
					// $container.masonry( 'stamp', $(value) )
				});
				try {
					$.Followings.initLinks($(this).find(".js-following-request"));
				} catch (ex) {}
				tmpCnt++;
				/*Tooltip*/
				$('.wd-tooltip-hover').tipsy({gravity: 's'});/*VuNDH add code*/
			});
			$container.infinitescroll('resume');
		}
	);
});
