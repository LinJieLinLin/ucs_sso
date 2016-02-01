function ApproveDetail($scope) {
	$scope.logoutR = function() {
	    var url_t = getUrl("url");
	    try {
	        WB2.logout(function() {
	            //alert("logOut");
	        });
	        QC.Login.signOut();
	    } catch (e) {};


	    localStorage.token = '';
	    if (url_t == '') {
	        window.location.href = ssoUrl + "/sso/api/logout?url=http://"+location.host+"/sso/";
	        return;
	    };
	    var url = decodeURIComponent(url_t);
	    var pattern = /^(http:\/\/)?([^\/]+)/i;
	    var mts = pattern.exec(url);
	    if (mts != null) {
	        console.log(mts[0]);
	        window.location.href = "/sso/api/logout?url=" + encodeURIComponent(mts[0]);
	    }
	};
	$scope.userInf = {
		I_NAME:'未填写',
		I_SCHOOL:'未填写',
		I_GRADE:'未填写',
		I_SUBJECT:'未填写',
		I_MPHONE:'未填写',
		I_EMAIL:'未填写',
		I_INTENTION:'未填写'
	};
	$scope.username = "";
	$scope.name = "";
	$scope.idNo = "";
	$scope.frontImg = "";
	$scope.backImg = "";
	$scope.handImg = "";

	$scope.expireTime = "";
	$scope.addr = "";
	$scope.uid = "";
	$scope.aid = "";

	$scope.loadData = function() {

		var uid = getParameterByName("uid");
		$scope.uid = uid;
		$scope.aid = getParameterByName('aid');
		$.ajax({
			type: "post",
			url: ssoUrl+'ucenter/api/t/findUser',
			data: {
				token:getToken(),
				uid: uid
			},
			dataType: 'json',
			success: function(result) {
				if (result.code == 0) {
					$scope.username = result.data.usr;
					var list = result.data.attrs;
					for (var i = 0; i < list.length; i++) {
						for (k in $scope.userInf) {
						    if (list[i].a_key == k) {
						        $scope.userInf[k] = list[i].s_val;
						    }
						}
						if (list[i].a_key == "I_NAME") {
							$scope.name = list[i].s_val;
						}
						if (list[i].a_key == "I_IDCARD") {
							$scope.idNo = list[i].s_val;
						}
						if (list[i].a_key == "I_IDFRONTIMG") {
							$scope.frontImg = list[i].s_val;
						}
						if (list[i].a_key == "I_IDBACKIMG") {
							$scope.backImg = list[i].s_val;
						}
						if (list[i].a_key == "I_HANDIMG") {
							$scope.handImg = list[i].s_val;
						}
						if (list[i].a_key == "I_IDEXPIRETIME") {
							$scope.expireTime = list[i].s_val;
						}
						if (list[i].a_key == "I_ADDR") {
							$scope.addr = list[i].s_val;
						}
					}

					// $scope.list = list;
					$scope.$apply();
				} else {
					alert(result.msg);
				}
			}
		});
	};

	$scope.loadData();

	$scope.pass = function() {
		$.ajax({
			type: "post",
			url: ssoUrl+'ucenter/api/t/updateApprove',
			data: {
				uid: $scope.uid,
				aid: $scope.aid,
				status: 'N',
				token:getToken(),
				msg: "  "
			},
			dataType: 'json',
			success: function(result) {
				if (result.code == 0) {
					binApp.alert("<span class='h4'>认证成功 </span>", {
						action: "top"
					});
					setTimeout(function(){
						location.href = 'approve-admin.html';
					},1500);
				} else {
					alert(result.msg);
				}
			}
		});
	};

	$scope.reject = function() {
		$.ajax({
			type: "post",
			url: ssoUrl+'ucenter/api/t/updateApprove',
			data: {
				uid: $scope.uid,
				aid: $scope.aid,
				status: 'R',
				token:getToken(),
				msg: "  "
			},
			dataType: 'json',
			success: function(result) {
				if (result.code == 0) {
					binApp.alert("<span class='h4'>拒绝成功</span>", {
						action: "top"
					});
					setTimeout(function(){
						location.href = 'approve-admin.html';
					},1500);
				} else {
					alert(result.msg);
				}
			}
		});
	}


	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
}