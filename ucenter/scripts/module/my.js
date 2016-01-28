function MyController($scope) {



	$scope.initloadAttr = function() {
		$.ajax({
			url: '/ucenter/api/t/listUAttrT?gno=1',
			type: 'post',
			dataType: 'json',
			success: function(result) {
				$scope.list = result.data;
				$scope.initAdditionAttr();
				$scope.$apply();
			}
		});
	}


	$scope.creating = function() {
		binApp.alert("<span class='h4'>正在建设中...</span>", {
			action: "top"
		});
	}

	$scope.initAdditionAttr = function() {
		$.ajax({
			url: '/ucenter/api/t/adduattr',
			type: 'post',
			dataType: 'json',
			success: function(result) {
				$scope.addt = result.data;
				$scope.initloadUser();
				for (var i = 0; i < $scope.list.length; i++) {
					// console.log("---->"+$scope.list[i].key);
					var key = $scope.list[i].key;
					if ($scope.addt != undefined) {
						for (var j = 0; j < $scope.addt.length; j++) {
							var tkey = $scope.addt[j].key;
							if (key == tkey) {
								$scope.list[i].multi = true;
								$scope.list[i].multiValue = [];
							};
						};
					}
				}

				$scope.$apply();

			}
		});
	}
	$scope.addr = "广东 广州 番禺  2 3 4"

	$scope.initloadUser = function() {
		// alert(99);
		$.ajax({
			url: '/ucenter/api/t/selfinfo',
			type: 'post',
			dataType: 'json',
			success: function(result) {
				$scope.user = result.data.attrs;
				$scope.username = result.data.usr;
				for (var i = 0; i < $scope.list.length; i++) {
					// console.log("=======equal"+$scope.list[i].attrs.length);
					for (var j = 0; j < $scope.user.length; j++) {
						// console.log($scope.list[i].key +"    "+$scope.user[j].a_key);
						if ($scope.list[i] != undefined && $scope.list[i].key == $scope.user[j].a_key) {
							var tmp = $scope.user[j].s_val;
							if (tmp == "") {
								tmp = $scope.user[j].n_val;
							};
							$scope.list[i].a_val = tmp;
							// console.log(tmp);
							// console.log($scope.list[i].a_val);
						}

						if ($scope.user[j].a_key == "R_EMAIL") {
							$scope.email = $scope.user[j].s_val;
							$scope.emailStatus = $scope.user[j].status;
						};

						if ($scope.list[i]) {
							if ($scope.list[i].key == "R_EMAIL" || $scope.list[i].key == "R_PHONE") {
								// 	// console.log("---->");d
								var index = $scope.list.indexOf($scope.list[i]);
								if (index != -1) {
									// 		// console.log("=====");
									$scope.list.splice(index, 1);
								};
							}
						}


					};
				};

				var isflag = false;

				// $scope.mySelect = [];
				var addrs = new Array();
				addrs = $scope.addr.split("  ");
				var ss = new Array();
				ss = addrs[0].split(" ");
				var ids = new Array();
				ids = addrs[1].split(" ");

				var ifs = new Array();
				for (var i = 0; i < $scope.user.length; i++) {
					if ($scope.addt != undefined) {
						for (var j = 0; j < $scope.addt.length; j++) {
							if ($scope.user[i].a_key == $scope.addt[j].key) {
								// isflag = true;
								var dd = new Object();
								dd.key = $scope.user[i].a_key;
								dd.val = $scope.user[i].s_val;
								ifs.push(dd);
								// $scope.forMySelect(ids[i],'R_RTX',ss[i]);
							};
						};
					}

				};

				// var ifss = new Array();
				// ifss.push(ifs);

				if ($scope.addt != undefined) {
					for (var z = 0; z < $scope.addt.length; z++) {
						var isbreak = false;
						for (var y = 0; y < ifs.length; y++) {
							if ($scope.addt[z].key == ifs[y].key) {
								isbreak = true;
								break;
							}
						}
						// console.log("********");
						if (!isbreak) {
							var dd = new Object();
							dd.key = $scope.addt[z].key;
							dd.val = "";
							// if(!ifss.contains(dd))
							ifs.push(dd);
						}
					};
				}


				console.log(ifs);
				for (var z = 0; z < ifs.length; z++) {
					var obj = ifs[z];
					if (obj.val != "") {
						var addrs = new Array();
						addrs = obj.val.split(" ");
						for (var i = 0; i < addrs.length; i = i + 2) {
							var id = addrs[i + 1];
							$scope.forMySelect(id, obj.key, addrs[i], '', '', '');
						};
					} else {
						$scope.forMySelect("0", obj.key, "", '', '', '');
					}
				};
				//console.log($scope.mySelect);

				$(document).ready(function() {
					doSelectUi('select-ui');
				});
				$scope.$apply();
			}
		});
	}


	$scope.initloadAttr();


	$scope.spliteLR = function(valLR) { //spliteT
		// console.log("****"+valLR)
		if (valLR == undefined) {
			valLR = "";
			console.log("undefined,,");
		};
		strs = valLR.split(":");
		return strs[0];
	}

	$scope.spliteLRA = function(valLR) { //spliteAA
		if (valLR == undefined) {
			valLR = "";
		};

		var strs = new Array();
		strs = valLR.split(":");

		var res = new Array();
		res = strs[1].split("~");
		// console.log(res);
		return res;
	}

	$scope.spliteLRR = function(valLR, index) { //spliteTV
		var strs = new Array();
		strs = valLR.split(":");

		var res = new Array();
		res = strs[1].split("~");
		// console.log(res);
		return res[index];
	}

	$scope.validateT = function(type, limit, value) {

		if (value == undefined) {
			value = "";
		};
		console.log("-----type:" + type + "   limit:" + limit + "   value:" + value)
		switch (type) { // F I S
			case "S":
				$scope.validateR(type, limit, value);
				break;
			case "F":
				var res = parseFloat(value);
				if (isNaN(res)) {
					console.log("not float");
					// alert("要求浮点格式");
					binApp.alert("<span class='h4'>要求浮点格式</span>", {
						action: "top"
					});
				} else {
					console.log("float");
					$scope.validateR(type, limit, value);
				}
				break;
			case "I":
				var re = /^[1-9]+[0-9]*]*$/;
				if (!re.test(value)) {
					console.log("not int");
					binApp.alert("<span class='h4'>要求整形格式</span>", {
						action: "top"
					});
				} else {
					console.log("int");
					$scope.validateR(type, limit, value);
				}
				break;
		}
	}


	$scope.validateR = function(type, limit, value) {
		if (value == undefined) {
			value = "";
		};
		console.log("validateR--type:" + type + "   limit:" + limit + "   value:" + value)
		var r = $scope.spliteLR(limit) //splite as L R P
		if (r == "L") {
			var l = $scope.spliteLRR(limit, 1)
			if (value.length > l) {
				// alert("最大长度为" + l);
				binApp.alert("<span class='h4'>最大长度为:" + l + " </span>", {
					action: "top"
				});
			} else {
				console.log("ok");
			}
		} else if (r == "R" && type == "S") {
			var l1 = $scope.spliteLRR(limit, 0);
			var l2 = $scope.spliteLRR(limit, 1);
			if (value.length <= l1 && value.length >= l2) {
				console.log("ok");
			} else {
				// alert("长度应该在" + l1 + "到" + l2 + "之间");
				binApp.alert("<span class='h4'>长度应该在" + l1 + "到" + l2 + "之间</span>", {
					action: "top"
				});
				console.limit("no ok");
			}
		} else if (r == "R" && (type == "F" || type == "I")) {
			// console.log("身高");
			var l1 = $scope.spliteLRR(limit, 0);
			var l2 = $scope.spliteLRR(limit, 1);
			// console.log("l1:" + l1);
			// console.log("l2:" + l2);
			// console.log("value" + value);
			if (parseInt(value) >= parseInt(l1) && parseInt(value) <= parseInt(l2)) {
				console.log("ok");
			} else {
				// alert("范围应该在" + l1 + "到" + l2 + "之间");
				binApp.alert("<span class='h4'>范围应该在" + l1 + "到" + l2 + "之间</span>", {
					action: "top"
				});
			}
		} else if (r == "P") {
			var strs = new Array();
			strs = limit.split(":");
			var reg = strs[1];
			var patt = new RegExp(reg);
			// reg= "/"+reg+"/";
			// console.log("---"+reg+"!");
			if (!patt.test(value)) {
				console.log("not int");
				// alert("格式不对");
				binApp.alert("<span class='h4'>请输入正常格式</span>", {
					action: "top"
				});
			} else {
				console.log("int");
			}
		};
	}



	$scope.one = 0;
	$scope.initSelect = function(selectid, r_name) {
		console.log("init");
		if ($scope.one == 1) return;
		$scope.one = 1;
		console.log("init");
		console.log(selectid + "     " + r_name);
		var opts = {
			ajax: '/ucenter/api/ctree?key=' + r_name,
			selStyle: 'margin-left: 3px;',
			select: "#" + selectid,
		};
		var linkageSel3 = new LinkageSel(opts);

		linkageSel3.onChange(function() {
			var input = $('#' + r_name),
				d = this.getSelectedDataArr('name'),
				arr = [];
			for (var i = 0, len = d.length; i < len; i++) {
				arr.push(d[i]);
			}
			input.val(arr.join(' '));
		});
	}

	$scope.submitInfo = function() {
			// console.log(document.getElementById('R_SEX').value);
			var lastUrl = "";
			for (var i = 0; i < $scope.list.length; i++) {
				var val = document.getElementById($scope.list[i].key);
				console.log("--->" + val.value);
				if (lastUrl == "") {
					lastUrl = lastUrl + "?" + $scope.list[i].key + "=" + val.value;
				} else {
					lastUrl = lastUrl + "&" + $scope.list[i].key + "=" + val.value;
				}

			};
			console.log(lastUrl);
			$.ajax({
				url: '/ucenter/api/t/updateUserAttr' + lastUrl,
				type: 'get',
				dataType: 'json',
				success: function(result) {
					if (result.code == 0) {
						// alert("修改成功");
						binApp.alert("<span class='h4'>修改成功</span>", {
							action: "top"
						});
					} else {

						binApp.alert("<span class='h4'>" + result.msg + "</span>", {
							action: "top"
						});
						// alert(result.msg);
					}
				}
			});
		}
		// $scope.initSelect('R_CLS','R_CLS');

	$scope.focusPwd = function() {
		$("#newpwddiv").addClass("focus");
	}

	$scope.focusPwd2 = function() {
		$("#newpwd1div").addClass("focus");
	}

	$scope.focusPwd3 = function() {
		$("#newpwd2div").addClass("focus");
	}


	$scope.checkNowPwd = function(pwd) {
		console.log(pwd);
		$("#newpwddiv").removeClass("focus");

		if (pwd == undefined || pwd.length < 1 || pwd.length > 20) {
			$("#nowpwd-err").css("display", "block");
			$("#nowpwd-err").addClass("erro-info");
			return false;
		} else {
			$("#nowpwd-err").css("display", "none");
			$("#nowpwd-err").removeClass("erro-info");
		}

		return true;
	}


	$scope.checkNewPwd1 = function(pwd) {
		console.log("new1:", pwd);
		$("#newpwd1div").removeClass("focus");

		if (pwd == undefined || pwd.length < 6 || pwd.length > 20) {
			$("#newpwd1-err").css("display", "block");
			$("#newpwd1-err").addClass("erro-info");
			return false;
		} else {
			$("#newpwd1-err").css("display", "none");
			$("#newpwd1-err").removeClass("erro-info");
		}

		return true;
	}

	$scope.checkNewPwdEqual = function(pwd, pwd2) {
		console.log("new2:", pwd);
		$("#newpwd2div").removeClass("focus");

		if (pwd == undefined || pwd.length < 6 || pwd.length > 20) {
			$("#newpwd2-err").css("display", "block");
			return false;
		} else {
			$("#newpwd2-err").css("display", "none");
		}

		if (pwd != pwd2) {
			console.log("pwd not equal");
			$("#newpwd2-err").css("display", "block");
			return false;
		} else {
			console.log("equal");
		}

		return true;
	}

	$scope.submitPwd = function() {
		console.log($scope.nowpwd);
		console.log($scope.newpwd1);
		if ($scope.checkNowPwd($scope.nowpwd) && $scope.checkNewPwd1($scope.newpwd1) && $scope.checkNewPwdEqual($scope.newpwd1, $scope.newpwd2)) {
			console.log("submit");
			$.ajax({
				url: '/ucenter/api/t/updateUser',
				type: 'post',
				data: {
					oldPwd: $scope.nowpwd,
					newPwd: $scope.newpwd1
				},
				dataType: 'json',
				success: function(result) {

					if (result.code == 0) {
						$(".close").click();
						binApp.alert("<span class='h4'>修改成功</span>", {
							action: "top"
						});
					} else {
						binApp.alert("<span class='h4'>" + result.msg + "</span>", {
							action: "top"
						});
						// alert(result.msg);
					}
				}
			});
		} else {
			console.log("error");
		}

	}



	$scope.sendEmail = function(email) {
		// alert('send');
		console.log("--" + email);
		console.log($scope.email);
		var reg = new RegExp("^.*\@.*$");

		if ($scope.email == "" || !reg.test($scope.email)) {
			$("#email-error").css("display", "block");
			return;
		};
		$("#email-error").css("display", "none");
		$.ajax({
			url: '/ucenter/api/t/sendEmail?email=' + $scope.email,
			type: 'post',
			dataType: 'json',
			success: function(result) {
				if (result.code == 0) {
					// alert("发送邮件成功");
					binApp.alert("<span class='h4'>发送邮件成功</span>", {
						action: "top"
					});
				} else {
					binApp.alert("<span class='h4'>" + result.msg + "</span>", {
						action: "top"
					});
					// alert(result.msg);
				}
			}
		});
	}


	$scope.openMailServer = function() {
		if ($scope.email != undefined) {
			var strs = new Array();
			strs = $scope.email.split("@");
			// $scope.mailServer = strs[1];
			window.open("http://mail." + strs[1], '_blank')
		};
	}

	$scope.changeMenuHiddenValue = function(type, index, obj) {
		if (obj.name == undefined) return;
		console.log("00000000" + type + " index:" + index);
		var oldval = document.getElementById(type);
		// console.log(oldval);
		var arr = oldval.value.split(" ");
		arr[2 * index] = obj.name;
		arr[2 * index + 1] = obj.pid;
		if (arr.length == index + 2) {
			oldval.value = arr.join(' ');
			// console.log("-------***"+oldval.value);
			return;
		} else {
			// arr.slice
			// console.log("length :"+arr.length)
			// console.log(arr);
			arr.splice(2 * index + 2, arr.length - index - 2);
			// console.log(arr);
			oldval.value = arr.join(' ');
			// console.log("-----===="+oldval.value);
		}

	}

	$scope.mySelect = [];

	$scope.mySelectId = 0;
	// $scope.z = 0;
	var yyy = 0;
	$scope.forMySelect = function(x, type, df, index, obj, update) {
		$scope.changeMenuHiddenValue(type, index, obj);

		$.ajax({
			url: '/ucenter/api/t/ctree?key=' + type + '&id=' + x,
			type: 'post',
			dataType: 'json',
			success: function(result) {
				for (var z = 0; z < $scope.list.length; z++) {
					var tkey = $scope.list[z].key;
					if (tkey == type) {
						// console.log("=====================================" + z);
						tmp = $scope.list[z];
						// console.log($scope.list[z]);
						// $scope.z = z;
						yyy = z;
						var flag = false;
						// console.log($scope.list[yyy]);
						if (update == "update") {
							// console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"+x);
							for (var i = 0; i < $scope.list[yyy].multiValue.length; i++) {
								for (var j = 0; j < $scope.list[yyy].multiValue[i].options.length; j++) {
									if ($scope.list[yyy].multiValue[i].options[j].id == x) {
										flag = true;
									}
								}
								if (flag) {
									$scope.list[yyy].multiValue = $scope.list[yyy].multiValue.slice(0, (i + 1));
									// setTimeout(function() {
									$scope.$apply();
									// }, 100)

									break;
								}
							}
						}
						if (!result) return;

						$scope.mySelectId++;
						var data = {};
						if (df) {
							data.
							default = df;
						}

						data.options = result;
						data.id = $scope.mySelectId;
						$scope.list[yyy].multiValue.push(data);
						// console.log("====!!!" + yyy);
						// console.log($scope.list[yyy].multiValue);
						$scope.$apply();

						setTimeout(function() {
							doSelectUi('select-ui');
						}, 500);

						setTimeout(function() {
							doSelectUi('select-ui');
						}, 500);
					}
				};

			}
		});
		//};
	};
};