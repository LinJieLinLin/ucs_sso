function ApproveAdmin($scope) {


	$scope.curentpage = 0;
	var pageSize = 10;
	var isRefresh = false;
	var isSearch = false;
	$scope.status = ""
	$scope.username= "";

	$scope.loadUser = function(){
		$.ajax({
			type: "post",
			url: '/ucenter/api/t/findUser',
			dataType: 'json',
			success: function(result) {
				if (result.code == 0) {
					$scope.username = result.data.usr;
					// var list = result.data.attrs;
					$scope.$apply();
				} else {
					alert(result.msg);
				}
			}
		});
	}

	$scope.loadUser();

	$scope.initList = function(pagesize, pageno, status) {
		var timeFrom = "";
		var timeTo = "";
		var usr = "";
		if (isSearch) {
			timeFrom = document.getElementById('timeFrom').value;
			timeTo = document.getElementById('timeTo').value;
			usr = document.getElementById('usr').value;
		};
		$.ajax({
			type: "post",
			url: '/ucenter/api/t/listApprove',
			data: {
				pageNo: pageno + 1,
				pageSize: pagesize,
				status: status,
				timeFrom: timeFrom,
				timeTo: timeTo,
				usr: usr
			},
			dataType: 'json',
			success: function(result) {
				if (result.code == 0) {
					curentpage = result.data.pageNo;
					list = result.data.data;
					$scope.list = list;
					$scope.$apply();
					var totalPages = Math.ceil(result.data.total / result.data.pageSize);
					var initPagination = function(totalPages) {
						// 创建分页
						$("#Pagination").pagination(totalPages, {
							num_edge_entries: 1, //边缘页数
							num_display_entries: 4, //主体页数
							callback: pageselectCallback,
							items_per_page: 1, //每页显示1项
							prev_text: "前一页",
							next_text: "后一页"
						});
					};

					function pageselectCallback(page_index, jq) {
						if (isRefresh) {
							$scope.loadData(pageSize, page_index, $scope.status);
						} else {
							isRefresh = true;
							return;
						}
					}
					initPagination(totalPages)
				} else {
					alert(result.msg);
				}
				// body...
			}
		});
	}

	$scope.initList(pageSize, 0, $scope.status);

	$scope.loadData = function(pagesize, pageno, status) {
		var timeFrom = "";
		var timeTo = "";
		var usr = "";
		if (isSearch) {
			timeFrom = document.getElementById('timeFrom').value;
			timeTo = document.getElementById('timeTo').value;
			usr = document.getElementById('usr').value;
		};
		$.ajax({
			type: "post",
			url: '/ucenter/api/t/listApprove',
			data: {
				pageSize: pagesize,
				pageNo: pageno + 1,
				status: status,
				timeFrom: timeFrom,
				timeTo: timeTo,
				usr: usr
			},
			dataType: 'json',
			success: function(result) {
				if (result.code == 0) {
					curentpage = result.data.pageNo;
					list = result.data.data;
					$scope.list = list;
					$scope.$apply();
				} else {
					alert(result.msg);
				}
			}
		});
	}

	$scope.change = function(x) {
		console.log(x);
		$scope.status = x;
		$scope.initList(pageSize, 0, $scope.status);
	}


	$scope.search = function() {
		// var from = $("#timeFrom").val();
		isSearch = true;
		$scope.initList(pageSize, 0, $scope.status);

		// console.log(from);
	}

	$scope.reset = function() {
		isSearch = false;
	}

	$scope.openDetail = function(uid, aid) {
		console.log(uid);
		console.log(aid);
		var url = "approve-detail.html?uid="+uid+"&aid="+aid;
		openWindow(url);
	}

	function openWindow(url) {

		window.open(encodeURI(url), '_blank');
		window.focus();
	}
}