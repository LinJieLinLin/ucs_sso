

var isOk;

function checkUser()
{
	
	var username = $('#username').val();
	$("#usr-icon").css('display','block');

	if (isEmail(username)) {
		if (strictEmail(username)) {
			$("#usr-field").removeClass("erro-text");
			$("#usrinfo").removeClass("erro-info");
			$("#usrinfo").text("");
			$("#usrinfo").css('display','none');
		}else{
			$("#usrinfo").text("邮箱地址不正确，请重新输入");
			$("#usrinfo").addClass("erro-info");
			$("#usr-field").addClass("erro-text");
			$("#usrinfo").css('display','block');
			return false;
		}
		
	}
	if (username.length < 3 || username.length > 20) {
		$("#usrinfo").text("用户名长度只能在3-20字符之间");
		$("#usrinfo").addClass("erro-info");
		$("#usr-field").addClass("erro-text");
		$("#usr-icon").attr('class','g-icon erro');
		$("#usrinfo").css('display','block');
		return false;
	}else{
		$("#usrinfo").text("");
		$("#usrinfo").removeClass("erro-info");
		$("#usr-field").removeClass("erro-text");
		$("#usr-icon").attr('class','g-icon succ');
		$("#usrinfo").css('display','none');
	}


	$.ajax({
		url:"api/checkUser",
		data:{usr:$("#username").val()},
		dataType:"json",
		success:function(msg){
			//0表示用户已存在  1不存在
			if (msg.code == 0) {
					$("#usrinfo").text("该用户名已被使用");
					$("#usrinfo").addClass("erro-info");
					$("#usr-field").addClass("erro-text");
					$("#usr-icon").attr('class','g-icon erro');
					$("#usrinfo").css('display','block');
					isOk = false;
			}else{
			  isOk = true;
			}
		}
		});
}

function isEmail(email){ 
	var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; 
	return reg.test(email); 
} 

function strictEmail(email)
{
	var reg = /^[A-Za-z0-9]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
	var res = reg.test(email);
	return res;
}

function isPhone(phone)
{
	var reg=/^(13[0-9]|15[0|3|6|7|8|9]|18[8|9])\d{8}$/;
	var res = reg.test(phone);
	return res;
}

function checkPwd()
{
	$("#pwd-icon").css('display','block');
	var pwd = $('#password').val();
	if (pwd.length < 6 || pwd.length > 20) {
		$("#pwderr").text("密码长度只能在6-20位字符之间");
		$("#pwd-icon").attr('class','g-icon erro');
		$("#pwd-field").addClass("erro-text");
		$("#pwderr").addClass("erro-info");
		$("#pwderr").css("display",'block');
		return false;
	}else{
		$("#pwderr").text("");
		$("#pwd-icon").attr('class','g-icon succ');
		$("#pwd-field").removeClass("erro-text");
		$("#pwderr").removeClass("erro-info");
		$("#pwderr").css("display",'none');
		return true;
	}
}


function comparePwd()
{
	$("#pwd2-icon").css('display','block');
	var pwd2 = $("#password2").val();
	if (pwd2.length < 6 || pwd2.length > 20) {
		$("#pwderr2").text("密码长度只能在6-20位字符之间");
		$("#pwd2-field").addClass("erro-text");
		$("#pwderr2").addClass("erro-info");
		$("#pwd2-icon").attr('class','g-icon erro');
		$("#pwderr2").css('display','block');
		return false;
	}

	var pwd = $("#password").val();
	if (pwd != pwd2) {
		$("#pwd2-icon").attr('class','g-icon erro');
		$("#pwderr2").text("两次输入密码不一致");
		$("#pwderr2").addClass("erro-info");
		$("#pwd2-field").addClass("erro-text");
		return false;
	}else{
		$("#pwderr2").text("");
		$("#pwd2-icon").attr('class','g-icon succ');
		$("#pwd2-field").removeClass("erro-text");
		$("#pwderr2").removeClass("erro-info");
		$("#pwderr2").css('display','none');
		return true;
	}
}


function promptedUsr()
{
	$("#usrinfo").css('display','block');
	$("#usr-icon").css('display','none');
	$("#usr-field").removeClass("erro-text");
	$("#usrinfo").removeClass("erro-info");

	$("#usrinfo").text("请输入邮箱/用户名/手机号");
}

function promptedPwd()
{
	$("#pwderr").css('display','block');
	$("#pwd-icon").css('display','none');
	$("#pwd-field").removeClass("erro-text");
	$("#pwderr").removeClass("erro-info");
	// var pwd = $('#password').val();
	// if (pwd == "") {
	$("#pwderr").text("6-20位字符,可使用字母、数字或符号的组合,不建议使用纯数字,纯字母,线符号");
	// }
}

function promptedPwd2()
{
	$("#pwderr2").css('display','block');
	$("#pwd2-icon").css('display','none');
	$("#pwd2-field").removeClass("erro-text");
	$("#pwderr2").removeClass("erro-info");

	$("#pwderr2").text("请再次输入密码");
}


function changeCaptcha () {
	$("#captcha-img").attr('src','api/captcha');
}


function checkService()
{
	if($('#checkbox').is(':checked') == true) 
	{
		return true;
	}else{
		alert("no");
		return false;
	}
}

function submit()
{

	if (checkUser() == undefined && isOk && checkPwd() && comparePwd() && checkService()) {

		var tmp = $("#username").val();
		var phone;
		var email;
		if (strictEmail(tmp)) {
			email = tmp;
		}else if(isPhone(tmp)){
			phone = tmp;
		}

	$.ajax({
	    url:"api/addUser",
		data:{captchacode:$("#captcha").val(),usr:tmp,R_PHONE:phone,R_EMAIL:email,pwd:$("#password").val()},
		dataType:"json",
		success:function(msg){
			//0表示用户已存在  1不存在
			if (msg.code == 0) {
				alert("添加用户成功");
			}else{
				changeCaptcha();
				alert(msg.msg);
			}
		}
		});
	};

}


