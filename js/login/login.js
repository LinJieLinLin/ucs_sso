var directiveSso = angular.module('directiveSso',[]);
var module = angular.module('RCP', ['directiveSso']);
module.controller('loginCtrl', ['$scope', function($scope){
    $scope.hi = '123';
    $scope.s = "sda";
}]);