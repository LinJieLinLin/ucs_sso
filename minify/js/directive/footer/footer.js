try{directiveSso}catch(e){directiveSso=angular.module("directiveSso",[])}directiveSso.directive("footerSso",function(){return{templateUrl:"js/directive/footer/footer.html",restrict:"E",replace:!0,transclude:!0,scope:{a:"="},controller:["$scope","$timeout","$http",function(e,t,r){e.bSn="粤ICP备05139291号-4",e.year=(new Date).getFullYear(),e.createing=function(){try{binApp.alert("<span class='h4'>正在建设中...</span>",{action:"top"})}catch(e){}}}]}});