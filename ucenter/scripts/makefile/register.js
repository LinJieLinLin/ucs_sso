function checkUser() {

	var username = $('#username').val();
	$("#usr-icon").css('display', 'block');

	var email = isEmail(username);

	if (email) {
		if (isEmail(username)) {
			// $("#usr-field").removeClass("erro-text");
			// $("#usrinfo").removeClass("erro-info");
			// $("#usrinfo").text("");
			// $("#usrinfo").css('display', 'none');
		} else {
			$("#usrinfo").text("邮箱地址不正确，请重新输入");
			$("#usrinfo").addClass("erro-info");
			$("#usr-field").addClass("erro-text");
			$("#usrinfo").css('display', 'block');
			return false;
		}
	}else if (username.length < 2 || username.length > 20) {
		$("#usrinfo").text("用户名长度只能在2-20字符之间");
		$("#usrinfo").addClass("erro-info");
		$("#usr-field").addClass("erro-text");
		$("#usr-icon").attr('class', 'g-icon erro');
		$("#usrinfo").css('display', 'block');
		return false;
	}else if(!checkUserName(username)){
		$("#usrinfo").text("用户名不应包含空格或特殊字符");
		$("#usrinfo").addClass("erro-info");
		$("#usr-field").addClass("erro-text");
		$("#usr-icon").attr('class','g-icon erro');
		$("#usrinfo").css('display','block');
		return false;
	}else {
		$("#usrinfo").text("");
		$("#usrinfo").css('display', 'none');
		// $("#usrinfo").removeClass("erro-info");
		// $("#usr-field").removeClass("erro-text");
		$("#usr-icon").attr('class', 'g-icon succ');
		// $("#usrinfo").css('display', 'none');
	}


	var phone = isPhone(username);

	$.ajax({
		url: "api/checkUser",
		data: {
			usr: $("#username").val()
		},
		dataType: "json",
		success: function(msg) {
			//0表示用户已存在  1不存在
			if (msg.code == 0) {
				if (phone) {
					$("#usrinfo").text("该手机号已经被注册");
				} else if (email) {
					$("#usrinfo").text("该邮箱已经被注册");
				} else {
					$("#usrinfo").text("该用户名已经被注册");
				}

				$("#usrinfo").addClass("erro-info");
				$("#usr-field").addClass("erro-text");
				$("#usr-icon").attr('class', 'g-icon erro');
				$("#usrinfo").css('display', 'block');
				isOk = false;
			} else {
				$("#usr-icon").css('display', 'block');
				$("#usrinfo").removeClass("erro-info");
				$("#usr-field").removeClass("erro-text");
				$("#usr-icon").attr('class', 'g-icon succ');
				$("#usrinfo").css('display', 'none');
				localStorage.registName = $("#username").val();
			}
		}
	});
}

function checkUserName(name) {
    var reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,20}$/;
    return reg.test(name);
}
function isEmail(email) {
	var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
	return reg.test(email);
}

// function strictEmail(email)
// {
// 	var reg = /^[A-Za-z0-9]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
// 	var res = reg.test(email);
// 	return res;
// }

function isPhone(phone) {
	var reg = /^(13[0-9]|15[0|3|6|7|8|9]|18[8|9])\d{8}$/;
	var res = reg.test(phone);
	return res;
}

function checkPwd() {
	$("#pwd-icon").css('display', 'block');
	var pwd = $('#password').val();
	if (pwd.length < 6 || pwd.length > 20) {
		$("#pwderr").text("密码长度只能在6-20位字符之间");
		$("#pwd-icon").attr('class', 'g-icon erro');
		$("#pwd-field").addClass("erro-text");
		$("#pwderr").addClass("erro-info");
		$("#pwderr").css("display", 'block');
		return false;
	} else {
		$("#pwderr").text("");
		$("#pwd-icon").attr('class', 'g-icon succ');
		$("#pwd-field").removeClass("erro-text");
		$("#pwderr").removeClass("erro-info");
		$("#pwderr").css("display", 'none');
		return true;
	}
}


function comparePwd() {
	$("#pwd2-icon").css('display', 'block');
	var pwd2 = $("#password2").val();
	if (pwd2.length < 6 || pwd2.length > 20) {
		$("#pwderr2").text("密码长度只能在6-20位字符之间");
		$("#pwd2-field").addClass("erro-text");
		$("#pwderr2").addClass("erro-info");
		$("#pwd2-icon").attr('class', 'g-icon erro');
		$("#pwderr2").css('display', 'block');
		return false;
	}

	var pwd = $("#password").val();
	if (pwd != pwd2) {
		$("#pwd2-icon").attr('class', 'g-icon erro');
		$("#pwderr2").text("两次输入密码不一致");
		$("#pwderr2").addClass("erro-info");
		$("#pwd2-field").addClass("erro-text");
		return false;
	} else {
		$("#pwderr2").text("");
		$("#pwd2-icon").attr('class', 'g-icon succ');
		$("#pwd2-field").removeClass("erro-text");
		$("#pwderr2").removeClass("erro-info");
		$("#pwderr2").css('display', 'none');
		return true;
	}
}


function promptedUsr() {
	$("#usrinfo").css('display', 'block');
	$("#usr-icon").css('display', 'none');
	$("#usr-field").removeClass("erro-text");
	$("#usrinfo").removeClass("erro-info");

	$("#usrinfo").text("请输入邮箱/用户名/手机号");
	$('#usr-close').show();
}

function promptedPwd() {
	$("#pwderr").css('display', 'block');
	$("#pwd-icon").css('display', 'none');
	$("#pwd-field").removeClass("erro-text");
	$("#pwderr").removeClass("erro-info");
	// var pwd = $('#password').val();
	// if (pwd == "") {
	$("#pwderr").text("6-20位字符,可使用字母、数字或符号的组合,不建议使用纯数字,纯字母,线符号");
	// }
}

function promptedPwd2() {
	$("#pwderr2").css('display', 'block');
	$("#pwd2-icon").css('display', 'none');
	$("#pwd2-field").removeClass("erro-text");
	$("#pwderr2").removeClass("erro-info");

	$("#pwderr2").text("请再次输入密码");
}


$(document).ready(function() {
	changeCaptcha();
	// setTimeout(changeCaptcha(),1000);
});

function changeCaptcha() {
	$.ajax({
			url: "api/captcha?id=" + new Date().getTime(),
			dataType: "json",
			success: function(date) {},
			error: function() {
				$("#hideCode").css('display', 'inline-block');
			}
		})
		//$("#captcha-img").attr('src','api/captcha');
	var img = document.getElementById('captcha-img');
	img.src = img.src;
	//img.location.reload();
}


function checkService() {
	if ($('#checkbox').is(':checked') == true) {
		$("#service-info").css('display', "none");
		return true;
	} else {
		$("#service-info").css('display', "inline-block");
		return false;
	}
}


var flag = false;

function submit() {
	var username = $('#username').val();
	// $("#usr-icon").css('display', 'block');

	var email = isEmail(username);

	if (email) {
		if (isEmail(username)) {

		} else {
			$("#usrinfo").text("邮箱地址不正确，请重新输入");
			$("#usrinfo").addClass("erro-info");
			$("#usr-field").addClass("erro-text");
			$("#usrinfo").css('display', 'block');
			return false;
		}

	}
	if (username.length < 2 || username.length > 20) {
		$("#usrinfo").text("用户名长度只能在2-20字符之间");
		$("#usrinfo").addClass("erro-info");
		$("#usr-field").addClass("erro-text");
		$("#usr-icon").attr('class', 'g-icon erro');
		$("#usrinfo").css('display', 'block');
		return false;
	} else {
		$("#usrinfo").text("");
		$("#usrinfo").css('display', 'none');
	}
	if (checkPwd() && comparePwd()) {

		var phone = isPhone(username);

		if (flag) {
			return;
		}
		flag = true;
		$("#submitReg").text("注册中...")
		$.ajax({
			url: "api/checkUser",
			data: {
				usr: $("#username").val().replace(/ /g,'')
			},
			dataType: "json",
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				flag = false;
				console.log(XMLHttpRequest);
				alert(XMLHttpRequest.status+": "+XMLHttpRequest.statusText);
				$("#submitReg").text("注册")
			},
			success: function(msg) {
				//0表示用户已存在  1不存在
				flag = false;
				if (msg.code == 0) {
					if (phone) {
						$("#usrinfo").text("该手机号已经被注册");
					} else if (email) {
						$("#usrinfo").text("该邮箱已经被注册");
					} else {
						$("#usrinfo").text("该用户名已经被注册");
					}

					$("#submitReg").text("注册");
					$("#usrinfo").addClass("erro-info");
					$("#usr-field").addClass("erro-text");
					$("#usr-icon").attr('class', 'g-icon erro');
					$("#usrinfo").css('display', 'block');
					isOk = false;
				} else {
					$("#usr-icon").css('display', 'block');
					$("#usrinfo").removeClass("erro-info");
					$("#usr-field").removeClass("erro-text");
					$("#usr-icon").attr('class', 'g-icon succ');
					$("#usrinfo").css('display', 'none');
					subSrv();
				}
			}
		});
	}

}

var flag2 = false;

function subSrv() {
	var tmp = $("#username").val();
	var phone;
	var email;

	if (isEmail(tmp)) {
		email = tmp;
	} else if (isPhone(tmp)) {
		phone = tmp;
	}
	// console.log("email:"+email);
	// alert("email:"+email)
	if (flag2) {
		return;
	}
	flag2 = true;
	$("#submitReg").text("注册中...");

	$.ajax({
		url: "api/addUser",
		data: {
			captchacode: $("#captcha").val(),
			usr: tmp,
			R_PHONE: phone,
			R_EMAIL: email,
			pwd: $("#password").val()
		},
		dataType: "json",
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log(XMLHttpRequest);
			$("#submitReg").text("注册");
			alert(XMLHttpRequest.status+": "+XMLHttpRequest.statusText);
			flag2 = false;
		},
		success: function(msg) {
			flag2 = false;
			//0表示用户已存在  1不存在
			if (msg.code == 0) {
				// alert("添加用户成功");
				var url = getQueryString("url");
				localStorage.registName = '';
				if (url == "" || url == "#") {
				    location.href = "/ucenter/my.html";
				} else {
				    if(url.search("\\?")!=-1){
				        if(url.search("#")!=-1){
				            url = url.replace("#","&token="+GetCookie("token")+"#");
				        }else{
				            url = url+"&token="+GetCookie("token");
				        }
				    }else{
				        if(url.search("#")!=-1){
				            url = url.replace("#","?token="+GetCookie("token")+"#");
				        }else{
				            url = url+"?token="+GetCookie("token");
				        }
				    }
				    location.href = url;
				}
			} else {
				$("#submitReg").text("注册");
				changeCaptcha();
				alert(msg.msg);
			}
			// if (msg.code == 0 && email == undefined) {
			// 	// alert("添加用户成功");
			// 	var url = getQueryString("url");
			// 	window.location.href = "registerSuc.html?url=" + escape(url);
			// } else if (msg.code == 0 && email != "") {
			// 	window.location.href = "checkEmail.html?url=" + escape(email);
			// } else {
			// 	changeCaptcha();
			// 	alert(msg.msg);
			// }
		}
	});
}

function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');    //把cookie分割成组
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];                      //取得字符串
		while (c.charAt(0) == ' ') {          //判断一下字符串有没有前导空格
			c = c.substring(1, c.length);      //有的话，从第二位开始取
		}
		if (c.indexOf(nameEQ) == 0) {       //如果含有我们要的name
			return unescape(c.substring(nameEQ.length, c.length));    //解码并截取我们要值
		}
	}
	return false;
}

//清除cookie

function clearCookie(name) {
	setCookie(name, "", -1);
}

//设置cookie

function setCookie(name, value, seconds) {
	seconds = seconds || 0;   //seconds有值就直接赋值，没有为0，这个根php不一样。
	var expires = "";
	if (seconds != 0) {      //设置cookie生存时间
		var date = new Date();
		date.setTime(date.getTime() + (seconds * 1000));
		expires = "; expires=" + date.toGMTString();
	}
	document.cookie = name + "=" + escape(value) + expires + "; path=/";   //转码并赋值
}

function Createing() {
	binApp.alert("<span class='h4'>正在建设中...</span>", {
		action: "top"
	});
}

function getQueryString(name) {
	if (location.href.indexOf("?") == -1 || location.href.indexOf(name + '=') == -1) {
		return '';
	}

	var queryString = location.href.substring(location.href.indexOf("?") + 1);

	var parameters = queryString.split("&");

	var pos, paraName, paraValue;
	for (var i = 0; i < parameters.length; i++) {
		pos = parameters[i].indexOf('=');
		if (pos == -1) {
			continue;
		}

		paraName = parameters[i].substring(0, pos);
		paraValue = parameters[i].substring(pos + 1);

		if (paraName == name) {
			return unescape(paraValue.replace(/\+/g, " "));
		}
	}
	return '';
};

function thirdSubmit()
{

	var username = $('#username').val();
	// $("#usr-icon").css('display', 'block');

	var email = isEmail(username);

	if (email) {
		if (isEmail(username)) {

		} else {
			$("#usrinfo").text("邮箱地址不正确，请重新输入");
			$("#usrinfo").addClass("erro-info");
			$("#usr-field").addClass("erro-text");
			$("#usrinfo").css('display', 'block');
			return false;
		}

	}
	if (username.length < 2 || username.length > 20) {
		$("#usrinfo").text("用户名长度只能在2-20字符之间");
		$("#usrinfo").addClass("erro-info");
		$("#usr-field").addClass("erro-text");
		$("#usr-icon").attr('class', 'g-icon erro');
		$("#usrinfo").css('display', 'block');
		return false;
	} else {
		$("#usrinfo").text("");
		$("#usrinfo").css('display', 'none');
	}
	if (checkPwd() && comparePwd()) {

		var phone = isPhone(username);

		if (flag) {
			return;
		}
		flag = true;
		$("#submitReg").text("注册中...")
		$.ajax({
			url: "api/checkUser",
			data: {
				usr: $("#username").val()
			},
			dataType: "json",
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				flag = false;
				console.log(XMLHttpRequest);
				alert(XMLHttpRequest.status+": "+XMLHttpRequest.statusText);
				$("#submitReg").text("注册")
			},
			success: function(msg) {
				//0表示用户已存在  1不存在
				flag = false;
				if (msg.code == 0) {
					if (phone) {
						$("#usrinfo").text("该手机号已经被注册");
					} else if (email) {
						$("#usrinfo").text("该邮箱已经被注册");
					} else {
						$("#usrinfo").text("该用户名已经被注册");
					}

					$("#submitReg").text("注册");
					$("#usrinfo").addClass("erro-info");
					$("#usr-field").addClass("erro-text");
					$("#usr-icon").attr('class', 'g-icon erro');
					$("#usrinfo").css('display', 'block');
					isOk = false;
				} else {
					$("#usr-icon").css('display', 'block');
					$("#usrinfo").removeClass("erro-info");
					$("#usr-field").removeClass("erro-text");
					$("#usr-icon").attr('class', 'g-icon succ');
					$("#usrinfo").css('display', 'none');
					thirdSubSrv();
				}
			}
		});
	}

}

var thirdflag2 = false;

function thirdSubSrv() {
	var tmp = $("#username").val();
	var tid = getQueryString("tid");
	var types = getQueryString("types");
	var phone;
	var email;

	if (isEmail(tmp)) {
		email = tmp;
	} else if (isPhone(tmp)) {
		phone = tmp;
	}
	// console.log("email:"+email);
	// alert("email:"+email)
	if (thirdflag2) {
		return;
	}
	flag2 = true;
	$("#submitReg").text("注册中...");

	$.ajax({
		url: "api/addUser",
		data: {
			captchacode: $("#captcha").val(),
			usr: tmp,
			R_PHONE: phone,
			R_EMAIL: email,
			pwd: "123456",
			R_ID_THIRD:tid,
			R_ID_THIRD_TYPE:types
		},
		dataType: "json",
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log(XMLHttpRequest);
			$("#submitReg").text("注册");
			alert(XMLHttpRequest.status+": "+XMLHttpRequest.statusText);
			thirdflag2 = false;
		},
		success: function(msg) {
			thirdflag2 = false;
			//0表示用户已存在  1不存在
			if (msg.code === 0){
				// alert("添加用户成功");
				$.ajax({
					url: "api/t/updateUserAttr",
					data :{
						R_ID_THIRD:tid
					},
					dataType: "json",
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						console.log(XMLHttpRequest);
						alert(XMLHttpRequest.status+": "+XMLHttpRequest.statusText);
					},
					success: function(msg) {
						if(msg.code==0){
							var url = getQueryString("url");
							window.location.href = "registerSuc.html?url=" + escape(url);
						}
					}
				});
			} else {

				$("#submitReg").text("注册");
				changeCaptcha();
				alert(msg.msg);
			}
		}
	});
}

function cleanUsr() {
    $("#username").val('');
    localStorage.registName = $("#username").val();
    $("#username").focus();
    promptedUsr();
}
$(function() {
	$('#usr-close').hide();
    function init() {
        if (localStorage.registName) {
            setTimeout(function() {
                $("#username").val(localStorage.registName);
            }, 0);
        }
    }
    init();
});

