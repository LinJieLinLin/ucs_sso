var g_ul;

function OnULOk(ul) {

    C4js.UL.AddI("id-img-positive");

    C4js.UL.AddI("id-img-back1");
    C4js.UL.AddI("id-img-hand");
    C4js.UL.OnSuccess = function(f, data, e) {
        console.log(f, data, e);
        console.log(f);
        console.log(e);
        console.log(data.data);
    };
    C4js.UL.OnErr = function(f, data, e) {
        console.log(f, data, e);
        // commonUtil.alertMsg("上传失败");
        console.log("上传失败");
    };
    g_ul = ul;
    ul.Uer.Args.pub = 0;
}
$(function() {
    var getQueryString = function(name) {
        var reg = new RegExp(name + "=([^&]*)");
        var r = window.location.href.match(reg);
        if (r != null)
            return decodeURI(r[1]);
        return null;
    };
    var token = window.getToken();
    //    alert(token);
    if (token == "" || token == null) {
        // commonUtil.alertMsg("非法操作");
        console.log("非法操作");

        return;
    }

    $("#c").load(g_conf.FSRV_URL+"/srv/uloader.html" + "?token=" + token)
});


function getToken() {
    var getCookie = function(c_name) {
        if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(c_name + "=")
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1
                var c_end = document.cookie.indexOf(";", c_start)
                if (c_end == -1) c_end = document.cookie.length
                return unescape(document.cookie.substring(c_start, c_end))
            }
        }
        return ""
    };
    return getCookie("token");
}