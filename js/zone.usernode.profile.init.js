/**/
$(document).ready(function() {
	$('.lnkEditInfo').click(function() {
		$('#fieldsetEditBasicInfo').show();
		$('#renderedBasicInfo').hide();
		
		return false;
	});
	
	// cancel edit basic info
	$('#btnCancelEditBasicInfo').click(function() {
		$('#txtfullname').val(fullname);
		$('#txtskype').val(txtskype);
		$('#txtweb').val(txtweb);
		$('#txtmobile').val(txtmobile);
		$('#txtbirthday').val(txtbirthday);
		
		$('#renderedBasicInfo').show();
		$('#fieldsetEditBasicInfo').hide();
		
		return false;
	});
	
	// trigger save basic information
	$('#btnSaveBasicInfo').click(function() {
		var error = false;
		$('#fieldsetEditBasicInfo .error-message').html('');
		if($('#txtbirthday').val()!='' && !isValidDate($('#txtbirthday').val())){
			$('#youlook-profile-birthday').html('Birthday invalid');
			error = true;
		} else{
			$('#youlook-profile-birthday').html('');
		}
		
		var phone = $.trim($('#txtmobile').val());
		$('#txtmobile').val(phone);
		if(phone.length>0 && phone.length<9){
			$('#youlook-profile-phone').html('Phone is too short.');
			error = true;
		} else if(phone.length>20){
			$('#youlook-profile-phone').html('Phone is too long.');
			error = true;
		} else if(phone!='' && !ValidatePhone(phone)){
			$('#youlook-profile-phone').html('Phone invalid');
			error = true;
		} else{
			$('#youlook-profile-phone').html('');
		}
		
		if($('#txtweb').val()!='' && !isUrl($('#txtweb').val())){
			$('#youlook-profile-web').html('Web blog invalid');
			error = true;
		} else{
			$('#youlook-profile-web').html('');
		}
		if($('#txtskype').val()!='' && $('#txtskype').val().indexOf(' ') >= 0){
			$('#youlook-profile-skype').html('Your message ID invalid');
			error = true;
		} else{
			$('#youlook-profile-skype').html('');
		}
		if($('#txtfullname').val()==''){
			$('#youlook-profile-fullname').html('Fullname cannot be blank');
			error = true;
		} else{
			$('#youlook-profile-skype').html('');
		}
		if(error){
			return false;
		}
		
		var frmEditBasicInfo = $('#frmEditBasicInfo');
		
		var regexp = /\)/;
		var phoneArray = phone.match(regexp);
		if(phoneArray){
			var wordOne = phone.substr(phoneArray['index']+1,1);
			var wordTwo = phone.substr(phoneArray['index']+2,1);
			
			if(!isNaN(wordOne) && wordOne!=' '){
				if(Number(wordOne)==0 && wordOne==' '){
					$('#txtmobile').val(phone.removeAt(phoneArray['index']+1));
				} else if(Number(wordOne)==0){
					$('#txtmobile').val(phone.replaceAt(phoneArray['index']+1, " "));
				}
			} else if(!isNaN(wordTwo)){
				if(Number(wordTwo)==0){
					$('#txtmobile').val(phone.removeAt(phoneArray['index']+2));
				}
			}
		}
		
		var formData = frmEditBasicInfo.serialize();
		var actionUrl = frmEditBasicInfo.attr('action');
		
		$.ajax({
			url : actionUrl,
			type : 'POST',
			data : formData,
			dataType : 'json',
			success : function(res) {
				if (!res.error) {
					if ($('#renderedBasicInfo').length) {
						zone.Element.create(res.attributes, {
							templateID : 'tmplRenderedBasicInfo',
							callback : function(renderedItem) {
								$('#renderedBasicInfo').html('').append(renderedItem);
							}
						});
					}
					
					// hide form
					$('#renderedBasicInfo').show();
					$('#fieldsetEditBasicInfo').fadeOut(function(){
						$('#msgSuccessEditBasicInfo').fadeIn();
						setTimeout(function(){
							$('#msgSuccessEditBasicInfo').fadeOut(function(){
								$('#fieldsetEditBasicInfo').fadeIn();
							});
						}, 5000);
					});
					
					$('#txtEditBasicInfoToken').val(res.token);
				} else {
					if (res.type == 'validate') {
						$.each(res.message, function(index,value) {
							$.each(value, function(key,val) {
								$('#fieldsetEditBasicInfo').find('span[data-name="'+key+'"]').html(val).show();
							});
						});
					}
				}
			}
		});
		return false;
	});
});
String.prototype.replaceAt = function(index, character) {
	return this.substr(0, index) + character + this.substr(index+character.length);
}
String.prototype.removeAt = function(index) {
	return this.substr(0, index) + this.substr(index+1);
}
function ValidatePhone(phone) {
	var phoneRegExp = /^(\((\+)?[1-9]{1,3}\))?([-\s\.])?((\(\d{1,4}\))|\d{1,4})(([-\s\.])?[0-9]{1,12}){1,2}$/;
	return phoneRegExp.test(phone);
}
function isUrl(s) {
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(s);
}
function isValidDate(txtDate)
{
	var currVal = txtDate;
	if(currVal == '')
		return false;

	// var rxDatePattern = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/; //Declare Regex
	var rxDatePatternOne = /^(\d{4})(\/)(\d{1,2})(\/)(\d{1,2})$/; //Declare Regex
	var rxDatePatternTwo = /^(\d{4})(-)(\d{1,2})(-)(\d{1,2})$/; //Declare Regex
	var dtArray = currVal.match(rxDatePatternOne); // is format OK?
	if(dtArray==null){
		dtArray = currVal.match(rxDatePatternTwo); // is format OK?
		if (dtArray == null){
			return false;
		} else {
			var strM = dtArray[3];
			var strD = dtArray[5];
			
			if(parseInt(strM)<10 && strM.length!=2)
				var strM = '0'+strM;
			if(parseInt(strD)<10 && strD.length!=2)
				var strD = '0'+strD;
			$('#txtbirthday').val(dtArray[1]+'-'+strM+'-'+strD);
		}
	} else {
		var strM = dtArray[3];
		var strD = dtArray[5];
		
		if(parseInt(strM)<10 && strM.length!=2)
			var strM = '0'+strM;
		if(parseInt(strD)<10 && strD.length!=2)
			var strD = '0'+strD;
		$('#txtbirthday').val(dtArray[1]+'/'+strM+'/'+strD);
		
	}
	

	//Checks for mm/dd/yyyy format.
	dtMonth = dtArray[3];
	dtDay= dtArray[5];
	dtYear = dtArray[1];
	
	if(parseInt(dtYear)<1901)
		return false;
		
	checkDateCurrent(dtDay,dtMonth,dtYear);
	if(checkDateCurrent(dtDay,dtMonth,dtYear)){
	
		if (dtMonth < 1 || dtMonth > 12) 
			return false;
		else if (dtDay < 1 || dtDay> 31) 
			return false;
		else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31) 
			return false;
		else if (dtMonth == 2) 
		{
			var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
			if (dtDay> 29 || (dtDay ==29 && !isleap)) 
				return false;
		}
		return true;
	} else return false;
}
function checkDateCurrent(day, month, year)
{
	if(parseInt(year)<1900){
		return false;
	}
	var regd = new RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})\$");

	var date = month + "/" + day + "/" + year;
	var date = new Date(date);
	var today = new Date();

	var vdob = regd.test(date);

	if(date.getDate() != day || (date.getTime()>today.getTime()))
	{
		return false;
	}
	return true;
}