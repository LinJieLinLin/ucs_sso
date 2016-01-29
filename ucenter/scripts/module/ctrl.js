/**
 * Created by mj on 2015/4/3.
 */
 var module = angular.module('USR',['upload','UserT','UsrService']);

 module.factory('UsrCompileService',function($q,Compile,UsrService){


    return {
        GetAdduattr:function () {
            var deferred = $q.defer();
            UsrService.GetAdduattr.get({token:getToken()},function (rs) {
                if(rs.code===0){
                    var arr = [];
                    angular.forEach(rs.data, function(value, key){
                        arr.push(value.key);
                    });
                    Compile.setAddAttr(arr);
                }
                return deferred.resolve();
            });
            return deferred.promise;
        },        
        GetUserTData:function(gno){
            var deferred = $q.defer();
            UsrService.GetUserT.get({gno:gno,token:getToken()},function  (rs) {
                if(rs.code===0){
                    return deferred.resolve(rs.data);
                }else{
                    return deferred.reject();
                }
            });
            return deferred.promise;
        },        
        CompileT:function (data,attrs) {
            var list = [];
            var GetAttrValue = function (attrs,key) {
                for (var i = 0; i < attrs.length; i++) {
                    if (attrs[i].a_key != key) {
                        continue;
                    }
                    switch(attrs[i].val_t){
                        case "I":
                        case "F":{
                            return attrs[i].n_val;
                        }
                        case "S":{
                            return attrs[i].s_val;
                        }
                    }
                }

            };
            angular.forEach(data, function(value, key){
                var item = Compile.newTemplate(value.key,value.name,value.val_t,value.val_l_t,value.val_l_r,value.grp_no,GetAttrValue(attrs,value.key));
                list.push(item);                
            });
            return list;
        },
        GetCompileList:function (grpNo,attrs) {
            var _this = this;
            var deferred = $q.defer();
            this.GetAdduattr({token:getToken()}).then(function () {
                _this.GetUserTData(grpNo).then(function (rs) {
                  var result =  _this.CompileT(rs,attrs);
                  return deferred.resolve(result);
              });
            });
                return deferred.promise;
        }        
    };
}).service('Compile', function(){

    this.addAttr = [];

    this.setAddAttr = function (attrs) {
        this.addAttr = attrs;
    };

    this.init = function () {
        this.key = "";
        this.data = null;
        this.length = 30;
        this.reg = {};
        this.type = "";
        this.valT = "";
    };

    this.newTemplate = function (key,name,valueT,val_t,val_r,grpNo,value) {
        this.init();
        this.key = key;
        this.type = this.getType(valueT);
        this.valT = this.getVal_T(val_t);
        this.reg = this.getValR(val_r);
        return {key:key,name:name,type:this.type,valT:this.valT,grpNo:grpNo,reg:this.reg,data:this.data,value:value||"",length:this.length};
    };
    this.getType = function (type) {
        if($.inArray(this.key,this.addAttr)!=-1){
            return "C";
        }
        if(String(this.key).indexOf("IMG")!=-1){
            return "PIC";
        }
        return type;
    };
    this.getVal_T = function  (val_t) {
        var arr = val_t.split("|");
        if(arr.length>1&&arr[1]=="M"){
            this.type = "M";
        }
        return arr[0];
    };
    this.getValR = function (val_r) {
        var regArr = val_r.split(":");
        switch(regArr[0]){
            case "R":{
                var rangeArr=regArr[1].split("~");
                return this.createRangR(rangeArr);                
            }
            case "L":{
               var lengthArr=regArr[1].split("~"); 
               return this.createLengthR(lengthArr);               
           }
           case "P":{
               var pArr=regArr[1];
               return this.createPatternR(pArr);               
           }
           case "O":{
               var optionArr = regArr[1].split("~");
               this.type = "O";
               this.data = optionArr;
               return this.createOptionR(optionArr);               
           }
       }
   };
   this.createRangR = function (rangeArr) {
    var start,end = 0;
    switch (rangeArr.length){
        case 1:{
            end = parseInt(rangeArr[0]);
            this.length = String(rangeArr[0]).length;
            break; 
        }
        case 2:{
            start = parseInt(rangeArr[0])||0;
            end = parseInt(rangeArr[1]);
            this.length = String(rangeArr[1]).length;
            break;
        }
    }
    return {
        msg:"范围要在"+start+"~"+end+"。",
        start:start,
        end:end,
        test:function (value) {
            value = parseInt(value);
            return value>=this.start&&value<=end;
        }
    };
};
this.createLengthR = function (lengthArr) {
    var start,end = 0;
    switch(lengthArr.length){
        case 1:{
            end = parseInt(lengthArr[0]);
            this.length = end;
            break;
        }
        case 2:{
            start = parseInt(lengthArr[0])||0;
            end = parseInt(lengthArr[1]);
            this.length = end-1;
            break;
        }
    }
    return {
        msg:"长度要在"+start+"~"+end+"之间。",
        start:start,
        end:end,
        test:function (value) {
            var length = String(value).length;
            return length>=parseInt(start)&&length<parseInt(end);
        }
    };
};
this.createPatternR = function (pattern) {
    var reg = new RegExp(pattern,"g");
    return {
        msg:"",
        reg:reg,
        test:function (value) {
            return String(value).match(this.reg);
        }
    };
};
this.createOptionR = function (optionArr) {
    return {
        msg:"",
        optionArr:optionArr,
        test:function (value) {
            return $.inArray(String(value),this.optionArr)!=-1;
        }
    };
};
});

module.controller('userCtrl',function($scope,$log,UsrService,UsrCompileService,$q){
    //日志
    var logSwitch = true;
    var debugSwitch = false;
    $scope.commonLog = function(msg){
        if(logSwitch)
            $log.info(msg);
    };

    $scope.debugLog = function(msg){
        if(debugSwitch)
            $log.info(msg);
    };

    //用户对象
    $scope.user = {};
    //组号
    $scope.grpNo = 1;
    //模板列表
    $scope.templateList = [];
    //获取用户信息
    $scope.getUserInfo = function(){
        var deferred = $q.defer();
        UsrService.GetInfo.get({token:getToken()},function(rs){
            if(rs.code===0){
                $scope.user.name = rs.data.usr;
                $scope.user.id = rs.data.tid;
                $scope.user.attr = rs.data.attrs;
                return deferred.resolve($scope.user.attr);
            }else{
                return deferred.reject();
            }
        });
        return deferred.promise;
    };

    $scope.getTemplateVal = function (attrs,key) {
        for (var i = 0; i < attrs.length; i++) {
            var item = attrs[i];
            if(item.key==key){
                return item;
            }
        }
        return "";
    };
    $scope.getTemplateList = function (attrs) {
        //获取模板数据
        UsrCompileService.GetCompileList($scope.grpNo,attrs).then(function (rs) {
            $scope.templateList = rs;
            $scope.user.pic= $scope.getTemplateVal(rs,"R_IMG");
        });
    };

    $scope.init = function(){
        $scope.getUserInfo().then(function (attrs) {
            $scope.getTemplateList(attrs);
        });
    };

    $scope.init();

     //校验表单
     $scope.checkForm = function () {
       var result = {code:0,msg:""};
       for (var i = 0; i < $scope.templateList.length; i++) {
           var item = $scope.templateList[i];
           if(item.valT!="O"&&item.value===""){
            result.msg = item.name+"不能为空。";
            result.code = 1;
            return result;
        }
        if(item.value&&!item.reg.test(item.value)){
            result.msg = item.name+"格式不对。"+item.reg.msg;
            result.code = 1;
            return result;
        }
    }
    return result;
};

$scope.makeForm = function (data) {
   var list = {};
   for (var i = 0; i < data.length; i++) {
       var item = data[i];
       list[item.key] = item.value;
   }
   return list;
};
     //提交修改
     $scope.submit = function  () {
        var result = $scope.checkForm();
        if(result.code!==0){
            jf.alert(result.msg);
            return;
        }
        UsrService.SaveUserAttr.save($scope.makeForm($scope.templateList),function (rs) {
            if(rs.code===0){
                jf.alert("修改成功。");
            }else{
                $scope.commonLog(rs);
            }
        });

    };

    $scope.isNullString = function (value) {
        return !value||value==="";
    };

    //修改密码
    $scope.submitPwd = function () {
        if($scope.isNullString($scope.nowpwd)||$scope.isNullString($scope.newpwd)||$scope.isNullString($scope.newpwd1)||
            $scope.newpwd!=$scope.newpwd1){
         jf.alert("请按格式填写后提交。");
     return; 
 }
 UsrService.SavePwd.save({oldPwd:$scope.nowpwd,newPwd:$scope.newpwd},function (rs) {
    if (rs.code===0) {
        jf.alert("修改成功。");
        $('#popModifyPwd')[0].off();
    } else{
        jf.alert(rs.msg);
    }
});
};
    //
    $(".password-text").find("input").each(function (index,item) {
        $(item).bind('focus',function(){
           $(".password-text").removeClass("focus");
           $(item).parent().addClass("focus");
       });
    });
});