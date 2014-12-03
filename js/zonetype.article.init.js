

$(document).ready(function() {
	zone.zonetype.article.init(zoneid);
	var pathPart = homeURL+"/api/article?page=";
	var queryPart = "&id=" + zoneid;
	zone.zonetype.article.articleURL = homeURL+"/"+zone.zonetype.config.homeURI+"?id="+zoneid+"&tab=articles";
	
	$( window ).bind( "popstate", function( e ) {
		var returnLocation = history.location || document.location;
		
		if (returnLocation.href.indexOf('tab=articles') > 0) {
			zone.zonetype.article.Actions.showContainer();
			
			$("html, body").animate({ scrollTop:"330px" },1000);
			
			$('#article-loading').html('').append(zone.movieState.loadingDiv.show());
			zone.zonetype.article.Actions.loadArticles(pathPart, queryPart);
			//return false;
		} else if (returnLocation.href.indexOf('action=article-detail') > 0) {
			zone.zonetype.article.Actions.showDetailContainer();
			
			$("html, body").animate({ scrollTop:"330px" }, 1000);
			
//			$('#article-loading').html('').append(zone.movieState.loadingDiv.show());
			var url = $.url(returnLocation.href);
			var articleID = url.param('a_id');
			zone.zonetype.article.Actions.loadArticleDetail(articleID);
			return false;
		}
	});

	$('#lnkViewMoreArticles').click(function() {
		$("html, body").animate({ scrollTop:"310px" },1000);
		
		zone.zonetype.article.Actions.showContainer();
		$('#article-loading').html('').append(zone.movieState.loadingDiv.show());
		zone.zonetype.article.Actions.loadArticles(pathPart, queryPart);
		zone.zonetype.History.pushState(zone.zonetype.article.articleURL);
		
		return false;
	});

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

		$.ajax({
			type	: "POST",
			data	: dataUrl,
			url		: action,
			dataType: 'JSON',
			success	: function(res) {
				if (!res.error) {
					//$("#pullPostLink").html('');
					//$("#pullPostLink").hide();

					//$("#title"+token+",#content"+token).css({
					//	height:'auto'
					//});

					$("#filesContainer"+token).html('');
					//$(".redactor_editor").html('');
					$("#pushImages"+token).html('');

					zone.zonetype.article.Actions.renderArticleItem(res.article,false);

					$('#sectionPostArticle').hide();
					$('#frmPostArticle').find(".article-title").val('');
					$('#frmPostArticle').find(".redactor_article, .article-title").html('');
					$("#btnPostArticle").addClass("disabled");
					$("html, body").animate({ scrollTop:"200px" },1000);
				} else {
					console.log(res.message);
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
				console.log(xhr.responseText);
			}
		});
	});
});