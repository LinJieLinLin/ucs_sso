SSO.controller("approveDetailCtrl",["$scope","request","$rootScope","$timeout",function(t,r,s,e){var a={};t.init=function(){t.userList=[],t.verifyData={},t.search={key:ssoC.queryString("usr"),field:""},a=ssoC.readConfig("sso"),t.initUrl(),t.getUserList()},t.initUrl=function(){t.requestUrl={searchUser:a.rUrl+"cert/api/list",updateCert:a.rUrl+"cert/api/update"}},t.getUserList=function(){if(!t.search.key)return void ssoC.redirect(!1,"个人中心");var s={usr_filter:t.search.key,status_filter:"",p:"1",pn:1,ps:10},e={method:"GET",url:t.requestUrl.searchUser,params:{param:JSON.stringify(s)}};r(e).then(function(r){console.log(r),t.userList=r.data,angular.forEach(t.userList,function(r,s){r.attrs&&("1"===r.attrs.certification.status?r.status="未审核":"false"===r.attrs.pass.status&&"2"===r.attrs.certification.status?r.status="不通过":"true"===r.attrs.pass.status&&(r.status="已通过"),r.usr[0]===ssoC.queryString("usr")&&(t.verifyData=r))})},function(t){console.log(t)})},t.updateCert=function(s){if(!t.verifyData.id)return void console.log("用户信息有误");var a=s?"true":"false",i={attrs:{pass:{status:a}},id:t.verifyData.id},o={method:"POST",url:t.requestUrl.updateCert,data:angular.toJson(i),params:{}};r(o).then(function(t){var r="操作成功！";try{binApp.alert(r,{action:"top"})}catch(s){alert(r)}e(function(){ssoC.redirect(!1,"审核列表")},1e3)},function(t){console.log(t)})},t.$on("login",function(r,s){var e="";return s.login?(ssoC.checkAdmin(s),t.userInfo=s,void console.log(s)):(e=location.origin+location.pathname,void ssoC.redirect(!1,"登录",{url:encodeURIComponent(e)}))}),t.init()}]);