try {
    if (directiveSso) {
        // console.log('directiveSso is default');
    }
} catch (e) {
    directiveSso = angular.module("directiveSso", []);
}
directiveSso.directive('footerSso', function() {
    return {
        templateUrl: 'js/directive/footer/footer.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            a: '='
        },
        controller: function($scope, $timeout, $http) {
            $scope.bSn = '粤ICP备05139291号-4';
            $scope.year = new Date().getFullYear();

            $scope.createing = function() {
                try {
                    binApp.alert("<span class='h4'>正在建设中...</span>", {
                        action: "top"
                    });
                } catch (e) {}
            };
        }
    };
});
