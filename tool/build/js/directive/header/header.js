try {
    if (directiveSso) {
        // console.log('directiveSso is default');
    }
} catch (e) {
    directiveSso = angular.module("directiveSso", []);
}
directiveSso.directive('headerSso', function() {
    return {
        templateUrl: 'js/directive/header/header.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            c: '='
        },
        controller: function($scope, $timeout, $http,request) {
            var ssoUrl = 'http://localhost:7700/';
            //读取config
            $scope.readConfig = function(argType) {
                var c = {};
                if ($scope.c) {
                    c = $scope.c;
                } else {
                    try {
                        c = DYCONFIG[argType];
                    } catch (e) {}
                }
                if (c.rUrl && c.rUrl[c.rUrl.length - 1] !== '/') {
                    c.rUrl += '/';
                }
                return c.rUrl;
            };
            $scope.init = function() {
                ssoUrl = $scope.readConfig('sso') || ssoUrl;
                $scope.requestUrl = {
                    logout: ssoUrl + 'sso/api/logout',
                };
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
        }
    };
});
directiveSso.factory('request', function($http, $q) {
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