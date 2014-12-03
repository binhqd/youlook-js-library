var pullNodeGallery = [];
var autoRun = true;
var widthScreen =$(window).width();

;(function($, scope){
	scope['GalleryLandingPage'] = {
		init : function(){
			try{
				zone.CommonHtml.objHtml.dataCarouFredSel.prev  ='#wd-prev-people';
				zone.CommonHtml.objHtml.dataCarouFredSel.next  = '#wd-next-people';
				if (widthScreen > 1155){
					zone.CommonHtml.objHtml.dataCarouFredSel.items = {width:230,visible: {min: 4,	max: 5}};
				}else{
					zone.CommonHtml.objHtml.dataCarouFredSel.items = {width:230,visible: {min: 3,	max: 4}};
				}
				$('#containerGallery').carouFredSel(zone.CommonHtml.objHtml.dataCarouFredSel,{debug:false});
				$('#containerGallery li').animate({
					opacity:1
				},1500,function(e){
				});
			}catch(e){
				console.log(e.message);
			}
		},
		Actions : {
			fadeInItems:function(){
				
			}
		},
		obj:{
			gallery:null
		}
	}
})(jQuery, zone);

function sliderTabNode(){
	if(!autoRun) return;
	$.each($('.wd-connection ul'),function(x,y){
			var _this = $(this);
			$.each($('ul.wd-nav li'),function(a,b){
				if ($(this).hasClass('wd-active')) {
					$(this).removeClass('wd-active');
					if($(this).next().hasClass('wd-loop')){
						$("ul.wd-nav li:first").addClass('wd-active');
						loadGalleryNode($("ul.wd-nav li:first a").attr('key_search'));
					}else{
						$(this).next().addClass('wd-active');
						loadGalleryNode($(this).next().find('a').attr('key_search'));
					}
					return false;
				}
			});
		
	});
}
function loadGalleryNode(strNode){
	strNode = $.trim(strNode);
//	$(".wd-bottom-header").attr('class','wd-connection wd-subject-node-conection  responsive wd-bg-scroll-'+strNode);
	if(strNode!=''){
		$(".wd-bottom-header").attr('class','wd-bottom-header wd-type-gallery-bn wd-bottom-header-'+strNode);
	} else {
		$(".wd-bottom-header").attr('class','wd-bottom-header wd-type-gallery-bn wd-bottom-header-people');
	}
//	if(dataGallery[strNode].length == 0 ){
//		$('#containerGallery').html('');
//	}else{
//		var rendereGallery = $.tmpl($('#tmplGalleryNode'), dataGallery[strNode]);
//		$('#containerGallery').html(rendereGallery);
//		$('#containerGallery li').css({opacity:0});
//		zone.GalleryLandingPage.init();
//		
//	}
}

$().ready(function(e){
	
	if (typeof isSlider != "undefined" && isSlider == true) {
		var elms = $('ul.wd-nav li');
		if (elms.length)
			$(elms[0]).addClass('wd-active');
		setInterval(function(){
			sliderTabNode();
		},10000);
	} else{
		$.each($('.menu-category ul li'),function(){
			if($(this).hasClass("wd-active")){
				loadGalleryNode($(this).find('a').attr('key_search'));
			}
		});
	}
	
	$('body').on('mouseover', 'div.caroufredsel_wrapper', function(e){
		autoRun = false;
	});
	$('body').on('mouseout', 'div.caroufredsel_wrapper', function(e){
		autoRun = true;
	});
});
$(window).resize(function(){
	
//	width = $( window ).width();
//	padding = parseInt((252 - (1349-width))/4)+3;
//	
//	if(width<1349){
//		$('#containerGallery li').css({'width': 244, 'padding-right':padding});
//		$('#containerGallery').first().css({'padding-left':padding-6});
//	} else {
//		$('#containerGallery').css({'float': 'left','padding':0});
//	}
	
});