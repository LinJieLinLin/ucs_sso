var directive = angular.module('demo', []);
directive.controller('demoCtrl', ['$scope', function($scope) {
    $scope.page = localStorage.page || 0;
    $scope.directives = [{
        name: 'placeholder',
    }, {
        name: 'slide',
    }, {
        name: 'drag',
    }, {
        name: 'slide',
    }, {
        name: 'slide',
    }, {
        name: 'slide',
    }, {
        name: 'slide',
    }, {
        name: 'slide',
    }, {
        name: 'slide',
    }, {
        name: 'slide',
    }, {
        name: 'slide',
    }, {
        name: 'slide',
    }, {
        name: 'slide',
    }, {
        name: 'slide',
    }, ];
    $scope.slideConfig = { time: 1.5, stayTime: 2, imgStyle: { width: '100%', height: '100%' } };
    $scope.select = function(argIndex) {
        $scope.page = argIndex;
        localStorage.page = argIndex;
    };
    $scope.imgs = ['js/demo/1.png', 'js/demo/2.png', 'js/demo/3.png'];
    $scope.imgs1 = ['js/demo/2.png', 'js/demo/1.png'];
}]);
