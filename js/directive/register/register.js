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
            c: '='
        },
        controller: function($scope, $timeout, $http, request) {
            var ssoUrl = 'http://localhost:7700/';
            $scope.rData = {};
            $scope.msg = {};
            $scope.focus = {};
            //初始化
            $scope.init = function() {
                if (ssoUrl[ssoUrl.length - 1] !== '/') {
                    ssoUrl += '/';
                }
                $scope.registerText = '注册';
                if (localStorage.rAccount) {
                    $scope.rData.account = localStorage.rAccount;
                }
            };
            $scope.init();
            //回车检测
            $scope.keydown = function(event) {
                e = event ? event : (window.event ? window.event : null);
                if (e.keyCode == 13) {
                    $scope.registerSso();
                }
            };
            //检测用户名是否存在
            $scope.checkAccount = function() {
                var data = {
                    usr: $scope.rData.account
                };
                var option = {
                    method: 'GET',
                    url: ssoUrl + 'ucenter/api/checkUser',
                    params: data
                };
                request(option).then(function(rs) {
                    $scope.msg.account = '用户名已存在';
                }, function(e) {

                });
            };
            //检测用户数据
            $scope.checkRegisterSso = function(argData,argType) {
                $scope.focus = {};
                $scope.msg = {};
                var msg = '填写数据有误！';
                if (!argData.account) {
                    $scope.msg.account = '请输入邮箱/用户名/已验证手机';
                    return -1;
                }
                $scope.checkAccount();
                localStorage.rAccount = $scope.rData.account;

                //password
                if (!argData.password) {
                    $scope.msg.password = '请输入密码';
                    return -1;
                }
                if (argData.password.length < 6) {
                    $scope.msg.password = '密码至少6位';
                    return -1;
                }
                if (argData.password !== argData.rePassword) {
                    argData.password = argData.rePassword = '';
                    return '两次密码不一置！';
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
                    url: ssoUrl + 'ucenter/api/addUser',
                    params: data
                };
                $scope.registerText = '正在注册...';
                request(option).then(function(rs) {
                    if (!rs.data.token) {
                        rs.data.token = rs.msg;
                    }
                    $scope.registerText = '注册';
                    $scope.rData.password = '';
                    $scope.rData.rePassword = '';

                    var url = getUrl('url');
                    var userInfo = rs.data.usr;
                    if (userInfo.BAttr && userInfo.BAttr.HELP && userInfo.BAttr.HELP[0] && userInfo.BAttr.HELP[0].val == 1) {
                        var type = url.match(/(http|https):\/\//)[0];
                        var u = type + url.split(type)[1].split('/')[0] + 'guidance-space.html' + '?token=' + rs.data.token;
                        window.location.href = u;
                        return;
                    }
                    if (url === '') {
                        window.location.href = 'my.html?token=' + rs.data.token;
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
