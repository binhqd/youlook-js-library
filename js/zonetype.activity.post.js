;(function($, scope) {
	scope['form'] = {
		frmPostStatus : $('#activity-form-container .frmPostStatus'),
		txtStatusTitle : $('#activity-form-container .txtTitle'),
		txtStatusContent : $('#activity-form-container .txtContent'),
		btnPostStatus : $('#btnPostStatus'),
		init : function() {
			//var _scope = scope;
			
			/*Setup tab click*/
			$('#formHeadingTabs .tab-link').click(function() {
				var ref = $(this).attr('ref');
				
				// hide all tabs
				$('.form-content').hide();
				
				// show current tab
				$('#activity-form-container .' + ref).show();
				
				// set status of tab heading
				$('#formHeadingTabs .tab-link').removeClass('wd-active');
				
				// set current tab heading active
				$(this).addClass('wd-active');
				
				if (ref == "photo-tab") {
					//mainPhotoForm.selectFiles();
					$('form#frmPhotoUpload input[name="files[]"]').trigger('click');
				}
			});
			
			/*setup post article*/
			scope.form.btnPostStatus.click(function() {
				
				zone.usernode.activity.post.postArticle();
			});
			
		}
	};
	
	scope.photoForm = zone.Form.Default;
	scope.articleForm = zone.Form.Default;
})(jQuery, zone.zonetype.activity);

var mainPhotoForm = null;
var mainArticleForm = null;

$(document).ready(function(e){
	// create form for posting photo
	mainPhotoForm = new zone.zonetype.activity.photoForm({
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
				zone.List.renderItem(activity, zone.zonetype.activity.buildOptions(activity, 'tmplActivityAlbumItem', 'prepend'));
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
	
	mainArticleForm = new zone.zonetype.activity.articleForm({
		form			: $('#formMainPostArticle'),
		txtTitle		: $('#formMainPostArticle .txtTitle'),
		txtDescription	: $('#formMainPostArticle .txtContent'),
		photosContainer	: $('#mainPostArticleContainer'),
		btnPost			: $('#btnMainPostArticle'),
		allowTitleEmpty	: false,
		fileInputContainer : $('#filesArticleContainer'),
		
		/*callback*/
		beforePost		: function() {
			//this.txtTitle.attr("disabled", "disabled");
			//this.txtDescription.attr("disabled", "disabled");
			this.btnPost.attr("disabled", "disabled");
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
				
				zone.List.renderItem(activity, zone.zonetype.activity.buildOptions(activity, 'tmplActivityPostArticleItem', 'prepend'));
				
				this.txtTitle.removeAttr('disabled').val('');
				this.txtDescription.removeAttr('disabled').val('');
				this.btnPost.addClass("disabled").attr("disabled");
				this.fileInputContainer.html('');
				$("html, body").animate({ scrollTop:"250px" },1000);
			}
			
			//$("#loading"+tokenMerge).hide();
			//zone.formPost.checkGetUrl = false;
			
			
			$(".redactor_editor").html('');
		}
	});
	
	mainArticleForm.setAvailableStatus = function() {
		if ((!this.options.allowTitleEmpty && this.txtTitle == "") || this.txtDescription == "") {
			this.btnPost.attr("disabled","disabled");
		} else {
			this.btnPost.removeAttr("disabled");
		}
	};
	
	zone.zonetype.activity.form.init();
	//zone.zonetype.activity.post.checkValue();
});
$(document).on("keyup","#txtPhotoTitle",function(){
	var _this = $(this);
	var _title = _this.val();
	if(objCountFile.photo.doneFile > 0 && objCountFile.photo.doneFile == objCountFile.photo.addFile && _title != "") {
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

			var _title = $("#txtPhotoTitle").val();
			if(objCountFile.photo.doneFile > 0 && objCountFile.photo.doneFile == objCountFile.photo.addFile && _title != "") {
				$("#btnPostPhotos").removeClass("disabled").removeAttr("disabled");
			}else {
				$("#btnPostPhotos").addClass("disabled").attr("disabled");
			}
		}
	});
}
$(document).on("keyup",".txtTitle",function(){
	var _this = $(this);
	var _title = $.trim(_this.val());
	var _content =  $.trim($(".redactor_txtContent p").text());
	if(_content != "" && _title != "") {
		$(".btnMainPostArticle").removeClass("disabled").removeAttr("disabled");
	}else {
		$(".btnMainPostArticle").addClass("disabled").attr("disabled");
	}
});

$(document).on("keyup",".redactor_article",function(){
	/*var _this = $(this);
	var _txt_content = $.trim(_this.text());
	var _txt_title = $.trim($(".js-postArticle .txtTitle").val());
	if(_txt_title != "" && _txt_content != "") {
		$(".btnMainPostArticle").removeClass("disabled").removeAttr("disabled");
	}else {
		$(".btnMainPostArticle").addClass("disabled").attr("disabled");
	}*/
});