

function RealNameAuth($scope) {
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
$('.up-btn-box').mouseenter(function() {
		// this.style.display = 'none';
		console.log('abc');
		$("#testingdef").addClass('hover');
		// document.getElementById('testingdef').style.display='block';
		// this.testingdef.style.display = 'block';
	});
// $('.honver').mouseout(function() {
// 	console.log('def');
// 		document.getElementById('testingdef').style.display='none';
// 	});
	$scope.username = "";
	$scope.positiveImg = "";
	$scope.handImg = "";
	$scope.backImg = "";
	$scope.status = "";
	$scope.realName = "";
	$scope.realName2 = "";
	$scope.idCardNo = "";
	$scope.idCardNo2 = "";
	// $scope.frontImg = "";
	$scope.backImg = "";
	$scope.expire = "";
	$scope.ok = false;
	$scope.addr = "";
	$scope.expire2 = "";
	$scope.addr2 = "";

	$.ajax({
		type: "post",
		url: ssoUrl+'ucenter/api/t/findUser',
		dataType: 'json',
		data:{token:getToken()},
		success: function(result) {
			if (result.code == 0) {
				$scope.username = result.data.usr;
				var list = result.data.attrs;
				for (var i = 0; i < list.length; i++) {
					if (list[i].a_key == "I_STATUS") {
						$scope.status = list[i].status;
					}
					if (list[i].a_key == "I_NAME") {
						$scope.realName = list[i].s_val;
						$scope.realName2 = list[i].s_val;
					}
					if (list[i].a_key == "I_IDCARD") {
						$scope.idCardNo = list[i].s_val;
						$scope.idCardNo2 = list[i].s_val;
					}
					if (list[i].a_key == "I_IDFRONTIMG") {
						// $scope.frontImg = list[i].s_val;
						$scope.positiveImg = list[i].s_val;
						console.log($scope.positiveImg);
					}
					if (list[i].a_key == "I_IDBACKIMG") {
						$scope.backImg = list[i].s_val;
					}
					if (list[i].a_key == "I_HANDIMG") {
						$scope.handImg = list[i].s_val;
					}
					if (list[i].a_key == "I_IDEXPIRETIME") {
						$scope.expire = list[i].s_val;
						$scope.expire2 = list[i].s_val;
					}
					if (list[i].a_key == "I_ADDR") {
						$scope.addr = list[i].s_val;
						$scope.addr2 = list[i].s_val;
					}
				};

				// $scope.list = list;
				$scope.$apply();
			} else {
				alert(result.msg);
			}
		}
	});

	$scope.checkName = function(name) {
		console.log("name" + name);
		$("#name-icon").css('display', 'block');

		if (name == undefined || name == "" || name.length < 2 || name.length >= 10) {
			$("#realName-div").addClass("erro-text");
			$("#name-tips-div").css("display", "block");
			$("#name-icon").attr('class', 'g-icon erro');
			return false;
		} else {
			$("#realName-div").removeClass("erro-text");
			$("#name-tips-div").css("display", "none");
			$("#name-icon").attr('class', 'g-icon succ');
		}
		return true;
		// console.log($scope.realName);
	}



	$scope.checkIdNo = function(idno) {
		$("#idcard-icon").css('display', 'block');
		if (idno == undefined || idno == "" || idno.length < 15 || idno.length > 18) {
			$("#idCardNo-div").addClass("erro-text");
			$("#idno-tips-div").css("display", "block");
			$("#idcard-icon").attr('class', 'g-icon erro');
			return false;
		} else {
			$("#idCardNo-div").removeClass("erro-text");
			$("#idno-tips-div").css("display", "none");
			$("#idcard-icon").attr('class', 'g-icon succ');
		}
		return true;
	}


	$scope.uploadPositive = function() {
		g_ul.Uer.Args.pub = 1;
		C4js.UL.OnSuccess = function(f, data, e) {
			console.log(f, data, e);
			if (data.code == 0) {
				$scope.positiveImg = data.data;
				console.log("positive:" + data.data);
				$("#frontImg-src").attr("src", data.data);
				$scope.$apply();
			} else {
				binApp.alert("上传失败", {
					action: "top"
				});
			}
		};
		// $('#i_1').click();
		document.getElementById('id-img-positive').click();
	}

	$scope.uploadBack = function() {
		g_ul.Uer.Args.pub = 1;
		C4js.UL.OnSuccess = function(f, data, e) {
			console.log(f, data, e);
			if (data.code == 0) {
				$scope.backImg = data.data;
				console.log("back:" + data.data);
				$("#backImg-src").attr("src", data.data);
				$scope.$apply();
			} else {
				binApp.alert("上传失败", {
					action: "top"
				});
			}
		};
		// $('#i_1').click();
		document.getElementById('id-img-back1').click();
	}

	$scope.uploadHand = function() {
		console.log("hand");
		g_ul.Uer.Args.pub = 1;
		C4js.UL.OnSuccess = function(f, data, e) {
			console.log(f, data, e);
			if (data.code == 0) {
				$scope.handImg = data.data;
				console.log("hand:" + data.data);
				$("#handImg-src").attr("src", data.data);
				$scope.$apply();
			} else {
				binApp.alert("上传失败", {
					action: "top"
				});
			}
		};
		// $('#i_1').click();
		document.getElementById('id-img-hand').click();
	}
	// $scope.isCardNo = function(card) {
	// 	// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
	// 	var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	// 	if (reg.test(card) === false) {
	// 		alert("身份证输入不合法");
	// 		return false;
	// 	}
	// }


	$scope.checkExpire = function() {

		setTimeout(function() {
			expire = $("#expire").val();
			$scope.expire = expire;
			// console.log(expire);
			$("#expire-icon").css('display', 'block');
			if (expire == undefined || expire == "") {
				$("#expire-div").addClass("erro-text");
				$("#expire-tips-div").css("display", "block");
				$("#expire-icon").attr('class', 'g-icon erro');
				console.log("checkExpire false");
				return false;
			} else {
				$("#expire-div").removeClass("erro-text");
				$("#expire-tips-div").css("display", "none");
				$("#expire-icon").attr('class', 'g-icon succ');
			}
			$scope.ok = true;
			return true;
		}, 300);
	}

	$scope.checkAddr = function(addr) {
		$("#addr-icon").css('display', 'block');
		if (addr == undefined || addr == "") {
			$("#addr-div").addClass("erro-text");
			$("#addr-tips-div").css("display", "block");
			$("#addr-icon").attr('class', 'g-icon erro');
			return false;
		} else {
			$("#addr-div").removeClass("erro-text");
			$("#addr-tips-div").css("display", "none");
			$("#addr-icon").attr('class', 'g-icon succ');
		}
		return true;
	}


	$scope.submit = function() {
		if ($scope.positiveImg == "") {

			$("#positive-img-err").css("display", "block");
			return;
		} else {
			$("#positive-img-err").css("display", "none");
		}
		if ($scope.backImg == "") {
			$("#back-img-err").css("display", "block");
			return;
		} else {
			$("#back-img-err").css("display", "none");
		}

		if ($scope.handImg == "") {
			$("#hand-img-err").css("display", "block");
			return;
		} else {
			$("#hand-img-err").css("display", "none");
		}
		// $scope.positiveImg = data.data;
		// $scope.backImg = data.data;
		// console.log($scope.positiveImg);
		// console.log($scope.backImg);
		// return;

		if ($scope.checkName($scope.realName) && $scope.checkIdNo($scope.idCardNo) && $scope.ok && $scope.checkAddr($scope.addr) && $scope.positiveImg != "" && $scope.backImg != "") {

			var url = "?I_NAME=" + $scope.realName + "&I_IDCARD=" + $scope.idCardNo + "&I_IDFRONTIMG=" + $scope.positiveImg + "&I_IDBACKIMG=" + $scope.backImg +"&I_HANDIMG="+$scope.handImg +"&I_IDEXPIRETIME=" + $scope.expire + "&I_ADDR=" + $scope.addr + "&I_STATUS='  ' ";
			// alert(url);
			$.ajax({
				url: ssoUrl+'ucenter/api/t/submitApprove' + url,
				type: 'post',
				dataType: 'json',
				data:{token:getToken()},
				success: function(result) {
					if (result.code == 0) {
						// alert("提交成功");
						binApp.alert("<span class='h4'>提交成功</span>", {
							action: "top"
						});
						window.location.href = "approve.html";
					} else {
						binApp.alert("<span class='h4'>" + result.msg + "</span>", {
							action: "top"
						});
					}
				}
			});
		} else {
			console.log("not submit");
		}
	}

}