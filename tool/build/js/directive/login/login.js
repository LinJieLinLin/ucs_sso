try {
    if (directiveSso) {
        // console.log('directiveSso is default');
    }
} catch (e) {
    directiveSso = angular.module('directiveSso', []);
}
directiveSso.directive('loginSso', function() {
    return {
        templateUrl: 'js/directive/login/login.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            a: '='
        },
        controller: function($scope, $timeout, $http, request) {
            var rootUrl = 'http://localhost:7700/';
            $scope.loginText = '登录';
            $scope.lData = {};
            if (localStorage.account) {
                $scope.lData.account = localStorage.account;
            }

            //检测用户数据
            $scope.checkLoginSso = function(argData) {
                var msg = '填写数据有误！';
                if (!argData.account) {
                    return -1;
                }
                localStorage.account = $scope.lData.account;

                //password
                if (!argData.password) {
                    return -1;
                }
                return 0;
            };
            //获取URL参数
            var getUrl = function(name) {
                var result = window.location.search.match(new RegExp('[\?\&]' + name + '=([^\&]+)', 'i'));
                if (!result) {
                    return '';
                }
                return decodeURIComponent(result[1]);
            };
            //注册
            $scope.register = function() {
                location.href = 'register.html';
            };
            //登录
            $scope.loginSso = function() {
                if ($scope.loginText !== '登录') {
                    return;
                }
                var msg = $scope.checkLoginSso($scope.lData);
                if (msg === -1) {
                    return;
                }
                if (msg !== 0) {
                    try {
                        binApp.alert(msg, {
                            action: 'top'
                        });
                    } catch (err) {
                        alert(msg);
                    }
                    return;
                }
                var data = {
                    usr: $scope.lData.account,
                    pwd: $scope.lData.password
                };
                var option = {
                    method: 'GET',
                    url: rootUrl + 'sso/api/login?time=' + new Date().getTime(),
                    params: data
                };
                $scope.loginText = '正在登录...';
                request(option).then(function(rs) {
                    $scope.loginText = '登录';
                    $scope.lData.password = '';
                    var url = getUrl('url');
                    var userInfo = rs.data.usr;
                    if (userInfo.BAttr && userInfo.BAttr.HELP && userInfo.BAttr.HELP[0] && userInfo.BAttr.HELP[0].val == 1) {
                        var type = url.match(/(http|https):\/\//)[0];
                        var u = type + url.split(type)[1].split('/')[0] + '/guidance-space.html' + '?token=' + rs.data.token;
                        window.location.href = u;
                        return;
                    }
                    if (url === '') {
                        window.location.href = rootUrl + '/ucenter/my.html?token=' + rs.data.token;
                        return;
                    }
                    var urlArr = url.split('#');
                    url = urlArr[0];
                    var hash = urlArr[1] ? '#' + urlArr[1] : '';
                    if (url.match('^.*\\?.*$')) {
                        window.location.href = url + '&token=' + rs.data.token + hash;
                    } else {
                        window.location.href = url + '?token=' + rs.data.token + hash;
                    }
                }, function(e) {
                    $scope.loginText = '登录';
                    $scope.lData.password = '';
                    try {
                        binApp.alert(e.data.data.msg || '请重试', {
                            action: 'top'
                        });
                    } catch (err) {
                        alert(e.data.data.msg || '请重试');
                    }
                });
            };
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
