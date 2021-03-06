/*zone.dashboard.activity.form*/
;(function($, scope) {
	scope['form'] = {
		frmPostStatus : $('#dashboard-main-container .frmPostStatus'),
		txtStatusTitle : $('#dashboard-main-container .txtTitle'),
		txtStatusContent : $('#dashboard-main-container .txtContent'),
		btnPostStatus : $('#btnPostStatus'),
		init : function() {
			//var _scope = scope;
			
			/*Setup tab click*/
			$('#formHeadingTabs .tab-link').click(function() {
				var ref = $(this).attr('ref');
				
				// hide all tabs
				$('.form-content').hide();
				
				// show current tab
				$('#dashboard-main-container .' + ref).show();
				
				// set status of tab heading
				$('#formHeadingTabs .tab-link').removeClass('wd-active');
				
				// set current tab heading active
				$(this).addClass('wd-active');
				
				if (ref == "photo-tab") {
					//mainPhotoForm.selectFiles();
					$('form#frmPhotoUpload input[name="files[]"]').trigger('click');
				}
			});
			
		}
	};
})(jQuery, zone['dashboard']['activity']);
/* 
 * Global variables & object 
 */
var mainPhotoForm = null;

$(document).ready(function(e){
	// create form for posting photo
	mainPhotoForm = new zone.photo.Form({
		form			: $('#frmPostPhotos'),
		txtTitle		: $('#txtPhotoTitle'),
		txtDescription	: null,
		photosContainer	: $('#mainPostPhotosContainer'),
		btnPost			: $('#btnPostPhotos'),
		allowTitleEmpty	: true,
		albumID			: null,
		fileInputContainer : $('#filesPhotoContainer'),

		/*callback*/
		beforePost		: function() {
			this.btnPost.removeAttr("disabled");
		},
		afterPosted		: function(res) {
			var activity = {
				id			: null,
				receiver_id : null,
				user_id		: null,
				type		: "Post",
				object_id	: res.album.id,
				object_type	: "Album",
				created		: res.album.created,
				notify		: "0",
				invalid		: "0",
				related		: {
					message	: "",
					user	: res.album.poster,
					album	: res.album,
					images	: res.photos,
					object	: null
				},
				like: {
					you_liked: false,
					classRating: "",
					action: "/activity/like",
					value: "Like",
					count: 0,
					text: "Like",
					object_id: res.album.id,
					type: "like",
					actionUnlike: "/activity/unlike"
				},
				comments: [ ],
				countComments: "0"
			};
			
			if(res.error){
				console.log(res);
			} else {
				zone.List.renderItem(activity, zone.dashboard.activity.buildOptions(activity, 'tmplActivityAlbumItem', 'prepend'));
				objCountFile.photo.addFile = 0;
				objCountFile.photo.doneFile = 0;
				this.btnPost.addClass("disabled").attr("disabled");
				this.txtTitle.val("");
				this.photosContainer.html("");
				this.fileInputContainer.html("");
			}
			$(".redactor_editor").html('');
		}
	});
	
	// status form
	mainStatusForm = new zone.dashboard.activity.statusForm({
		form			: $('#frmPostStatus'),
		txtTitle		: $('#frmPostStatus .txtTitle'),
		txtDescription	: $('#frmPostStatus .txtContent'),
		filesContainer	: $('#mainPostStatusContainer'),
		btnPost			: $('#btnPostStatus'),
		allowTitleEmpty	: true,
		fileInputContainer : $('#filesStatusContainer'),
		
		/*callback*/
		beforePost		: function() {
			//this.txtTitle.attr("disabled", "disabled");
			//this.txtDescription.attr("disabled", "disabled");
			this.btnPost.removeAttr("disabled");
		},
		afterPosted		: function(res) {

			var activity = {
				id			: null,
				receiver_id : null,
				user_id		: null,
				type		: "Post",
				object_id	: res.article.id,
				object_type	: "Article",
				created		: res.article.created,
				notify		: "0",
				invalid		: "0",
				related		: {
					message	: "",
					user	: res.author,
					article	: res.article,
					object	: null
				},
				like: {
					you_liked: false,
					classRating: "",
					action: "/activity/like",
					value: "Like",
					count: 0,
					text: "Like",
					object_id: res.article.id,
					type: "like",
					actionUnlike: "/activity/unlike"
				},
				comments: [ ],
				countComments: "0"
			};

			if(res.error){
				console.log(res);
			} else {
				
				zone.List.renderItem(activity, zone.dashboard.activity.buildOptions(activity, 'tmplActivityPostArticleItem', 'prepend'));
				
				this.txtTitle.removeAttr('disabled').val('');
				this.txtDescription.removeAttr('disabled').val('');
				this.fileInputContainer.html('');
				this.btnPost.addClass("disabled").attr("disabled");
				$("html, body").animate({ scrollTop:"200px" },1000);
			}
			$(".redactor_editor").html('');
		}
	});

	mainStatusForm.setAvailableStatus = function() {
		if ((!this.options.allowTitleEmpty && this.txtTitle == "") || this.txtDescription == "") {
			this.btnPost.attr("disabled","disabled");
		} else {
			this.btnPost.removeAttr("disabled");
		}
	};
	
	zone.dashboard.activity.form.init();
	zone.dashboard.activity.post.checkValue();

	$('.js-attachment-photos').on('click',function(){
		var _this = $(this);
		var _token = _this.attr('token');

		$(".gallery"+_token).find("#disable input[type='file']").trigger("click");
	});
});

$(document).on("keyup","#txtPhotoTitle",function(){
	if(objCountFile.photo.doneFile > 0 && objCountFile.photo.doneFile == objCountFile.photo.addFile) {
		$("#btnPostPhotos").removeClass("disabled").removeAttr("disabled");
	}else {
		$("#btnPostPhotos").addClass("disabled").attr("disabled");
	}
});
function removeBtnDiabledPhoto(_this) {
	jConfirm('Are you sure you want to delete photo?', 'Delete photo', function(r) {
		if(r){
			--objCountFile.photo.addFile;  
			--objCountFile.photo.doneFile;
			_this.parent().remove();
			var _id = _this.attr("id");
			var _frm = $(".js-formPullImages");
			_frm.find("input[ref="+_id+"]").remove();

			if(objCountFile.photo.doneFile > 0 && objCountFile.photo.doneFile == objCountFile.photo.addFile) {
				$("#btnPostPhotos").removeClass("disabled").removeAttr("disabled");
			}else {
				$("#btnPostPhotos").addClass("disabled").attr("disabled");
			}
		}
	});
}
$(document).on("keyup","#frmPostStatus .txtTitle",function(){
	var _this = $(this);
	var _title = $.trim(_this.val());
	var _content =  $.trim($("#frmPostStatus .redactor_txtContent p").text());
	if(_content != "" && _title != "") {
		$(".btnPostArticle").removeClass("disabled").removeAttr("disabled");
	}else {
		$(".btnPostArticle").addClass("disabled").attr("disabled");
	}
});