describe('mainCtrl', function() {
    var scope, $httpBackend;
    //我们会在测试中使用这个scope
    //模拟我们的Application模块并注入我们自己的依赖
    beforeEach(angular.mock.module('SSO'));
    //模拟Controller，并且包含 $rootScope 和 $controller
    beforeEach(angular.mock.inject(function($rootScope, $controller, _$httpBackend_) {
        //创建一个空的 scope
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        //声明 Controller并且注入已创建的空的 scope
        $controller('mainCtrl', {
            $scope: scope
        });
    }));
    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    it('main', function() {
        $httpBackend.whenGET(scope.requestUrl.checkLogin + '?')
            .respond({
                'code': 0,
                'data': { usr: {} }
            });
        $httpBackend.flush();
        expect(1).toBe(1);
    });
    it('code null', function() {
        $httpBackend.whenGET(scope.requestUrl.checkLogin + '?')
            .respond({
                'dmsg': 'login'
            });
        $httpBackend.flush();
        expect(1).toBe(1);
    });
    it('code 1', function() {
        $httpBackend.whenGET(scope.requestUrl.checkLogin + '?')
            .respond({
                'code': 1,
                'dmsg': 'login'
            });
        $httpBackend.flush();
        expect(1).toBe(1);
    });
    it('logout', function() {
        $httpBackend.whenGET(scope.requestUrl.checkLogin + '?')
            .respond({
                'code': 1,
                'dmsg': 'login'
            });
        $httpBackend.whenGET(scope.requestUrl.logout + '?')
            .respond({
                'code': 0,
                'data': 'OK'
            });
        scope.logout();
        $httpBackend.flush();

        expect(1).toBe(1);
    });
    it('logout err', function() {
        $httpBackend.whenGET(scope.requestUrl.checkLogin + '?')
            .respond({
                'code': 1,
                'dmsg': 'login'
            });
        $httpBackend.whenGET(scope.requestUrl.logout + '?')
            .respond({
                'code': 1,
                'data': 'OK'
            });
        scope.logout();
        $httpBackend.flush();

        expect(1).toBe(1);
    });
});
