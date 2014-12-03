
var masonry = null;
var load = true;

var gutter = 61;

var optionMasonry = {
	gutter: gutter,
	columnWidth:1,
	isFitWidth: true,
	isOriginLeft:true,
	stamp: ".stamp",
	isResizeBound:true,
	itemSelector: '.wd-streamstory-viewall-action-composer'
};

function calScreen(){
	if (($(window).width() > 1599)) {
		optionMasonry.gutter = 32;
		// console.log("a"+optionMasonry.gutter)
		
	}else if ($(window).width() > 1439 && $(window).width() < 1600  ){
		optionMasonry.gutter = 12;
		$(".wd-item-large").css({width:'405px'});
		$(".wd-item-easy").css({width:'182px'});
		$(".wd-person-img .wd-main-image ").css({width:'190px'});
		$(".wd-gallery-1 li").css({width:'88px'});
		$(".wd-gallery-1 .wd-mlb-img, .wd-gallery-1 .wd-ml-img").css({marginLeft:'17px'});
		$(".wd-item-easy ul.wd-statuscontent-left li").css({marginRight:'18px'});
		// console.log("b"+optionMasonry.gutter)
	}
	else if ($(window).width() > 1359 && $(window).width() < 1440  ){
		optionMasonry.gutter = 10;
		$(".wd-item-large").css({width:'422px'});
		$(".wd-person-img .wd-main-image ").css({width:'200px'});
		$(".wd-gallery-1 li").css({width:'94px'});
		$(".wd-gallery-1 .wd-mlb-img, .wd-gallery-1 .wd-ml-img").css({marginLeft:'17px'});
		console.log("c"+optionMasonry.gutter)
	}
	else if ($(window).width() > 1279 && $(window).width() < 1360  ){
		optionMasonry.gutter = 65;
		
		console.log("cc"+optionMasonry.gutter)
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
function initMasonry(){
	calScreen();
	$('.wd-pagelet-list-celebrities img').imagesLoaded(function(){
		// masonry = $('.wd-view-all-list-celebrities').masonry(optionMasonry);
		masonry = new Masonry( container, optionMasonry);
		$('.wd-view-all-list-celebrities').delay(500).animate({
			opacity: '1'
		});
		sortStamp(false);
	});
}
function sortStamp(runMasonry){
	calScreen();
	var tHeight = 0;
	$.each($('.wd-item-large'),function(x,y){
		if(x == 0){
			
			$(y).css({'top':'0px'});
			tHeight = parseInt($(y).height())+parseInt(40);
		}else{
			$(y).css({'top':tHeight+'px'});
			tHeight = parseInt(tHeight) + parseInt($(y).height())+parseInt(40);
		}
	});
	if(runMasonry) masonry = new Masonry( container, optionMasonry);
}
$().ready(function(e){
	setInterval(function(){
		sortStamp(true);
	},1000);
	
	initMasonry();	
	
	$(window).resize(function() {
		
		initMasonry();
		
	});
	
});
