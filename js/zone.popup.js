$(document).ready(function(){
	
	
	initPopup();
	
});
function initPopup(){
	
	$('a.wd-popup-images').magnificPopup({
		tClose: 'Close (Esc)',
		type:'iframe',
		iframe: {
			markup:	'<div class="mfp-iframe-scaler">'+
					'<div class="mfp-close"></div>'+
					'<div class="mfp-preloader" style="display:block">Loading...</div>'+
					'<iframe class="mfp-iframe" frameborder="0" scrolling="no" allowfullscreen style="display:none"></iframe>'+
			'</div>',
			patterns: {
		  
			}
		},
		callbacks: {
		    open: function() {
				
				
				
		    },
		    close: function() {
		      	
		    }
	    }
	});
}