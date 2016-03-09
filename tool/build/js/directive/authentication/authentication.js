try {
    if (directiveSso) {
        // console.log('directiveSso is default');
    }
} catch (e) {
    directiveSso = angular.module('directiveSso', []);
}
directiveSso.directive('authentication', function() {
    return {
        templateUrl: 'js/directive/authentication/authentication.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            c: '='
        },
        controller: function($scope, $timeout, $http, request) {
            var ssoUrl = 'http://localhost:7700/';
            //初始化
            $scope.init = function() {
                $scope.userInfo = {};
                //从URL获取进入哪个页面
                var urlPage = ssoC.queryString('p');
                if (angular.isDefined(urlPage)) {
                    if (urlPage === '1') {
                        if (!localStorage.step) {
                            localStorage.step = 2;
                            localStorage.applySpacePage = 1;
                        }
                    } else if (urlPage === '2') {
                        if (!localStorage.step) {
                            localStorage.step = 3;
                            localStorage.applySpacePage = 1;
                        }
                    }
                }
                $scope.page = 0;
                $scope.step = 0;
                var step = localStorage.step;
                var page = localStorage.applySpacePage;
                if (angular.isDefined(step) && angular.isNumber(Number(step))) {
                    $scope.step = step;
                }
                if (angular.isDefined(page) && angular.isNumber(Number(page))) {
                    $scope.page = page;
                }
                if (ssoUrl[ssoUrl.length - 1] !== '/') {
                    ssoUrl += '/';
                }
                //正则判断
                $scope.regExp = {
                    name: /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,50}$/,
                    email: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
                    class: /^[a-zA-Z0-9_\u4e00-\u9fa5,，;；、]{2,50}$/,
                    tel: /^1[3|4|5|7|8][0-9]\d{8}$/,
                    id: /(^\d{15}$)|(^\d{17}([0-9]|X)$)/
                };
                $scope.teacherData = [{
                    img: '/sso/js/directive/authentication/img/t1.png',
                    name: '金老师',
                    category: '广州大学优秀教师'
                }, {
                    img: '/sso/js/directive/authentication/img/t2.png',
                    name: '李老师',
                    category: '广州大学优秀教师'
                }, {
                    img: '/sso/js/directive/authentication/img/t3.png',
                    name: '陈老师',
                    category: '广州大学优秀教师'
                }, {
                    img: '/sso/js/directive/authentication/img/t4.png',
                    name: '黄老师',
                    category: '广州大学优秀教师'
                }, {
                    img: '/sso/js/directive/authentication/img/t5.png',
                    name: '徐老师',
                    category: '广州大学优秀教师'
                }];

                $scope.problems = [{
                    title: '申请实名认证的条件',
                    href: ''
                }, {
                    title: '实名认证失败原因',
                    href: ''
                }, {
                    title: '实名认证小贴士',
                    href: ''
                }];
                //认证信息
                $scope.data = {
                    realName: '',
                    school: '',
                    grade: '',
                    subject: '',
                    phone: '',
                    email: '',
                    intention: ''
                };
                //是否同意协议
                $scope.agree = false;
                ssoUrl = $scope.readConfig('sso') || ssoUrl;
                $scope.initUrl();
            };

            //初始化请求
            $scope.initUrl = function() {
                $scope.requestUrl = {
                    updateUserinfo: ssoUrl + 'usr/api/update',
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
                if (c.rUrl && c.rUrl[c.rUrl.length - 1] !== '/') {
                    c.rUrl += '/';
                }
                return c.rUrl;
            };

            /**
             * [同意协议]
             * @param  {[type]}   check [1]
             * @return {Function}       [description]
             */
            $scope.next = function(check) {
                if (!$scope.agree || check !== 1) {
                    localStorage.step = 0;
                    $scope.step = 0;
                    return;
                }
                localStorage.step = 1;
                $scope.step = 1;
            };

            /**
             * [submitData 提交申请]
             * @return {[type]} [description]
             */
            $scope.submitData = function() {
                if ($scope.data.realName === '' || $scope.data.school === '' || $scope.data.grade === '' || $scope.data.subject === '' || $scope.data.phone === '') {
                    return;
                }
                var data = {
                    attrs: {
                        certification: {
                            realName: $scope.data.realName,
                            school: $scope.data.school,
                            grade: $scope.data.grade,
                            subject: $scope.data.subject,
                            phone: $scope.data.phone,
                            email: $scope.data.email,
                            intention: $scope.data.intention,
                            status: "1"
                        }
                    }
                };
                var option = {
                    method: 'POST',
                    url: $scope.requestUrl.updateUserinfo,
                    data: angular.toJson(data),
                    params: {}
                };
                request(option).then(function(result) {
                    try {
                        binApp.alert('提交成功', {
                            action: 'top'
                        });
                    } catch (err) {
                        alert('提交成功');
                    }
                    localStorage.step = 2;
                    $scope.step = 2;
                }, function(err) {
                    console.log(err);
                });
            };

            /**
             * [changePage 切换页面]
             * @param  {[type]} argPage [0 | 1]
             * @return {[type]}         [description]
             */
            $scope.changePage = function(argPage) {
                $scope.page = argPage;
                localStorage.applySpacePage = argPage;
            };

            /**
             * [toStep 跳转到签订协议书]
             * @return {[type]} [description]
             */
            $scope.toStep = function(argStep) {
                if (!angular.isNumber(Number(argStep))) {
                    return;
                }
                if (argStep === 0 && ($scope.step !== 0 && $scope.step !== 1)) {
                    return;
                }
                if (argStep !== 1 && argStep !== 5) {
                    localStorage.step = argStep;
                }
                $scope.step = argStep;
            };

            //判断是否登陆
            $scope.$on('login', function(rs, data) {
                if (!data.login) {
                    var url = location.origin + location.pathname;
                    ssoC.redirect(false, '登录', {
                        url: encodeURIComponent(url)
                    });
                    return;
                }
                $scope.userInfo = data;
                console.log(data);
                if (!$scope.userInfo || angular.isUndefined($scope.userInfo.attrs)) {
                    return;
                }
                if ($scope.userInfo.attrs.certification && $scope.userInfo.attrs.certification.status==='1') {
                    //等待审核
                    localStorage.step = 2;
                    localStorage.applySpacePage = 1;
                    $scope.step = 2;
                    $scope.page = 1;
                } else if (!$scope.userInfo.attrs.certification) {
                    //未认证时
                    if (localStorage.step >= 2) {
                        localStorage.step = 0;
                        localStorage.applySpacePage = 0;
                        $scope.page = 0;
                        $scope.step = 0;
                    }
                } else if ($scope.userInfo.attrs.certification && $scope.userInfo.attrs.pass.status === 'false') {
                    //认证失败
                    localStorage.step = 3;
                    localStorage.applySpacePage = 1;
                    $scope.step = 3;
                    $scope.page = 1;
                    $scope.data = {
                        realName: $scope.userInfo.attrs.certification.realName,
                        school: $scope.userInfo.attrs.certification.school,
                        grade: $scope.userInfo.attrs.certification.grade,
                        subject: $scope.userInfo.attrs.certification.subject,
                        phone: $scope.userInfo.attrs.certification.phone,
                        email: $scope.userInfo.attrs.certification.email,
                        intention: $scope.userInfo.attrs.certification.intention
                    };
                    // console.log($scope.data);
                } else if ($scope.userInfo.attrs.certification && $scope.userInfo.attrs.pass.status === 'true') {
                    //已认证
                    localStorage.step = 4;
                    localStorage.applySpacePage = 1;
                    $scope.step = 4;
                    $scope.page = 1;
                    $scope.data = {
                        realName: $scope.userInfo.attrs.certification.realName,
                        school: $scope.userInfo.attrs.certification.school,
                        grade: $scope.userInfo.attrs.certification.grade,
                        subject: $scope.userInfo.attrs.certification.subject,
                        phone: $scope.userInfo.attrs.certification.phone,
                        email: $scope.userInfo.attrs.certification.email,
                        intention: $scope.userInfo.attrs.certification.intention
                    };
                }
            });
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
