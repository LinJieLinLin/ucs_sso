
angular.module('UsrService', ['ngResource']).factory('UsrService', function($resource){
    return {
        GetInfo:$resource(ssoUrl+'ucenter/api/t/selfinfo'),
        GetUserT:$resource(ssoUrl+'ucenter/api/t/listUAttrT'),
        SaveUserAttr:$resource(ssoUrl+'ucenter/api/t/updateUserAttr'),
        SavePwd:$resource(ssoUrl+'ucenter/api/t/updateUser'),
        GetAdduattr:$resource(ssoUrl+'ucenter/api/t/adduattr'),
        GetCtree:$resource(ssoUrl+'ucenter/api/t/ctree')
    };
});
