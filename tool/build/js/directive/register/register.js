try {
    if (directiveSso) {
        // console.log('directiveSso is default');
    }
} catch (e) {
    directiveSso = angular.module('directiveSso', []);
}
directiveSso.directive('registerSso', function() {
    return {
        templateUrl: 'js/directive/register/register.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            a: '='
        },
        controller: function($scope, $timeout, $http, request) {
            var rootUrl = 'http://localhost:7700/';
            $scope.registerText = '注册';
            $scope.rData = {};
            if (localStorage.rAccount) {
                $scope.rData.account = localStorage.rAccount;
            }

            //检测用户数据
            $scope.checkRegisterSso = function(argData) {
                var msg = '填写数据有误！';
                if (!argData.account) {
                    return -1;
                }
                localStorage.rAccount = $scope.rData.account;

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
            $scope.registerSso = function() {
                if ($scope.registerText !== '注册') {
                    return;
                }
                var msg = $scope.checkRegisterSso($scope.rData);
                if (msg !== 0) {
                    if (msg === -1) {
                        return;
                    }
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
                    usr: $scope.rData.account,
                    pwd: $scope.rData.password
                };
                var option = {
                    method: 'GET',
                    url: rootUrl + 'sso/api/login?time=' + new Date().getTime(),
                    params: data
                };
                $scope.registerText = '正在注册...';
                request(option).then(function(rs) {
                    $scope.registerText = '注册';
                    $scope.rData.password = '';
                    $scope.rData.rePassword = '';
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
                    $scope.registerText = '注册';
                    $scope.rData.password = '';
                    $scope.rData.rePassword = '';
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
