;$().ready(function(e){
	$('.open-popup-link').magnificPopup({
		type:'inline',
		tClose: 'Close',
		closeBtnInside:true
	});
	$('.open-popup-link').on("click",function(e){
		var link = $(this).parent().attr('link');
		$("#container-iframe").html("<iframe src='"+link+"' style='width:100%; height:100%'></iframe>");
	});
	checkLazyLoadImage();
	
	if ($('.wd-type-topReview').children("li").length >1){
		$('.wd-type-topReview').carouFredSel({
			auto: false,
			width: '306',    
			scroll: 1,
			prev: '#wd-prev',
			next: '#wd-next',
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
	if ($('.wd-node-categories').children("li").length >4){

		$('.wd-node-categories').carouFredSel({
			auto: {
				play :false,
				delay:7000
			},
			width: '140',    
			height: calHeightItemCast(),
			scroll: 1,
			prev: '#wd-prev-type',
			next: '#wd-next-type',
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
	var infScroller = $('#articleSelector');
	
	$(".wd-type-art-itemTab").on("click",function(e){
		$.each($(this).parent().find('li'),function(e){
			$(this).removeClass("wd-active");
			$("#"+$(this).attr('target')).hide();
		});

		$(this).addClass("wd-active");
		$("#"+$(this).attr('target')).show();
		if($(this).attr('target') == "cRelated"){
			sliderRelated();
		}
	});
	
	
});