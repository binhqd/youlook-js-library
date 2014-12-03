;(function($, scope){
	scope['Form'] = zone.Form.Default;
	
	
	scope['post'] = {
		postPhoto : function(albumID, form, callback) {
			var title = form.data('title');
			var description = form.data('description');
			
			// TODO: Check validation here
			
		}
	};
})(jQuery, zone.photo);