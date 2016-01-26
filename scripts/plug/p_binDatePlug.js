/**********************
@bingoo 日期插件 使用方法
在 input[type="text"] 设置类 calss="binDate expiredDate realDate binTime"
和 window.onload 调用 binDatePlug(); 就可以
**********************/
function binDatePlug(opts){
	if(!window.binDP) window.binDP = new Object();
	clearTimeout(binDP.NDTtimer);
	binDP.opts = binDP.opts ? binDP.opts : {};
	var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
	hasTouch = 'ontouchstart' in window && !isTouchPad,
	touchStart = hasTouch ? 'touchstart' : 'mousedown',
	touchMove = hasTouch ? 'touchmove' : 'mousemove',
	touchEnd = hasTouch ? 'touchend' : 'mouseup';
	binDP.oInput = getElementsByClassName(document,'binDate','input'); //文本对象
	binDP.init = function(){
		binDP.dateStr = null;
		binDP.NDTtimer = null;
		binDP.nowInput = new Object(); //当前文本对象
		binDP.oWrap = document.createElement('div'); //插件视图
		binDP.oWrap.className = "binDate-wrap";
		binDP.oHead = document.createElement('div'); //头部
		binDP.oHead.className = "head-box";
		binDP.oTimeWrap = document.createElement('div'); //时间
		binDP.oTimeWrap.className = "showtime-box";
		binDP.oNowTime = document.createElement('div'); //时间
		binDP.oNowTime.className = "now-time";
		binDP.oTimeWrap.appendChild(binDP.oNowTime);
		binDP.oHour = document.createElement('select'); //时下拉菜单
		binDP.oHour.name = 'hMenu';
		binDP.oHour.className = 'hMenu';
		binDP.oMinute = document.createElement('select'); //分下拉菜单
		binDP.oMinute.name = 'mMenu';
		binDP.oMinute.className = 'mMenu';
		binDP.oCont = document.createElement('div'); //中部
		binDP.oCont.className = "cont-box";
		binDP.oFooter = document.createElement('div'); //尾部
		binDP.oFooter.className = "footer-box";
		binDP.oPrevMonth = document.createElement('a'); //上一月
		binDP.oPrevMonth.href = "javascript:void(0);";
		binDP.oPrevMonth.className = "prev-btn";
		binDP.oPrevMonth.title = "上一月";
		binDP.oNextMonth = document.createElement('a'); //下一月
		binDP.oNextMonth.href = "javascript:void(0);";
		binDP.oNextMonth.className = "next-btn";
		binDP.oNextMonth.title = "下一月";
		binDP.oYear = document.createElement('select'); //年下拉菜单
		binDP.oYear.name = 'yearMenu';
		binDP.oYear.className = 'yearMenu';
		binDP.oMonth = document.createElement('select'); //月下拉菜单
		binDP.oMonth.name = 'monthMenu';
		binDP.oMonth.className = 'monthMenu';
		binDP.oClear = document.createElement('div'); //清空按钮
		binDP.oClear.className = 'clear-btn';
		binDP.oClear.innerHTML = "<a>清空</a>";
		binDP.oToday = document.createElement('div'); //今天按钮
		binDP.oToday.className = 'today-btn';
		binDP.oToday.innerHTML = "<a>今天</a>";
		binDP.oDefine = document.createElement('div'); //确认/取消按钮
		binDP.oDefine.className = 'definite-btn';
		binDP.oDefine.innerHTML = "<a>取消</a>";
		binDP.nowDate = new Date(); //现在日期
		binDP.nowYear = binDP.nowDate.getFullYear(); //当年
		binDP.nowMonth = binDP.nowDate.getMonth()+1; //当月
		binDP.nowDay = binDP.nowDate.getDate(); //当日
		binDP.setStopBubble = function(e){e = e || window.event;stopBubble(e);};
		binApp.addEvent(binDP.oWrap,touchStart,binDP.setStopBubble);	
	};
	if(!binDP.loadFlag) binDP.init();
	binDP.isLeapyear = function(year){ //求闰年
		if(year%4==0 && year%100!=0)
			return true;
		else
			return (year%400==0) ? true : false;
	};
	binDP.getDayLen = function(year,month){
		var dayLen;
		if(month==1 || month==3 || month==5 || month==7 || month==8 || month==10 || month==12)
			dayLen=31;
		else if(month==4 || month==6 || month==9 || month==11)
			dayLen=30;
		else if(month==2 && binDP.isLeapyear(year))
			dayLen=29;
		else
			dayLen=28;
		return dayLen;
	};
	binDP.doWeekDate = function(i){
		switch(i){
			case 1:
				return "日";
				break;
			case 2:
				return "一";
				break;
			case 3:
				return "二";
				break;
			case 4:
				return "三";
				break;
			case 5:
				return "四";
				break;
			case 6:
				return "五";
				break;
			case 7:
				return "六";
				break;
		}
	};
	binDP.retTable = function(elem){
		binDP.oHead.appendChild(binDP.oPrevMonth);
		binDP.oHead.appendChild(binDP.oNextMonth);
		/**年下拉菜单*********************/
		for(var i=1901;i<(binDP.nowYear+100);i++){
			var option = document.createElement('option');
			option.value = i;
			option.innerHTML = i+'年';
			i == binDP.nowYear ? option.selected = "selected" : null;
			binDP.oYear.appendChild(option);
		}
		binDP.oHead.appendChild(binDP.oYear);
		/**月下拉菜单*********************/
		for(var i=1;i<13;i++){
			var option = document.createElement('option');
			option.value = i;
			option.innerHTML = i+'月';
			i == binDP.nowMonth ? option.selected = "selected" : null;
			binDP.oMonth.appendChild(option);
		}
		binDP.oHead.appendChild(binDP.oMonth);
		/**周一到周日*********************/
		binDP.weekBox = document.createElement('div');
		binDP.weekBox.className = 'week-box';
		for(var i=1;i<8;i++){
			var weekDate = document.createElement('h4');
			weekDate.innerHTML = binDP.doWeekDate(i);
			binDP.weekBox.appendChild(weekDate);
		}
		binDP.oHead.appendChild(binDP.weekBox);
		binDP.setShowTime = function(){
			var date=new Date(),s_dateTimeString=date.getHours()+":"+date.getMinutes()+":"+(date.getSeconds())._lenWithZero(2);
			binDP.oNowTime.innerHTML="<p>当前时间</p>"+s_dateTimeString+"";
			binDP.NDTtimer = setInterval(function (){
				var date=new Date(),s_dateTimeString=date.getHours()+":"+date.getMinutes()+":"+(date.getSeconds())._lenWithZero(2);
				binDP.oNowTime.innerHTML="<p>当前时间</p>"+s_dateTimeString+"";
			},1000);
			/**时下拉菜单*********************/
			for(var i=0;i<24;i++){
				var val = i+1;
				val == 24 ? val = 0 : null;
				val = val._lenWithZero(2);
				var option = document.createElement('option');
				option.value = val;
				option.innerHTML = val;
				val == 0 ? option.selected = "selected" : null;
				binDP.oHour.appendChild(option);
			}
			var hDiv = document.createElement('div');
			hDiv.style.padding="15px 0";
			hDiv.innerHTML = "时：";
			hDiv.appendChild(binDP.oHour);
			binDP.oTimeWrap.appendChild(hDiv);
			binDP.oHour.onchange = function (){
				binDP.reResult({aFlag:false,temeFlag:true});
			};
			/**分下拉菜单*********************/
			for(var i=0;i<60;i++){
				var val = i+1;
				val == 60 ? val = 0 : null;
				val = val._lenWithZero(2);
				var option = document.createElement('option');
				option.value = val;
				option.innerHTML = val;
				val == 0 ? option.selected = "selected" : null;
				binDP.oMinute.appendChild(option);
			}
			var mDiv = document.createElement('div');
			mDiv.innerHTML = "分：";
			mDiv.appendChild(binDP.oMinute);
			binDP.oTimeWrap.appendChild(mDiv);
			binDP.oMinute.onchange = function (){
				binDP.reResult({aFlag:false,temeFlag:true});
			};
		};
		binDP.setShowTime();
		binDP.oWrap.innerHTML = "";
		/**时间*********************/
		binDP.oWrap.appendChild(binDP.oTimeWrap);
		/**头部*********************/
		binDP.oWrap.appendChild(binDP.oHead);
		/**中部主体*********************/
		binDP.oWrap.appendChild(binDP.oCont);
		/**底部*********************/
		binDP.oFooter.appendChild(binDP.oClear);
		binDP.oFooter.appendChild(binDP.oToday);
		binDP.oFooter.appendChild(binDP.oDefine);
		binDP.oWrap.appendChild(binDP.oFooter);
	};
	binDP.isExpired = function(year,month,i){ //是否过期
		return (year < binDP.nowYear || year == binDP.nowYear && month < binDP.nowMonth || year == binDP.nowYear && month == binDP.nowMonth && i < binDP.nowDay-1) ? true : false;
	};
	binDP.isReal = function(year,month,i){ //是否真实
		return (year < binDP.nowYear || year == binDP.nowYear && month < binDP.nowMonth || year == binDP.nowYear && month == binDP.nowMonth && i <= binDP.nowDay) ? true : false;
	};
	binDP.reDay = function(year, month, day){
		binDP.oCont.innerHTML = "";
		year = year ? parseInt(year) : binDP.nowYear;
		month = month ? parseInt(month) : binDP.nowMonth;
		day = day ? parseInt(day) : undefined;
		binDP.oYear.value = year;
		binDP.oMonth.value = month;
		for(var i=0;i<42;i++){
			var oDay = document.createElement('a');
				oDay.className = 'day';
			binDP.oCont.appendChild(oDay);
		}
		var oDate = new Date();
		var dayLen = binDP.getDayLen(year,month);
		oDate.setFullYear(year);
		oDate.setMonth(month-1);
		oDate.setDate(1);
		for(var i=0;i<dayLen;i++)  //获取星期n 对应赋值排序
		{
			var curIndex = binDP.oCont.children[i+oDate.getDay()];
			curIndex.innerHTML = i+1;
			if(i == binDP.nowDay-1 && year == binDP.nowYear && month == binDP.nowMonth && !day || day && i == day-1 && year == binDP.nowInput.Year && month == binDP.nowInput.Month){
				curIndex.className = 'day day-able day-now';
			}else if(binDP.isExpired(year,month,i) && binDP.nowInput.setExpired || !binDP.isReal(year,month,(i+1)) && binDP.nowInput.setReal){
				curIndex.className = 'day';
			}else{
				curIndex.className = 'day day-able';
			}
			if(binDP.isReal(year,month,(i+1)) && binDP.nowInput.setReal || !binDP.isExpired(year,month,i) && binDP.nowInput.setExpired || binDP.nowInput.setAllDate){
				binApp.addEvent(curIndex,touchStart,function (){
					binDP.reResult({aFlag:true},this);
					!binDP.nowInput.timeFlag ? binDP.hide() : binDP.oDefine.innerHTML = "<a>确定</a>";
				});
			}
			//console.log((i+1),binDP.isReal(year,month,(i+1)));
		}
		if(binDP.nowInput.Hours && binDP.nowInput.timeFlag){
			binDP.oHour.value = binDP.nowInput.Hours;
			binDP.oMinute.value = binDP.nowInput.Minutes;
		}
		if(!binDP.nowInput.Hours && binDP.nowInput.timeFlag){
			binDP.oHour.value = '00';
			binDP.oMinute.value = '00';
		}
	};
	binDP.reResult = function(resOpts,oA){
		if(resOpts.definiteBtn) return;
		var iYear = binDP.oYear.value;
		var iMonth = parseInt(binDP.oMonth.value)._lenWithZero(2);
		var iDay = parseInt(binDP.nowDay)._lenWithZero(2);
		var dateForm = binDP.nowInput.getAttribute('dateForm') ? binDP.nowInput.getAttribute('dateForm') : '-';
		if(resOpts.nowFlag){
			iYear = binDP.nowYear;
			iMonth = parseInt(binDP.nowMonth)._lenWithZero(2);
			binDP.oHour.value = '00';
			binDP.oMinute.value = '00';
		}
		if(resOpts.aFlag && oA) iDay = parseInt(oA.innerHTML)._lenWithZero(2);
		if(resOpts.temeFlag && binDP.nowInput.Year){
			iYear = binDP.nowInput.Year;
			iMonth = binDP.nowInput.Month;
			iDay = binDP.nowInput.Day;
		}
		binDP.nowInput.Year = iYear;
		binDP.nowInput.Month = iMonth;
		binDP.nowInput.Day = iDay;
		binDP.nowInput.dateFoem = dateForm;
		binDP.dateStr = iYear +dateForm+ iMonth +dateForm+ iDay;
		if(binDP.nowInput.timeFlag){
			var iHours = binDP.oHour.value;
			var iMinutes = binDP.oMinute.value;
			binDP.nowInput.Hours = iHours;
			binDP.nowInput.Minutes = iMinutes;
			binDP.dateStr = iYear +dateForm+ iMonth +dateForm+ iDay +" "+ iHours +":"+ iMinutes;
			if(resOpts.aFlag && oA){
				binApp.each(binDP.oCont.children,function (){
					binApp.removeClass(this,'day-now');
				});
				binApp.addClass(oA,'day-now');
			}
			binDP.oDefine.innerHTML = "<a>确定</a>"
		}
		binDP.nowInput.value = binDP.dateStr;
	};
	binDP.reSetDate = function(){
		binDP.reDay(binDP.oYear.value, binDP.oMonth.value, binDP.nowInput.Day);
	};
	binDP.hide = function(){
		binDP.nowInput = new Object();
		binApp.sildeUp(binDP.oWrap,'fast');
		binApp.removeEvent(document,touchStart,binDP.hide);
	};
	binDP.showTime = function(elem){
		(elem.timeFlag) ? binApp.addClass(binDP.oWrap,'DateTime') : binApp.removeClass(binDP.oWrap,'DateTime');
		binDP.oDefine.innerHTML = "<a>取消</a>"
	};
	binDP.show = function(e){
		binDP.showTime(this);
		binDP.oWrap.style.left = binApp.pageX(this) +'px';
		binDP.oWrap.style.top = (binApp.pageY(this) + this.clientHeight) +'px';
		if(this !== binDP.nowInput){
			binApp.sildeDown(binDP.oWrap,'fast',function (){
				if(binDP.nowInput.timeFlag)
				binDP.oTimeWrap.style.height = binDP.oWrap.clientHeight+"px";
					
			});			
			binApp.addEvent(document,touchStart,binDP.hide);
		}
		binDP.nowInput = this;
		binDP.nowDate = new Date(); //现在日期
		binDP.nowYear = binDP.nowDate.getFullYear(), //当年
		binDP.nowMonth = binDP.nowDate.getMonth()+1, //当月
		binDP.nowDay = binDP.nowDate.getDate(); //当日
		binDP.reDay(binDP.nowInput.Year,binDP.nowInput.Month,binDP.nowInput.Day);
		e = e || window.event;
		stopBubble(e);
	};
	binDP.wrapFixed = function(){
		binDP.loadFlag = true;
		document.body.appendChild(binDP.oWrap);
		binDP.retTable();
		for(var i=0;i<42;i++){
			var oDay = document.createElement('a');
				oDay.className = 'day';
			binDP.oCont.appendChild(oDay);
		}
	};
	if(!binDP.loadFlag) binDP.wrapFixed();
	for(var i=0;i<binDP.oInput.length;i++){
		binDP.oInput[i].setExpired = (binApp.hasClass(binDP.oInput[i],"expiredDate")) ? true : false;
		binDP.oInput[i].setReal = (binApp.hasClass(binDP.oInput[i],"realDate")) ? true : false;
		binDP.oInput[i].setAllDate = binDP.oInput[i].setExpired || binDP.oInput[i].setReal ? false : true;
		binDP.oInput[i].timeFlag = (binApp.hasClass(binDP.oInput[i],"binTime")) ? true : false;
		/**显示，隐藏 监听点击事件*********************/
		binApp.addEvent(binDP.oInput[i],touchStart,binDP.show);
	};
	binDP.oYear.onchange = binDP.reSetDate;
	binDP.oMonth.onchange = binDP.reSetDate;
	binApp.addEvent(binDP.oPrevMonth,touchStart,function (){
		var prevM = parseInt(binDP.oMonth.value)-1;
		prevM < 1 ? prevM +=12 : null;
		prevM == 12 ? binDP.oYear.value = parseInt(binDP.oYear.value)-1 : null;
		binDP.oMonth.value = prevM;
		binDP.reSetDate();
	});
	binApp.addEvent(binDP.oNextMonth,touchStart,function (){
		var nextM = parseInt(binDP.oMonth.value)+1;
		nextM > 12 ? nextM -= 12 : null;
		nextM == 1 ? binDP.oYear.value = parseInt(binDP.oYear.value)+1 : null;
		binDP.oMonth.value = nextM;
		binDP.reSetDate();
	});
	binApp.addEvent(binDP.oClear,touchStart,function (){
		binDP.nowInput.value = '';
		binDP.oHour.value = '00';
		binDP.oMinute.value = '00';
		binDP.nowInput.Year = undefined;
		binDP.nowInput.Month = undefined;
		binDP.nowInput.Day = undefined;
		binDP.nowInput.Hours = undefined;
		binDP.nowInput.Minutes = undefined;
		binDP.dateStr = undefined;
		binDP.hide();
	});
	binApp.addEvent(binDP.oToday,touchStart,function (){
		binDP.reResult({aFlag:false,nowFlag:true});
		binDP.hide();
	});
	binApp.addEvent(binDP.oDefine,touchStart,function (){
		binDP.reResult({aFlag:false,definiteBtn:true});
		binDP.hide();
	});
};