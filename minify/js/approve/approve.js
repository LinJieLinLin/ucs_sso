SSO.controller("approveCtrl",["$scope","request","$rootScope","$timeout",function(e,t,s,a){var i={};e.init=function(){e.userList=[],e.search={name:"",status:"",selectTime:""},e.searchTime={sTime:"",eTime:""},e.nowStatus="全部",e.selectList=["全部","未审核","不通过","已通过"],e.dateConfig={style:"expired",placeholder:"请选择时间",targetElement:angular.element(".no"),position:"bottom"},e.load={},e.load.getUserList=!1,i=ssoC.readConfig("sso"),e.initUrl()},e.initUrl=function(){e.requestUrl={searchUser:i.rUrl+"cert/api/list"}},e.initGetUserList=function(){e.pageUserList={change:!0,pn:1,ps:10}},e.changeSearch=function(t,s){if("u"===s){e.search.name=t;var a=function(e,t){return e+=" 00:00:00",t?t?new Date(new Date(e).getTime()+864e5).getTime():void 0:new Date(e).getTime()};if(e.searchTime.sTime&&e.searchTime.eTime){var i=a(e.searchTime.sTime),r=a(e.searchTime.eTime,1);if(i>r){var n="开始时间不能大于结束时间！";try{binApp.alert(n,{action:"top"})}catch(c){alert(n)}return void(e.searchTime.eTime="")}e.search.selectTime=i+","+r}}else if("s"===s)switch(t){case"全部":e.search.status="";break;case"未审核":e.search.status="1";break;case"不通过":e.search.status="2";break;case"已通过":e.search.status="3"}e.pageUserList.change=!e.pageUserList.change,e.pageUserList.pn=1},e.getUserList=function(s,i){var r={usr_filter:e.search.name,status_filter:e.search.status,time_filter:e.search.selectTime,pn:s.pn||1,ps:s.ps||e.pageUserList.ps},n={method:"GET",url:e.requestUrl.searchUser,params:{param:JSON.stringify(r)}};e.load.getUserList=!0,t(n).then(function(t){console.log(t),e.userList=t.data,angular.forEach(e.userList,function(e,t){e.attrs&&("1"===e.attrs.certification.status?e.status="未审核":"false"===e.attrs.pass.status&&"2"===e.attrs.certification.status?e.status="不通过":"true"===e.attrs.pass.status&&(e.status="已通过"))}),i(t),a(function(){e.load.getUserList=!1},300)},function(t){e.load.getUserList=!1,console.log(t)})},e.toApproveDetail=function(e){ssoC.redirect(!1,"审核页面",{usr:e.usr[0]})},e.$on("login",function(t,s){var a="";return s.login?(ssoC.checkAdmin(s),void e.initGetUserList()):(a=location.origin+location.pathname,void ssoC.redirect(!1,"登录",{url:encodeURIComponent(a)}))}),e.reset=function(){e.search={name:"",status:"",selectTime:""},e.searchTime={sTime:"",eTime:""},e.nowStatus="全部",e.pageUserList.change=!e.pageUserList.change,e.pageUserList.pn=1},e.init()}]);