$(document).ready(function() {
	// Toggle post article form
	$('#lnkToggleArticleForm').click(function() {
		$('#sectionPostArticle').toggle();
		$("#frmPostArticle textarea.article-title").focus();
		return false;
	});

	$("#frmPostArticle textarea.article-title").on("change",function(e){
		var _this = $(this);
		var _txt_title = $.trim(_this.val());
		var _txt_content = $.trim($("#frmPostArticle .redactor_article-content p").text());
		if(_txt_title.length > 0 && _txt_content.length > 0 ) {
			$("#btnPostArticle").removeClass("disabled").removeAttr("disabled");
		}else {
			$("#btnPostArticle").addClass("disabled").attr("disabled","disabled");
		}
	});

	$("#frmPostArticle .redactor_article-content").on("keyup",function(e){
		/*var _this = $(this);
		var _txt_content = $.trim(_this.text());
		var _txt_title = $.trim($("#frmPostArticle textarea.article-title").val());
		if(_txt_title.length > 0 && _txt_content.length > 0 ) {
			$("#btnPostArticle").removeClass("disabled").removeAttr("disabled");
		}else {
			$("#btnPostArticle").addClass("disabled").attr("disabled","disabled");
		}*/
	});

	// attach event for button submit new article
	$('#btnPostArticle').on("click",function() {
		var token = $(this).attr('token');
		var postNewArticle = $('#postNewArticle');
		
		var objForm = postNewArticle.find('form');
		var objectTitle = objForm.find('textarea.article-title');
		var objectContent = objForm.find('textarea.article-content');
		var title = objectTitle.val();
		var content = objectContent.val();

		if($.trim(title) == ""){
			objectTitle.focus();
			return false;
		}

		if($.trim(content) == ""){
			objectContent.focus();
			return false;
		}

		var action = objForm.attr('action');
		// show loading ...
		var dataUrl = objForm.serialize();
		// disable button & inputs
		//objectTitle.attr("disabled", "disabled");
		//objectContent.attr("disabled", "disabled");
		//$(this).attr("disabled", "disabled");

		content = content.replace(/(<([^>]+)>)/ig,"").replace("\n", "<br />");
		var data = {
			id		: '',
			title	: title,
			description : content,
			content	: content,
			created : (new Date()).toISOString(),
			image	: '',
			type	: 0,
			author	: user,
			comments_count : 0,
			like_count : 0,
			like : {
				'you_liked'		: 0,
				'classRating'	: '',
				'value'			: 'Like',
				'count'			: 0,
				'text'			: 'Like',
				'object_id'		: '',
				'type'			: 'like'
			},
			comments : []
		};

		// append new item
		$.ajax({
			type	: "POST",
			data	: dataUrl,
			url		: action,
			dataType: 'JSON',
			success	: function(res) {
				if (!res.error) {
					var hanlder = $("#btnSubmit"+token).data("loginCompleted");
					hanlder && hanlder();
	
					if(res.error){
					} else {
						objectTitle.val('');
						objectContent.val('');
					}
					// Hide loading 

					//objectTitle.removeAttr("disabled").val('');
					//objectContent.removeAttr("disabled").val('');
					//$(this).removeAttr("disabled");

					$("#pullPostLink").html('');
					$("#pullPostLink").hide();

					$("#title"+token+",#content"+token).css({
						height:'auto'
					});

					$("#filesContainer"+token).html('');
					$(".redactor_editor").html('');
	//				if(postPhoto != false){
	//					$("#zoneUpload"+token).hide();
	//				}
					$("#pushImages"+token).html('');

					zone.usernode.article.Actions.renderArticleItem(res.article, false);

					$('#sectionPostArticle').hide();
					$('#frmPostArticle').find(".redactor_article").html('');
					$("#btnPostArticle").addClass("disabled");
	//				if($("#btnSubmit"+token).attr('realTime')){
	//					if(res.type == 0 ){
	//						loadStatusNew($($("#btnSubmit"+token).attr('container')),res.article_id,$("#btnSubmit"+token).attr('view'),$("#btnSubmit"+token).attr('typeForm'));
	//						return false;
	//					}
	//					if(typeof res.article_id !="undefined") {
	//						$("#zoneUpload"+token).attr("style","padding:0px");
	//						$("#zoneListPhoto"+token).hide();
	//						$("#btnAttachments"+token).show();
	//						$(".gallery"+token+" .fileinput-button").css({
	//							bottom: "auto",
	//							width: "45px",
	//							top: "auto",
	//							left: "45px",
	//							height: "45px"
	//						});
	//						loadArticlesNew($($("#btnSubmit"+token).attr('container')),res.article_id,$("#btnSubmit"+token).attr('view'),$("#btnSubmit"+token).attr('typeForm'));
	//					} else if (typeof res.album_id !="undefined") {
	//						loadNewAlbum($($("#btnSubmit"+token).attr('container')),$("#btnSubmit"+token).attr('view'), res.album_id);
	//					}
	//					
	//					
	//				}
	//				
	//				
	//				
				} else {
					console.log(res.message);
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
				console.log(xhr.responseText);
//				$(".wd-top-mess-form-post .wd-top-mess-content-error").hide();
//				$("#loading"+tokenMerge).hide();
//				$("#title"+token+",#content"+token).removeAttr("disabled");
//				$("#btnSubmit"+token).removeAttr("disabled");
			}
		});
	});
});