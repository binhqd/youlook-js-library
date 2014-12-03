$(document).ready(function() {
	$('body').on('keypress', '.photoDescription textarea', function(e){
		if(e.keyCode == 13){
			var _this = $(this);
			var frmUpload = $("#formPullImages");
			$.ajax({
				type	: "POST",
				dataType: "JSON",
				url		: homeURL+"/photos/views/upload?nodeId="+$("#doneUpload").attr('album_id'),
				data	: frmUpload.serialize(),
				success:function(res){
					if(res.error){
						console.log(res.message);
					}else{
						_this.parent().hide();
						if(res.attributes.description  == ""){
							$('.addDes').show();
							$('.editDes').hide();
						}else{
							$('.editDes').show();
							$('.addDes').hide();
						}
						$('.pullDes').html(_this.val());
					}
				},error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.responseText);
				}
			});
			return false;
		}
	});

	$('body').on('click', '.wd-icon-remove', function(e){
		$("#pp-confirm").magnificPopup({tClose: 'Close (Esc)',closeBtnInside:false}).trigger('click');

		objPhoto.element = $(this).parent();
		objPhoto.href = $(this).attr('href');
		return false;
	});

	$("#btnPostAlbumPhoto").click(function(e) {
		var _type = $(this).attr('data-type');
		if(_type != 'undefined' && _type == "user") 
		{
			$(this).addClass("wd-bt-cancel");
			var frmUpload = $('#formAddAlbumPhotos');
			var token = frmUpload.attr('token');
			$.ajax({
				type	: "POST",
				url		: homeURL+"/resource/createAlbum",
				data	: frmUpload.serialize(),
				dataType: 'JSON',
				success	: function(res){
					
					$("#photo-not-found").hide();
					$("#btnPostAlbumPhoto").addClass("class","wd-bt-done-upload");
					$("#btnPostAlbumPhoto").removeClass("wd-bt-cancel");
					if(res.error){
						console.log(res.message);
					} else {
						
						/** success*/
						var total_photo_current = parseInt($("span.js-number-photo").text());
						$("span.js-number-photo").text(total_photo_current + res.photos.length);
						
						
						$("span.js-message-not-photo").hide();
						var albumID = $('#hiddenAlbumID').val();
						if (res.code == 201) { // New album is created
							var album = $('#tmplAlbumItem').tmpl(res.album);
							$('ul.albumContainer').prepend(album);
							$(document).on("click",".viewAlbumDetail",function() {
								/*Set Photo Init*/
								zone.photo.init();

								zone.usernode.GUI.cleanup();
								zone.usernode.photo.GUI.showPhotoContainer();
								var album_id = $(this).attr('ref');
								/*Push state*/
								var stateURL = $(this).attr('href');
								zone.usernode.History.pushState(stateURL);

								/*Call event unit*/
								$("html, body").animate({scrollTop: "200px"}, 1000);
								/*Append input album_id*/
								$('form#formAddAlbumPhotos').append('<input type="hidden" name="album_id" value="'+album_id+'">');

								$('.js-loading').css({'display':'block'});
								zone.usernode.photo.config.page = 1;
								zone.usernode.photo.Actions.loadAlbumDetail(album_id);
								return false;
							});
							++zone.photo.offsetAlbumLoad;
						} else { // images are posted in an existing album
							zone.usernode.photo.photoContainer.data('album-detail-' + albumID, "");
							jQuery.each( res.photos || [], function( i, val ) {
								// render item
								zone.List.renderItem(val, {
									templateID : 'tmplPhotoItem',
									callback : function(renderedItem) {
										renderedItem.find('.timeago').timeago();
										zone.usernode.photo.photoContainer.prepend(renderedItem);
									}
								});
								/*Make index*/
								zone.photo.photoIndex.unshift(val.photo.id);
								/*Make total Photo*/
								$(".lnkViewPhotoDetail").attr("number_end",++zone.photo.totalPhoto);
								/*Set offset photo load*/
								++zone.photo.offsetPhotoLoad; 
							});
							/*Empty cache*/
							zone.photo._caches = {};
						}
						/* hide form*/
						zone.usernode.GUI.clearPostPhotoForm();
						$('#pull-form-upload').fadeOut(500);
						/*Tooltip*/
						$('.wd-tooltip-hover').tipsy({gravity: 's'});
					}
				
				},error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.responseText);
				}
			});
			}
		
		return false;
	});
	
	$('#btnCancelPhotoForm').click(function() {
		zone.usernode.GUI.clearPostPhotoForm();
	});
	
	$('#lnkShowPostPhoto').click(function() {
		$('#pull-form-upload').find("input[name='files[]']").trigger('click');
		$('#pull-form-upload').fadeIn(500);
	});
	
	// Attach event listener
	zone.usernode.photo.Event.onAlbumDetailLoaded = function(album_id) {
		$('#hiddenAlbumID').val(album_id);
	};
	
	zone.usernode.photo.Event.onAlbumsLoaded = function(album_id) {
		$('#hiddenAlbumID').val('');
	};
	
});