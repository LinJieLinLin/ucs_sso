/**
* UserT Module
* 	
* Description
*/
var module = angular.module('UserT', ['UsrService']);

module.directive('userTemplate', function($compile){
	// Runs during compile
	return {
		scope: {key:"=key",name:"=name",type:"=type",data:"=data",reg:"&reg",gno:"=gno",index:"@index",value:"=value",length:"=length"}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		template: '<div></div>',
		// templateUrl: '',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {
			switch ($scope.type){
				case "F":
				case "I":
				case "S":{
					$(iElm[0]).append($compile('<user-input key="key" name="name" index="index" length="length" value="value"></user-input>')($scope));
					break;
				}
				case "M":{
					$(iElm[0]).append($compile('<user-textarea key="key" name="name" index="index" length="length" value="value"></user-textarea>')($scope));
					break;
				}
				case "O":{
					$(iElm[0]).append($compile('<user-select key="key" name="name" data="data" index="index" value="value"></user-select>')($scope));						
					break;
				}
				case "C":{
					$(iElm[0]).append($compile('<user-multi-select key="key" name="name" data="data" index="index" value="value"></user-multi-select>')($scope));
					break;
				}
			}
		}
	};
});

module.directive('userInput', function(){
	// Runs during compile
	return {
		scope: {key:"=key",name:"=name",value:"=value",index:"=index",length:"=length"}, // {} = isolate, true = child, false/undefined = no change
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		templateUrl: 'scripts/plug/userT/input.html',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {

		}
	};
});

module.directive('userSelect', function(){
	// Runs during compile
	return {
		scope: {key:"=key",name:"=name",data:"=data",value:"=value",index:"=index"}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		templateUrl: 'scripts/plug/userT/select.html',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {
			$scope.display = false;
			$scope.toggle = function () {
				$scope.display = !$scope.display;
			};
			$scope.chose = function (item) {
				$scope.value = item;
				$scope.toggle();
			};
			$scope.init = function () {
				if ($scope.value) {
					angular.forEach($scope.data, function(value, key){
						if(value==$scope.value){
							$scope.value = value;
						}
					});
				} 
			};
			$scope.init();
		}
	};
});

module.directive('userTextarea', function(){
	// Runs during compile
	return {
		scope: {key:"=key",name:"=name",value:"=value",index:"=index",length:"=length"}, // {} = isolate, true = child, false/undefined = no change
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		templateUrl: 'scripts/plug/userT/textarea.html',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {

		}
	};
});

module.directive('userMultiSelect', function(){
	// Runs during compile
	return {
		scope: {key:"=key",name:"=name",value:"=value",index:"=index"}, // {} = isolate, true = child, false/undefined = no change
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		templateUrl: 'scripts/plug/userT/multiSelect.html',
		replace: true,
		controller: function($scope, $element, $attrs,$http) {
			//下拉列表数组
			$scope.selectList = [];
			// 获取级联数据
			$scope.getCasCadeData = function(pid) {				
				return $http.post(ssoUrl+'ucenter/api/t/ctree', {key:$scope.key,id:pid});
			};
			//清除下拉数组
			$scope.clearSelect = function(index) {
				var length = $scope.selectList.length;
				if(index+1<length){
					$scope.selectList.splice(index+1,length-index-1);
				}
			};
			//
			$scope.getSelect = function (id) {
				$scope.getCasCadeData(id).then(function (rs) {
					if(rs.data!="null"&&rs.data.length!==0)
						$scope.selectList.push({display:false,data:rs.data});
				});
			};

			$scope.getAllSelect = function () {
				var arr = [];
				if($scope.value){
					arr = JSON.parse($scope.value);
				}
				var id = 0;
				angular.forEach(arr, function(value, key){
					if(value.value!==""){
						$scope.getCasCadeData(id).then(function(rs) {
							if(rs.data!="null"&&rs.data.length!==0)
								$scope.selectList[key]={display:false,data:rs.data,value:value.value,id:value.id};
						});
						id = value.id;
					}
				});

				$scope.getCasCadeData(id).then(function(rs) {
					if(rs.data!="null"&&rs.data.length!==0)
						$scope.selectList[arr.length]={display:false,data:rs.data,value:"",id:""};
				});
			};
			$scope.getAllSelect();
            //更新value
            $scope.refreshValue = function () {
            	var arr = [];
            	angular.forEach($scope.selectList, function(value, key){
            		if(value.value!=="")
            			arr.push({value:value.value,id:value.id});
            	});
            	$scope.value = JSON.stringify(arr);
            };
            //选择下拉
            $scope.getNextSelect = function(item,index) {
            	$scope.selectList[index].value=item.name;
            	$scope.selectList[index].display=false;
            	$scope.selectList[index].id=item.id;
            	$scope.clearSelect(index);
            	$scope.refreshValue();
            	$scope.getSelect(item.id);
            };
        }
    };
});