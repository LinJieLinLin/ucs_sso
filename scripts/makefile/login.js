document.onkeydown = function(event_e) {
    if (window.event) {
        event_e = window.event;
    }

    var int_keycode = event_e.charCode || event_e.keyCode;
    if (int_keycode == '13') {
        //your handler function,please.  
        loginSSO();
        return false;
    }
}
localStorage.setItem("urlLocation", getQueryString("url"));

function usrFocus() {
    // body...
    $("#usr-green").addClass("focus");
    $("#usr-green").removeClass("erro-text");
    $("#usr-tips").css("display", "none");
}


function Createing() {
    binApp.alert("<span class='h4'>正在建设中...</span>", {
        action: "top"
    });
}


function usrBlur() {
    $("#usr-green").removeClass("focus");
    localStorage.userName = $("#usr").val();
}

// erro-text


function pwdFocus() {
    $("#pwd-green").addClass("focus");
    $("#pwd-green").removeClass("erro-text");
    $("#pwd-tips").css("display", "none");
}


function pwdBlur() {
    $("#pwd-green").removeClass("focus");
}


function checkUsr() {
    var usr = $("#usr").val();
    if (usr.length == 0) {
        $("#usr-green").removeClass("focus");
        $("#usr-green").addClass("erro-text");
        $("#usr-tips").css("display", "block");
        return false;
    }
    return true;
}

function checkPwd() {
    var pwd = $("#pwd").val();
    if (pwd.length == 0) {
        $("#pwd-green").removeClass("focus");
        $("#pwd-green").addClass("erro-text");
        $("#pwd-tips").css("display", "block");
        return false;
    }
    return true;
}

function register() {
    var url = $("#url").val();
    // alert(url);

    window.location.href = "../ucenter/register.html?url=" + escape(url);
    // href="../ucenter/www/register.html" 
}


var flag = false;

function loginSSO() {
    if (checkUsr() && checkPwd()) {
        if (flag) {
            return;
        }
        flag = true;
        $("#login").text("正在登录...");
        $.ajax({
            url: "api/login?time=" + new Date().getTime(),
            data: {
                usr: $("#usr").val(),
                pwd: $("#pwd").val()
            },
            dataType: "json",
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
                $("#login").text("登录");
                if (XMLHttpRequest.status == 0 && XMLHttpRequest.statusText == 'error') {
                    location.reload();
                } else {
                    alert(XMLHttpRequest.status + ": " + XMLHttpRequest.statusText);
                }

                flag = false;
            },
            success: function(msg) {
                //0表示用户已存在  1不存在 
                $("#login").text("登录");
                flag = false;
                if (msg.code == 0) {
                    var url = $("#url").val();
                    var userInfo = msg.data.usr;
                    if (userInfo.BAttr && userInfo.BAttr.HELP && userInfo.BAttr.HELP[0] && userInfo.BAttr.HELP[0].val == 1) {
                        var type = url.match(/(http|https):\/\//)[0];
                        var u = type + url.split(type)[1].split('/')[0] + '/guidance-space.html' + '?token=' + msg.data.token;
                        window.location.href = u;
                        return;
                    }
                    if (url === "") {
                        window.location.href = "/ucenter/my.html?token=" + msg.data.token;
                        return;
                    }
                    var urlArr = url.split("#");
                    url = urlArr[0];
                    var hash = urlArr[1] ? "#" + urlArr[1] : '';
                    if (url.match("^.*\\?.*$")) {
                        window.location.href = url + "&token=" + msg.data.token + hash;
                    } else {
                        window.location.href = url + "?token=" + msg.data.token + hash;
                    }

                } else {
                    $("#pwd").val("");
                    $("#pwd").focus();
                    alert(msg.msg);
                }
            }
        });
    }
}
//var ttp=false;
var intervalProcess;
var intervalProc;

function qqLogin() {
    //alert("qq login test")
    //QC.Login({}, function (reqData, opts) {//登录成功
    //		qqLoginSrv();
    //	}
    //);
    QC.Login.showPopup();
    $("#login").text("正在登录...");
    intervalProcess = setInterval("checkQQLogin()", 500);
}

function checkQQLogin() {
    try {
        if (QC.Login.check()) {
            clearInterval(intervalProcess);
            qqLoginSrv();
        }
    } catch (e) {

    }
}
checkQQLogin();
var qqMsg;

function qqLoginSrv() {
    QC.Login.getMe(function(openId, accessToken) {
        $.ajax({
            url: "api/findRegister?time=" + new Date().getTime(),
            data: {
                R_ID_THIRD: openId,
                p: 1,
                R_ID_THIRD_TYPE: "QQ",
                access_token: accessToken
            },
            dataType: "json",
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
                $("#login").text("登录");
                alert(XMLHttpRequest.status + ": " + XMLHttpRequest.statusText);
                flag = false;
            },
            success: function(msg) {
                //0表示用户已存在  1不存在
                $("#login").text("登录");
                flag = false;
                if (msg.code == 0) {
                    qqMsg = msg;
                    QC.Login.signOut();
                    intervalProc = setInterval("checkQQLogout()", 500);
                } else {
                    $("#pwd").val("");
                    $("#pwd").focus();
                    alert(msg.msg);
                }
            }
        });
    });
}

function checkQQLogout() {
    if (!QC.Login.check()) {
        clearInterval(intervalProc);
        var url = $("#url").val();
        if (url == "") {
            window.location.href = "/ucenter/my.html?token=" + qqMsg.data.token;
            return;
        }
        if (url.match("^.*\\?.*$")) {
            window.location.href = url + "&token=" + qqMsg.data.token;
        } else {
            window.location.href = url + "?token=" + qqMsg.data.token;
        }
    }
}

try {
    WB2.anyWhere(function(W) {
        W.widget.connectButton({
            id: "wb_connect_btn",
            type: '3,2',
            callback: {
                login: function(o) { //登录后的回调函数
                    console.log(o);
                    console.log(binApp.getCookie("weibojs_886838876").split('%26')[0].split('%3D')[1]);
                    //alert("login: " + o.screen_name)
                    $("#login").text("正在登录...");
                    $.ajax({
                        url: "api/findRegister?time=" + new Date().getTime(),
                        data: {
                            R_ID_THIRD: o.id,
                            R_ID_THIRD_TYPE: "SINA",
                            access_token: binApp.getCookie("weibojs_886838876").split('%26')[0].split('%3D')[1]
                        },
                        dataType: "json",
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            console.log(XMLHttpRequest);
                            $("#login").text("登录");
                            alert(XMLHttpRequest.status + ": " + XMLHttpRequest.statusText);
                            flag = false;
                        },
                        success: function(msg) {
                            //0表示用户已存在  1不存在
                            $("#login").text("登录");
                            flag = false;
                            if (msg.code == 0) {
                                WB2.logout(function() {
                                    //alert("logOut");
                                    var url = $("#url").val();
                                    if (url == "") {
                                        window.location.href = "/ucenter/my.html?token=" + msg.data.token;
                                        return;
                                    }
                                    if (url.match("^.*\\?.*$")) {
                                        window.location.href = url + "&token=" + msg.data.token;
                                    } else {
                                        window.location.href = url + "?token=" + msg.data.token;
                                    }
                                });
                            } else {
                                $("#pwd").val("");
                                $("#pwd").focus();
                                alert(msg.msg);
                            }
                        }
                    });
                },
                logout: function() { //退出后的回调函数
                    alert('logout');
                }
            }
        });
    });
} catch (e) {}


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
}

try {
    var obj = new WxLogin({
        id: "login_container",
        appid: "wx5fb6df7812f77588",
        scope: "",
        redirect_uri: "sso.t.jxzy.com",
        state: "",
        style: "",
        href: ""
    });
} catch (e) {}

function cleanUsr() {
    $("#usr").val('');
    localStorage.userName = $("#usr").val();
}


$(function() {
    function init() {
        if (localStorage.userName) {
            setTimeout(function() {
                $("#usr").val(localStorage.userName);
            }, 0);
        }
    }
    init();
});
