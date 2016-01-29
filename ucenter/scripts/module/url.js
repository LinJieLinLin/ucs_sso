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

function homePage() {
	var url_t = getQueryString("url");
	if (url_t == '') {
		console.log("equal");
		window.location.href = "#";
		return;
	}
	var url = decodeURIComponent(url_t);
	var pattern = /^(http:\/\/)?([^\/]+)/i;
	var mts = pattern.exec(url);
	if (mts != null) {
		console.log(mts[0]);
		window.location.href = mts[0];
	}
}

function logoutR() {
	var url_t = getQueryString("url");
	try {
	    WB2.logout(function() {
	        //alert("logOut");
	    });
	    QC.Login.signOut();
	} catch (e) {};

	
	clearCookie();
	localStorage.token = '';
	if (url_t == '') {
	    window.location.href = ssoUrl + "/sso/api/logout?url=http://"+location.host+"/sso/";
		return;
	};
	var url = decodeURIComponent(url_t);
	var pattern = /^(http:\/\/)?([^\/]+)/i;
	var mts = pattern.exec(url);
	if (mts != null) {
		console.log(mts[0]);
		window.location.href = "/sso/api/logout?url=" + encodeURIComponent(mts[0]);
	}
}

function clearCookie(){
	var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
	if (keys) {
		for (var i =  keys.length; i--;)
			document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString()
	}
}