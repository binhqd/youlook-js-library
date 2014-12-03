;(function($, scope){
	scope['formPost'] = {
		init : function(){
			
		},
		triggerAddFile: function(token){
			var btnAttachments = $("#btnAttachments"+token);
			var gallery = $(".gallery"+token);
			var displatzoneUpload = $.trim($("#zoneUpload"+token).css('display'));
			gallery.find('form .fileupload-buttonbar .span7 input:file').trigger('click');
		},
		togglePostAndPhoto: function(tokenShow,tokenHide,type){
			$("#tokenForm"+tokenShow).show();
			$("#tokenForm"+tokenHide).hide();
			/*Add tooltip*/
			//$("#tokenForm"+tokenShow).find('.btnAddFiles').addClass('wd-tooltip-hover').attr('title','Add Contribute photos');
			//$('.wd-tooltip-hover').tipsy({gravity: 's'});
			$("#tokenForm"+tokenShow).show();
			$("#tokenForm"+tokenHide).hide();
			if(type != undefined && type == 'photo')
				$('form#fileupload-'+tokenShow).find("input[name='files[]']").trigger('click');
//			if($.trim($("#title"+tokenShow).val()) != "") $("#title"+tokenHide).val($("#title"+tokenShow).val());
//			if($.trim($("#title"+tokenHide).val()) != "") $("#title"+tokenShow).val($("#title"+tokenHide).val());
			if(!$("#liActived"+tokenShow).hasClass('wd-active')){
				$("#liActived"+tokenShow).addClass('wd-active');
				$("#liActived"+tokenHide).removeClass('wd-active');
			}else{
				
			}
			
		},
		checkValue:function(token,bothField,event){
			$(".redactor_editor").keyup(function(e){
				if($("#content"+zone.formPost.token.post).val() != "" && $("#title"+zone.formPost.token.post).val() != "") $("#btnSubmit"+zone.formPost.token.post).removeAttr("disabled");
				else $("#btnSubmit"+zone.formPost.token.post).attr("disabled","disabled");
			});
			$("#title"+zone.formPost.token.post).keyup(function(e){
				if($("#content"+zone.formPost.token.post).val() != "" && $("#title"+zone.formPost.token.post).val() != "") $("#btnSubmit"+zone.formPost.token.post).removeAttr("disabled");
				else $("#btnSubmit"+zone.formPost.token.post).attr("disabled","disabled");
			});
			$("#content"+zone.formPost.token.post).keyup(function(e){
				var bothField = $(this).attr('bothField');
				if(bothField == ""){
					if($("#content"+zone.formPost.token.post).val() != ""){
						$("#btnSubmit"+zone.formPost.token.post).removeAttr("disabled");
						var content = $("#content"+zone.formPost.token.post).val();
						var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
						var url= content.match(urlRegex);
						if(url != null){
							zone.formPost.getUrlInfo(url,$(this).attr('tokenMerge'),$(this).attr('token'));
						}
						
						
					}else $("#btnSubmit"+zone.formPost.token.post).attr("disabled","disabled");

					return false;
				}
			});
			
			
		},
		getUrlInfo : function(url,tokenMerge,token){
			if(!zone.formPost.checkGetUrl){
				zone.formPost.checkGetUrl = true;
				$("#loading"+tokenMerge).show();
				$("#btnSubmit"+token).attr("disabled", "disabled");
				$.post(homeURL+"/status/default/getUrl", {url: url})
				.done( function(res) { 
					if(typeof res.error !="undefined"){
						if(res.error){
							zone.formPost.checkGetUrl = false;
						}else{
							// $("#dataOther").val(JSON.stringify(res.data));
							
						}
					}else{
						$("#pullPostLink").html(res);
						$("#pullPostLink").show();
					}
					$("#loading"+tokenMerge).hide();
					$("#btnSubmit"+token).removeAttr("disabled");
					
				}).fail( function(xhr, textStatus, errorThrown) {
					$("#loading"+tokenMerge).hide();
					// $("#dataOther").val("");
					console.log(xhr.statusText);
					
				});
				
			}
		},
		data:{

		},
		objHtml:{
			
		},
		token:{
			post:null,
			photo:null
		},
		checkGetUrl: false
	};
})(jQuery, zone);
$(document).ready(function(e){
	zone.formPost.checkValue();

	$(document).on('keyup','.js-article-album-title',function(e){
		var _this = $(this);
		var token = _this.attr('token');
		var title = _this.val();
		if(objCountFile.photo.doneFile > 0 && $.trim(title) != "") {
			$("#btnSubmit" + token).removeClass("disabled").removeAttr("disabled");
		}else {
			$("#btnSubmit" + token).addClass("disabled").attr("disabled","disabled");
			return false;
		}
	});

});

function postArticle(token,postPhoto,tokenMerge){
	var objForm = $("#formPost"+token);
	var objectTitle = $("#title"+token);
	var objectContent = $("#content"+token);
	var title = objectTitle.val();

	var content = objectContent.val();

	if($("#btnSubmit"+token).attr('bothField') == 1){
		if($.trim(title) == ""){
			if(postPhoto != false){
				// $(".wd-top-mess-form-post .wd-top-mess-content-error").fadeIn(500);
				// $(".wd-top-mess-form-post .wd-top-mess-content-error .wd-intro").html("The title couldn't be empty, please enter this information");
				objectTitle.focus();
				return false;
			}else{
				// $(".wd-top-mess-form-post .wd-top-mess-content-error").fadeIn(500);
				// $(".wd-top-mess-form-post .wd-top-mess-content-error .wd-intro").html("The title album couldn't be empty, please enter this information");
			}
			
		}
	}
	if(postPhoto != false){
		if($.trim(content) == ""){
			if($("#btnSubmit"+token).attr('bothField') == 1){
				// $(".wd-top-mess-form-post .wd-top-mess-content-error").fadeIn(500);
				// $(".wd-top-mess-form-post .wd-top-mess-content-error .wd-intro").html("The content couldn't be empty, please enter this information");
			}else{
				// $(".wd-top-mess-form-post .wd-top-mess-content-error").fadeIn(500);
				// $(".wd-top-mess-form-post .wd-top-mess-content-error .wd-intro").html("The message couldn't be empty, please enter this information");
			}
			
			objectContent.focus();
			return false;
		}
	}
	if(postPhoto == false && $.trim($("#pushImages"+token).html()) == ""){
		$(".gallery"+token).find("form .fileupload-buttonbar .span7 input:file").trigger("click");
		return false;
	}

	var action = objForm.attr('action');

	$("#loading"+tokenMerge).show();
	var checkTitle = "";
	if($("#btnSubmit"+token).attr('bothField') == 1){
	}else{
		checkTitle = "&checkTitle=false";
		
	}

	var dataUrl = objForm.serialize();
	$("#title"+token+",#content"+token).attr("disabled", "disabled");
	$("#btnSubmit"+token).attr("disabled", "disabled");

	$.ajax({
		type:"POST",
		data:dataUrl+checkTitle,
		url:action,
		success:function(res){
			var hanlder = $("#btnSubmit"+token).data("loginCompleted");
			hanlder && hanlder();

			if(res.error){
			}else{
				objectTitle.val('');
				objectContent.val('');
			}
			$("#loading"+tokenMerge).hide();
			$("#title"+token+",#content"+token).removeAttr("disabled");
			// $("#btnSubmit"+token).removeAttr("disabled");
			// $(".wd-top-mess-form-post .wd-top-mess-content-error").fadeOut(500);

			$("#btnSubmit"+token).attr("disabled","disabled");
			zone.formPost.checkGetUrl = false;
			$("#pullPostLink").html('');
			$("#pullPostLink").hide();

			$("#title"+token+",#content"+token).css({
				height:'auto'
			});
			$("#filesContainer"+token).html('');
			$(".redactor_editor").html('');
			$("textarea.article").val('');
			if(postPhoto != false){
				$("#zoneUpload"+token).hide();
			}
			$("#pushImages"+token).html('');
			
			if($("#btnSubmit"+token).attr('realTime')){
				/*Set Photo Init*/
				zone.photo.init();
				if(res.type == 0 ){
					loadStatusNew($($("#btnSubmit"+token).attr('container')),res.article_id,$("#btnSubmit"+token).attr('view'),$("#btnSubmit"+token).attr('typeForm'));
					return false;
				}
				if(typeof res.article_id !="undefined") {
					$("#zoneUpload"+token).attr("style","padding:0px");
					$("#zoneListPhoto"+token).hide();
					$("#btnAttachments"+token).show();
					$(".gallery"+token+" .fileinput-button").css({
						bottom: "auto",
						width: "45px",
						top: "auto",
						left: "45px",
						height: "45px"
					});
					loadArticlesNew($($("#btnSubmit"+token).attr('container')),res.article_id,$("#btnSubmit"+token).attr('view'),$("#btnSubmit"+token).attr('typeForm'));
				} else if (typeof res.album_id !="undefined") {
					loadNewAlbum($($("#btnSubmit"+token).attr('container')),$("#btnSubmit"+token).attr('view'), res.album_id);
				}
			}
			objCountFile.photo.doneFile = 0;
		},
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.responseText);
			$(".wd-top-mess-form-post .wd-top-mess-content-error").hide();
			$("#loading"+tokenMerge).hide();
			$("#title"+token+",#content"+token).removeAttr("disabled");
			$("#btnSubmit"+token).removeAttr("disabled");
		}
	});
}

function loadNewAlbum(obj,view, album_id) {
	$.ajax({
		type:"POST",
		data:"&view="+view,
		url: homeURL+"/resource/renderAlbum?album_id="+album_id,
		success:function(res){
			obj.prepend(res);
			try{
				initPopup();
				jQuery(".timeago").timeago();
				//zone.photo.init({});
			} catch(e){
				
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.responseText);
		}
	});
}
function loadArticlesNew(obj,article_id,view,type){
	$.ajax({
		type:"POST",
		data:"&view="+view+"&renderHTML=true",
		url:homeURL+"/articles/default/renderArticle?article_id="+article_id+"&type="+type,
		success:function(res){
			obj.prepend(res);
			$("#articleSelector").find('.article-description').greennetReplaceLink();
			try{
				initPopup();
				jQuery(".timeago").timeago();
				/*Tooltip*/
				$('.wd-tooltip-hover').tipsy({gravity: 's'});
			}catch(e){
				
			}
			try {
				zone.articles.initLinks($(obj).find(".js-article-delete"));
			} catch (e) {}
			
		},
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.responseText);
		}
	});
}
function loadStatusNew(obj,article_id,view,type){
	$.ajax({
		type:"POST",
		data:"&view="+view+"&renderHTML=true",
		url:homeURL+"/status/default/renderStatus?id="+article_id+"&type="+type,
		success:function(res){
			obj.prepend(res);
			try{
				initPopup();
				jQuery(".timeago").timeago();
	
			}catch(e){
				
			}
			
		},
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.responseText);
		}
	});
}


