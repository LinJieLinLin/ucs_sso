
angular.module('UsrService', ['ngResource']).factory('UsrService', function($resource){
    return {
        GetInfo:$resource('/ucenter/api/t/selfinfo'),
        GetUserT:$resource("/ucenter/api/t/listUAttrT"),
        SaveUserAttr:$resource("/ucenter/api/t/updateUserAttr"),
        SavePwd:$resource('/ucenter/api/t/updateUser'),
        GetAdduattr:$resource('/ucenter/api/t/adduattr'),
        GetCtree:$resource('/ucenter/api/t/ctree')
    };
});
