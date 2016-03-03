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
            c: '='
        },
        controller: ['$scope', '$timeout', '$http', 'request', '$element', function($scope, $timeout, $http, request, $element) {
            var ssoUrl = 'http://localhost:7700/';
            $scope.lData = {};
            $scope.msg = {};
            $scope.focus = {};
            $scope.regExp = {
                account: /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,50}$/,
                email: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
                tel: /^1[3|4|5|7|8][0-9]\d{8}$/,
                id: /(^\d{15}$)|(^\d{17}([0-9]|X)$)/
            };

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
            //初始化请求
            $scope.initUrl = function() {
                $scope.requestUrl = {
                    login: ssoUrl + 'sso/api/login',
                    eg: ssoUrl + 'api'
                };
            };
            //初始化
            $scope.init = function() {
                ssoUrl = $scope.readConfig('sso') || ssoUrl;
                $scope.loginText = '登录';
                if (localStorage.account) {
                    $scope.lData.account = localStorage.account;
                }
                $scope.initUrl();
            };
            $scope.init();

            //回车检测
            $scope.keydown = function(event) {
                e = event ? event : (window.event ? window.event : null);
                if (e.keyCode == 13) {
                    $scope.loginSso();
                }
            };
            //选中时
            $scope.checkFocus = function(argType) {
                $scope.focus[argType] = 1;
            };
            //检测用户数据
            $scope.checkFunc = {};
            $scope.checkFunc.account = function(argData) {
                try {
                    if ($('#account').attr('placeholder') != $('#account').val()) {
                        argData.account = $('#account').val();
                        argData.password = $('#pwd').val();
                    }
                } catch (e) {}
                if (!argData.account) {
                    $scope.msg.account = '请输入邮箱/用户名/手机号';
                    return -1;
                }
                var msg = '请输入2-20位的邮箱/用户名/手机号';
                if ($scope.regExp.email.test(argData.account)) {
                    argData.email = argData.account;
                    msg = '';
                }
                if ($scope.regExp.tel.test(argData.account)) {
                    argData.tel = argData.account;
                    msg = '';
                }
                if ($scope.regExp.account.test(argData.account)) {
                    msg = '';
                }
                $scope.msg.account = msg;
                if (!$scope.msg.account) {
                    localStorage.account = $scope.lData.account;
                    return 0;
                } else {
                    return -1;
                }
            };
            $scope.checkFunc.password = function(argData) {
                if (!argData.password) {
                    $scope.msg.password = '请输入密码';
                    return -1;
                }
                if (argData.password.length < 6) {
                    $scope.msg.password = '密码至少6位';
                    return -1;
                }
                return 0;
            };
            $scope.checkLoginSso = function(argData, argType) {
                $scope.focus = {};
                if (argType) {
                    $scope.msg[argType] = '';
                }
                var msg = '填写数据有误！';
                if (argType) {
                    try {
                        return $scope.checkFunc[argType](argData);
                    } catch (e) {
                        return 0;
                    }
                } else {
                    for (var k in $scope.checkFunc) {
                        if ($scope.checkFunc[k](argData)) {
                            return $scope.checkFunc[k](argData);
                        }
                    }
                    return 0;
                }
            };
            //获取URL参数
            var getUrl = function(name) {
                var result = window.location.search.match(new RegExp('[\?\&]' + name + '=([^\&]+)', 'i'));
                if (!result) {
                    return '';
                }
                return decodeURIComponent(decodeURI(result[1]));
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
                //显示提示
                var msg = $scope.checkLoginSso($scope.lData);
                if (msg === -1) {
                    return;
                } else if (msg !== 0) {
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
                    url: $scope.requestUrl.login,
                    params: data
                };
                $scope.loginText = '正在登录...';
                request(option).then(function(rs) {
                    $scope.loginText = '登录';
                    $scope.lData.password = '';
                    var url = getUrl('url');
                    var userInfo = rs.data.usr;
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
                    $timeout(function() {
                        $scope.loginText = '登录';
                    }, 500);
                    try {
                        binApp.alert(e.data.data.msg || '帐号或密码错误', {
                            action: 'top'
                        });
                    } catch (err) {
                        alert(e.data.data.msg || '帐号或密码错误');
                    }
                });
            };
        }]
    };
});
directiveSso.factory('request', ['$http', '$q', function($http, $q) {
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
}]);
