
function usrFocus () {
	// body...
	$("#usr-green").addClass("focus");
	$("#usr-green").removeClass("erro-text");
	$("#usr-tips").css("display","none");
}


function usrBlur() {
	$("#usr-green").removeClass("focus");
}

// erro-text


function pwdFocus () {
	$("#pwd-green").addClass("focus");
	$("#pwd-green").removeClass("erro-text");
	$("#pwd-tips").css("display","none");
}


function pwdBlur () {
	$("#pwd-green").removeClass("focus");
}


function checkUsr () {
    var usr = $("#usr").val();
    if (usr.length == 0) {
    	$("#usr-green").removeClass("focus");
    	$("#usr-green").addClass("erro-text");
    	$("#usr-tips").css("display","block");
    	return false;
    }
    return true;
}

function checkPwd () {
    var pwd = $("#pwd").val();
    if (pwd.length == 0) {
    	$("#pwd-green").removeClass("focus");
    	$("#pwd-green").addClass("erro-text");
    	$("#pwd-tips").css("display","block");
    	return false;
    }
    return true;
}
function register(){
	var url = $("#url").val();
	// alert(url);
	
	window.location.href = "../ucenter/register.html?url="+escape(url);
	// href="../ucenter/www/register.html" 
}



function loginAA() {
     if (checkUsr() && checkPwd()) {
     	$.ajax({
	    url:"api/login",
		data:{usr:$("#usr").val(),pwd:$("#pwd").val()},
		dataType:"json",
		success:function(msg){
			//0表示用户已存在  1不存在
			if (msg.code == 0) {
				// url=$("#url").val();
				// if (url == "") {
				// 	alert(99);
					window.location.href = "/ucenter/approve-admin.html?token="+msg.data.token;
				// 	return;
				// };
				// if (url.match("^.*\\?.*$")){
				// 	window.location.href=url+"&token="+msg.data.token;
				// }else{
				// 	window.location.href=url+"?token="+msg.data.token;
				// }

			}else{
				alert(msg.msg);
			}
		}
		});
     };


}