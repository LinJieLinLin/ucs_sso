var directive = angular.module('demo', []);
directive.controller('demoCtrl', function($scope) {
    $scope.imgs = ['js/demo/1.png', 'js/demo/2.png','js/demo/3.png'];
    $scope.imgs1 = ['js/demo/2.png', 'js/demo/1.png'];
});
