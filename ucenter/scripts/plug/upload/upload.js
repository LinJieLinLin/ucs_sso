/**
 * Created by mj on 2015/2/3.
 */

angular.module('upload',[]).directive('headpic',function(){
    return {
        restrict:"E",
        scope:{pic:"=pic",fid:"@fid"},
        template:'<img ng-src="{{pic.value|| defaultPic }}" ng-click="upload()" style="cursor: pointer">',
        controller: function ($scope,$element,$attrs) {
            $scope.defaultPic = "imgs/test/shop_2.jpg";
            //清除file input框
            var clearFile = function(id){
                var obj = document.getElementById(id) ;
                if(!obj){
                    return;
                }
                if (obj.outerHTML) {
                    obj.outerHTML = obj.outerHTML;
                } else { // FF(包括3.5)
                    obj.value = "";
                }
            };

            var uer = C4js.NewUer({
                m: "C"
            }, true);

            var addFileInput = function(){
                var fid = $("#"+$scope.fid);
                if(fid.length<=0){
                    $(document.body).append('<div style="height: 0;overflow: hidden;"><input type="file" id="'+$scope.fid+'" style="width: 0px;height: 0px;padding: 0px;border: 0px;margin: 0px;" multiple></div>');
                }
            };

            addFileInput();

            //过滤文件
            var picArr = ["png","jpg","bmp","gif","jpeg"];
            var filterFile = function(item){
                for(var i=0;i<item.files.length;i++){
                    var file = item.files[i];
                    var msg = "只支持以下格式上传：png、jpg、bmp、gif、jpeg";
                    var fileExt = file.name.split(".").pop();
                    if($.inArray(fileExt,picArr)==-1){
                        jf.alert(msg);
                        return [];
                    }
                }
                return item.files;
            };

            //点击上传
            $scope.upload = function(){
                uer.AddI($scope.fid,{pub:1,picType:1},{
                    OnProcess:function(f,rate, speed, e){
                    },
                    OnSuccess:function(f,data,e){
                        $scope.$apply(function(){
                            if(data.code===0){
                                $scope.pic.value = data.data;
                            }
                            //清除 file input框
                            clearFile($scope.fid);
                        });
                    },
                    OnErr:function(f,data,e){
                        clearFile($scope.fid);
                    }
                });

                uer.OnSelect=function(item,e){
                    return filterFile(item); //filter the files to upload.
                };

                $("#"+$scope.fid).click();                
            };
        }
    };
});