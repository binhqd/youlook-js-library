var params = "";
var loadFirstNode = true;
$().ready(function() {
	$('body').on('click', '.labelNode li a', function(e){
		// $(document).click();
		var label = $(this).html();
		$("#labelSelect").html(label+'<span class="wd-arrow"></span>');
		$('ul.labelNode li').show();
		$.each($('ul.labelNode li a'),function(e){
			if($.trim(label) == $.trim($(this).html()) ) $(this).parent().hide();
		});
		params = $(this).attr('params');
		loadRelated($(this).attr('href'));
		return false;
	});
    $( window ).bind( "popstate", function( e ) {
    	// back button in browser
        var returnLocation = history.location || document.location;
        
        

        if (returnLocation.href.indexOf('zone/pages/') == -1) {
        	window.location.href = returnLocation.href;
        } else{
			if(!loadFirstNode){
				params = window.location.search;
				loadRelated(returnLocation.href,0);
			}
        };
		loadFirstNode = false;

    });
});
function loadRelated(url,isHistory) {
	
	isHistory = typeof isHistory !== 'undefined' ? isHistory : 1;
	$('.wd-connec-list').css({opacity:.2});
	$("#lmnoderelated").prepend('<div class="overlay-image"><div class="opacity-image"><img src="'+homeURL+'/myzone_v1/img/front/ajax-loader-bb.gif"><div>Loading...</div></div></div>');
	
	$.get(url,function(response){
		if(typeof response.error !== 'undefined'){
			// console.log(isHistory)
			// console.log(response)
			//console.log(response.relateds.length);
			if(response.relateds.length != 0){
				// $("#label-wd-connec-list").fadeOut(1000);
				$("#lmnoderelated .overlay-image").remove();
				$("#label-wd-connec-list").html('');
				$('.wd-connec-list').css({opacity:1});
				
				$.each(response.relateds,function(key,value){
					var strImage = "";
					
					if(typeof  value.image != 'undefined'){
						strImage = '<img src="'+homeURL+'/upload/gallery/fill/71-71/'+value.image.name+'?album_id='+value.zone_id+'" /> ';
					}else{
						strImage = '<img src="'+homeURL+'/upload/gallery/fill/71-71/" /> ';
					}
					var li = '<li class="item" id="'+value.zone_id+'" style="display:none">'+
						'<a data-id="'+value.zone_id+'" title="" href="'+homeURL+'/zone/pages/detail?id='+value.zone_id+'&label=">'+strImage+
							'<br>'+
							'<span class="wd-name">'+value.name+'</span>'+
						'</a>'
						'</li>';
							
					$("#label-wd-connec-list").append(li);
					$("#label-wd-connec-list li#"+value.zone_id).fadeIn(1500);
					
					// console.log(value)
				});
				// $("#label-wd-connec-list").fadeIn(1000);
				if($('.wd-connec-list').children("li").length>5) initcarouFredSelNode();
					
				$('.urlViewAllArticles a').attr('href',homeURL+'/articles/views/index'+params);
				$('.urlViewAllPhotos a').attr('href',homeURL+'/photos/views/index'+params);
				if(isHistory) history.pushState( null, null , url);
				
			}else{
				$("#lmnoderelated .overlay-image").remove();
				$("#label-wd-connec-list").html('');
				$('.wd-connec-list').css({opacity:1});
			}
		}
		
		// displayBiz(url,response,isHistory);
	}, 'JSON');


}
function initcarouFredSelNode(){
	var widthScreen =$(window).width();

	//Caroufredselalert($('.wd-connec-lis').children("li").length);
	
	if (($('.wd-connec-list').children("li").length >8)&&(widthScreen > 1024)){
		$('.wd-connec-list').carouFredSel({
			auto: false,
			responsive: true,
			width: '100%',    
			scroll: 3,
			prev: '#wd-prev',
			next: '#wd-next',
			pagination: false,
			mousewheel: true,
			items: {
			height: 'auto',
			visible: {
			min: 4,
			max: 10
			}
			},
			swipe: {
			onMouse: true,
			onTouch: true
			}
		});
	}else{
		if(($('.wd-connec-list').children("li").length >= 5)&&(widthScreen <= 1024)){
			$('.wd-connec-list').carouFredSel({
				auto: false,
				responsive: true,
				width: '100%',    
				scroll: 3,
				prev: '#wd-prev',
				next: '#wd-next',
				pagination: false,
				mousewheel: true,
				items: {
				height: 'auto',
				visible: {
				min: 4,
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
}