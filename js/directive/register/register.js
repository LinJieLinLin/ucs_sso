try {
    if (directiveSso) {
        // console.log('directiveSso is default');
    }
} catch (e) {
    directiveSso = angular.module('directiveSso', []);
}
directiveSso.directive('registerSso', function() {
    return {
        templateUrl: 'js/directive/register/register-1.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            c: '='
        },
        controller: ['$scope', '$timeout', '$http', 'request', function($scope, $timeout, $http, request) {
            var ssoUrl = 'http://localhost:7700/';
            $scope.rData = {};
            $scope.msg = {};
            $scope.focus = {};
            $scope.regExp = {
                account: /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,50}$/,
                email: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
                tel: /^1[3|4|5|7|8][0-9]\d{8}$/,
                id: /(^\d{15}$)|(^\d{17}([0-9]|X)$)/
            };

            //初始化请求
            $scope.initUrl = function() {
                $scope.requestUrl = {
                    register: ssoUrl + 'sso/api/create',
                    checkExist: ssoUrl + 'sso/api/exist',
                    eg: ssoUrl + 'api'
                };
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
                if (c) {
                    ssoUrl = c.rUrl;
                }
            };
            //初始化
            $scope.init = function() {
                $scope.readConfig('sso');
                if (ssoUrl[ssoUrl.length - 1] !== '/') {
                    ssoUrl += '/';
                }
                $scope.registerText = '注册';
                if (localStorage.rAccount) {
                    $scope.rData.account = localStorage.rAccount;
                }
                $scope.initUrl();
            };
            $scope.init();
            //回车检测
            $scope.keydown = function(event) {
                e = event ? event : (window.event ? window.event : null);
                if (e.keyCode == 13) {
                    $scope.registerSso();
                }
            };
            //选中时
            $scope.checkFocus = function(argType) {
                $scope.focus[argType] = 1;
            };
            //检测用户名是否存在
            $scope.checkAccount = function() {
                var data = {
                    usrs: $scope.rData.account
                };
                var option = {
                    method: 'GET',
                    url: $scope.requestUrl.checkExist,
                    params: data
                };
                request(option).then(function(rs) {
                    if (rs.data && rs.data[$scope.rData.account] === 1) {
                        $scope.msg.account = '用户名已存在';
                    }
                }, function(e) {
                    console.log(e);
                });
            };
            //检测用户数据
            $scope.checkFunc = {};
            $scope.checkFunc.account = function(argData) {
                try {
                    argData.account = $('#account').val();
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
                if ($scope.msg.account) {
                    return -1;
                }
                $scope.checkAccount();
                if (!$scope.msg.account) {
                    localStorage.rAccount = $scope.rData.account;
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
            $scope.checkFunc.rePassword = function(argData) {
                if (argData.password !== argData.rePassword) {
                    $scope.msg.rePassword = '两次密码不一致！';
                    return -1;
                }
                return 0;
            };
            $scope.checkRegisterSso = function(argData, argType) {
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
                return decodeURIComponent(result[1]);
            };
            //注册
            $scope.registerSso = function() {
                if ($scope.registerText !== '注册') {
                    return;
                }
                if ($scope.msg.account) {
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
                    usr: [$scope.rData.account],
                    pwd: $scope.rData.password,
                    attrs: {
                        basic: {
                            email: $scope.rData.email || '',
                            phone: $scope.rData.tel || ''
                        }
                    },
                };

                var option = {
                    method: 'POST',
                    url: $scope.requestUrl.register,
                    data: angular.toJson(data),
                    params: {
                        login: 1
                    }
                };
                $scope.registerText = '正在注册...';
                request(option).then(function(rs) {
                    if (!rs.data.token) {
                        rs.data.token = rs.msg;
                    }
                    $scope.registerText = '注册';
                    $scope.rData.password = '';
                    $scope.rData.rePassword = '';
                    $scope.rData.email = '';
                    $scope.rData.tel = '';
                    localStorage.account = $scope.rData.account;
                    localStorage.rAccount = '';
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
                    $scope.registerText = '注册';
                    $scope.rData.password = '';
                    $scope.rData.rePassword = '';
                    switch (e.data.data.code) {
                        case 1:
                            e.data.data.dmsg = '参数错误';
                            break;
                        case 2:
                            e.data.data.dmsg = '参数错误';
                            break;
                        case 3:
                            localStorage.rAccount = '';
                            e.data.data.dmsg = '用户已存在';
                            break;
                        default:
                            e.data.data.dmsg = '参数错误';
                            break;
                    }
                    try {
                        binApp.alert(e.data.data.dmsg || '请重试', {
                            action: 'top'
                        });
                    } catch (err) {
                        alert(e.data.data.msg || '请重试');
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
