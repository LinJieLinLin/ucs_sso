try{directiveSso}catch(e){directiveSso=angular.module("directiveSso",[])}directiveSso.directive("loginSso",function(){return{templateUrl:"js/directive/login/login.html",restrict:"E",replace:!0,transclude:!0,scope:{c:"="},controller:["$scope","$timeout","$http","request","$element",function(t,c,n,o,a){var r="http://localhost:7700/";t.lData={},t.msg={},t.focus={},t.regExp={account:/^[a-zA-Z0-9_\u4e00-\u9fa5]{2,50}$/,email:/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,tel:/^1[3|4|5|7|8][0-9]\d{8}$/,id:/(^\d{15}$)|(^\d{17}([0-9]|X)$)/},t.readConfig=function(e){var c={};if(t.c)c=t.c;else try{c=DYCONFIG[e]}catch(n){}return c.rUrl&&"/"!==c.rUrl[c.rUrl.length-1]&&(c.rUrl+="/"),c.rUrl},t.initUrl=function(){t.requestUrl={login:r+"sso/api/login",eg:r+"api"}},t.init=function(){r=t.readConfig("sso")||r,t.loginText="登录",localStorage.account&&(t.lData.account=localStorage.account),t.initUrl()},t.init(),t.keydown=function(c){e=c?c:window.event?window.event:null,13==e.keyCode&&t.loginSso()},t.checkFocus=function(e){t.focus[e]=1},t.checkFunc={},t.checkFunc.account=function(e){try{$("#account").attr("placeholder")!=$("#account").val()&&(e.account=$("#account").val(),e.password=$("#pwd").val())}catch(c){}if(!e.account)return t.msg.account="请输入邮箱/用户名/手机号",-1;var n="请输入2-20位的邮箱/用户名/手机号";return t.regExp.email.test(e.account)&&(e.email=e.account,n=""),t.regExp.tel.test(e.account)&&(e.tel=e.account,n=""),t.regExp.account.test(e.account)&&(n=""),t.msg.account=n,t.msg.account?-1:(localStorage.account=t.lData.account,0)},t.checkFunc.password=function(e){return e.password?e.password.length<6?(t.msg.password="密码至少6位",-1):0:(t.msg.password="请输入密码",-1)},t.checkLoginSso=function(e,c){t.focus={},c&&(t.msg[c]="");if(!c){for(var n in t.checkFunc)if(t.checkFunc[n](e))return t.checkFunc[n](e);return 0}try{return t.checkFunc[c](e)}catch(o){return 0}};var i=function(t){var e=window.location.search.match(new RegExp("[?&]"+t+"=([^&]+)","i"));return e?decodeURIComponent(decodeURI(e[1])):""};t.register=function(){location.href="register.html"},t.loginSso=function(){if("登录"===t.loginText){var e=t.checkLoginSso(t.lData);if(-1!==e)if(0===e){var n={usr:t.lData.account,pwd:t.lData.password},a={method:"GET",url:t.requestUrl.login,params:n};t.loginText="正在登录...",o(a).then(function(e){t.loginText="登录",t.lData.password="";var c=i("url");e.data.usr;if(""===c)return void(window.location.href="my.html?token="+e.data.token);var n=c.split("#");c=n[0];var o=n[1]?"#"+n[1]:"";c.match("^.*\\?.*$")?window.location.href=c+"&token="+e.data.token+o:window.location.href=c+"?token="+e.data.token+o},function(e){c(function(){t.loginText="登录"},500);try{binApp.alert(e.data.data.msg||"帐号或密码错误",{action:"top"})}catch(n){alert(e.data.data.msg||"帐号或密码错误")}})}else try{binApp.alert(e,{action:"top"})}catch(r){alert(e)}}}}]}}),directiveSso.factory("request",["$http","$q",function(t,e){return function(c){return t(c).then(function(t){var c=e.defer();return angular.isUndefined(t.data.code)?c.reject({type:-1,data:t}):0!==t.data.code?c.reject({type:1,data:t}):c.resolve(t.data),c.promise},function(t){throw{type:-1,data:t}})}}]);