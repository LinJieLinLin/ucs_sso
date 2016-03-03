var directiveSso = angular.module('directiveSso', []);
var SSO = angular.module('SSO', ['directive', 'directiveSso']);

SSO.controller('mainCtrl', function($scope, request, $rootScope) {
    //读取config
    var config = {};
    //初始化请求
    $scope.initUrl = function() {
        $scope.requestUrl = {
            checkLogin: config.rUrl + 'sso/api/uinfo',
            logout: config.rUrl + 'sso/api/logout',
            eg: config.rUrl + 'api'
        };
    };
    $scope.init = function() {
        config = ssoC.readConfig('sso');
        //头部文件的配置
        $scope.headerConfig = {
            rUrl: config.rUrl
        };
        //登陆注册directive的配置
        $scope.loginConfig = {
            rUrl: config.rUrl
        };
        $scope.registerConfig = {
            rUrl: config.rUrl
        };
        $scope.initUrl();
        $scope.checkLogin();
    };

    $scope.checkLogin = function() {
        var option = {
            method: 'GET',
            url: $scope.requestUrl.checkLogin,
            params: {
                // token: ssoC.getToken()
            }
        };
        request(option).then(function(rs) {
            console.log('login');
            if (rs.data && rs.data.usr) {
                $rootScope.userData = rs.data.usr;
                $rootScope.userData.login = true;
                $rootScope.$broadcast('login', $rootScope.userData);
                if (location.pathname === '/sso/' || location.pathname === '/sso/register.html' || location.pathname === '/context.html') {
                    var url = ssoC.queryString('url');
                    var userInfo = rs.data.usr;
                    if (url === '') {
                        window.location.href = 'my.html?token=' + ssoC.getToken();
                        return;
                    }
                    var urlArr = url.split('#');
                    url = urlArr[0];
                    var hash = urlArr[1] ? '#' + urlArr[1] : '';
                    if (url.match('^.*\\?.*$')) {
                        window.location.href = url + '&token=' + ssoC.getToken() + hash;
                    } else {
                        window.location.href = url + '?token=' + ssoC.getToken() + hash;
                    }
                }
            }
        }, function(e) {
            console.log('not login');
            $rootScope.userData = {};
            $rootScope.userData.login = false;
            $rootScope.$broadcast('login', $rootScope.userData);
        });
    };
    $scope.logout = function() {
        var option = {
            method: 'GET',
            url: $scope.requestUrl.logout,
            params: {}
        };
        request(option).then(function(rs) {
            if (rs.data === 'OK') {
                ssoC.clearLocalStorage();
                location.href = '/sso';
            }
        }, function(e) {
            console.log('logout error');
        });
    };
    $scope.init();
});
SSO.factory('request', function($http, $q) {
    return function(option) {
        return $http(option).then(function(response) {
            var defer = $q.defer();
            if (angular.isUndefined(response.data.code)) {
                defer.reject({
                    type: -1,
                    data: response
                });
            } else if (response.data.code !== 0) {
                defer.reject({
                    type: 1,
                    data: response
                });
            } else {
                defer.resolve(response.data);
            }
            return defer.promise;
        }, function(err) {
            throw {
                type: -1,
                data: err
            };
        });
    };
});
