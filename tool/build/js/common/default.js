// 全局  默认 事件
/* for dy loading */
function dyLoading(opts){
	if(!window.dyLD){window.dyLD={};}
	opts = opts ? opts : {};
	dyLD.oE = binApp.$('.dy-container');
	dyLD.fullScreen = function(){};
	dyLD.loading = function (){
		binApp.each(dyLD.oE,function (){
			this.oL = document.createElement('div');
			binApp.css(this.oL,{width:'100%',minHeight:180,background:'url(imgs/loading1.gif) no-repeat center center'});
			this.style.display = 'none';
			this.parentNode.insertBefore(this.oL,this);
		});
	};
	dyLD.complete = function (){
		binApp.each(dyLD.oE,function (){
			this.style.display = '';
			binApp.removeElement(this.oL);
		});
	};
	dyLD.loading();
	binApp.addEvent(window,'load',dyLD.complete);
}
/* for window min scale */
function winMinScale(){
	var WS = {},OS = detectOS();
	if(!OS.mobile) return;
	WS.myFn = function (){
		WS.oHtml = document.getElementsByTagName('html')[0];
		WS.oBody = document.body;
		WS.oDivBody = binApp.$('.g-body');
		WS.oLgBody = binApp.$('.gradient-bg-body');
		WS.iMS = binApp.winScaleData();
		binApp.css(WS.oHtml,{minWidth:WS.iMS.minW,minHeight:WS.iMS.minH});
		binApp.css(WS.oBody,{minWidth:WS.iMS.minW,minHeight:WS.iMS.minH});
		if(WS.oDivBody[0]) binApp.css(WS.oDivBody[0],{minWidth:WS.iMS.minW,minHeight:WS.iMS.minH});
		if(WS.oLgBody[0]) binApp.css(WS.oLgBody[0],{minWidth:WS.iMS.minW,minHeight:WS.iMS.minH});
	};
	WS.myFn();
	binApp.addEvent(window,'resize',WS.myFn);
}
/* for footer fixed*/
function fixedFooter(elem,fixedClass){ //fixedFooter(Object,'fixed-footer');
	clearInterval(fixedFooterTimer);
	function myFn(elem,fixedClass){
		elem = !elem ? binApp.$('.footer-view')[0] : elem;
		if(!elem || binApp.hasClass(elem,'footer2-view')) return;
		if(document.documentElement.scrollHeight > document.documentElement.clientHeight){
			binApp.removeClass(elem,fixedClass);
			document.body.style.paddingBottom = "";
		}else {
			binApp.addClass(elem,fixedClass);
			document.body.style.paddingBottom = elem.offsetHeight+"px";
		}
	}
	binApp.addEvent(window,"load",function (){myFn(elem,fixedClass);});
	binApp.addEvent(window,"resize",function (){myFn(elem,fixedClass);});
	myFn(elem,fixedClass);
	var fixedFooterTimer = setInterval(function (){ myFn(elem,fixedClass); },500);
}
/* @ bingoo 鼠标滑过添加 class */
function moveAddClass(oPrent,elemParam,curClass){
	var elem = getElementsByClassName(oPrent,elemParam[0],elemParam[1]);
	binApp.each(elem,function (){
		binApp.hover(this,function (){
			binApp.each(elem,function (){
				binApp.removeClass(this,curClass);
			});
			binApp.addClass(this,curClass);
		});
	});
}
/* @ bingoo 美化下拉框(select-ui) 组件函数 */
function doSelectUi(elem,opts){
	var elems = getElementsByClassName(document,elem,'span');
	binApp.each(elems,function (index){
		binApp.removeEvent(this,"click");
		var oCurSelectUi = this;
		this.select = false;
		this.oPullSown = this.children[2];
		this.oVal = this.children[0];
		this.value = "";
		this.style.width = "";
		this.iW = this.clientWidth;
		binApp.addClass(this,'cur');
		this.iW = this.iW > this.clientWidth ? this.iW : this.clientWidth;
		this.style.width = this.iW+"px";
		binApp.removeClass(this,'cur');
		
		this.oOptions = getElementsByClassName(this,'li','li');
		this.oDt = getElementsByClassName(this,'dt','div');
		
		binApp.each(this.oDt,function (index){
			binApp.removeEvent(this,"click");
			binApp.removeClass(this.parentNode,'cur');
			this.parentNode.stretch = false;
			binApp.addEvent(this,"click",sUiOption = function (){
				if(!this.parentNode.stretch)
				binApp.addClass(this.parentNode,"cur");
				else
				binApp.removeClass(this.parentNode,'cur');
				this.parentNode.stretch = !this.parentNode.stretch;
			});
		});
		binApp.each(this.oOptions,function (index){
			binApp.removeEvent(this,"click");
			this.oCurSelectUi = oCurSelectUi;
			
			if(this.oCurSelectUi.oVal.innerHTML == this.children[0].children[0].innerHTML){
				this.oCurSelectUi.value = this.getAttribute("value");
				binApp.addClass(this.children[0],"cur");
			}else{
				binApp.removeClass(this.children[0],"cur");
			}
			
			binApp.addEvent(this,"click",sUiOption = function (){
				this.oCurSelectUi.oVal.innerHTML = this.children[0].children[0].innerHTML;
				this.oCurSelectUi.value = this.getAttribute("value");
				
				if(this.oCurSelectUi.onchange) this.oCurSelectUi.onchange.call(this.oCurSelectUi);
				
				binApp.removeClass(this.oCurSelectUi,'cur');
				this.oCurSelectUi.select = !this.oCurSelectUi.select;
			});
			this.onmousemove = function (){
				this.oCurSelectUi.optionsMove(this.children[0]);
			};
		});
		binApp.addEvent(this,"click",selectUi = function (){
			if(!this.select){
				this.check();
				hideSelectUi();
				binApp.addClass(this,'cur');
				binApp.addEvent(document,"click",hideSelectUi);
			}else{
				binApp.removeClass(this,'cur');
				binApp.removeEvent(document,"click",hideSelectUi);
			}
			this.select = !this.select;
		});
		this.change = function (callback){
			this.onchange = callback;
		};
		this.check = function (){
			binApp.each(this.oOptions,function (index){
				if(this.oCurSelectUi.oVal.innerHTML == this.children[0].children[0].innerHTML){
					this.oCurSelectUi.value = this.getAttribute("value");
					binApp.addClass(this.children[0],"cur");
				}else{
					binApp.removeClass(this.children[0],"cur");
				}
			});
		};
		this.optionsMove = function (elem){
			binApp.each(this.oOptions,function (index){
				binApp.removeClass(this.children[0],"cur");
			});
			binApp.addClass(elem,"cur");
		};
	});
	function hideSelectUi(){
		binApp.each(elems,function (index){
			binApp.removeClass(this,'cur');
			this.select = false;
		});
		binApp.removeEvent(document,"click",hideSelectUi);
	}
}
/*******************************************
*  @ bingoo 弹出窗运动 函数 
*  binPopWindow(elem ,{comeIn:'right,bottom',fixed:true,}, time, callback);
*  opts API
*  {
*  comeIn : "top"或"left"或"right"或"bottom"或"right,bottom",
*  fixed : boolean类型
*  fnWith : 同步函数
*  mask : boolean类型
*  }
*  窗口对象.off(); //外部调用（离场函数）
********************************************/
function binPopWindow(elem,opts,time,callback){
	binApp.removeEvent(elem,"mousemove");
	binApp.removeEvent(elem,"mouseout");
	if(!window.gPopMask){
		window.gPopMask = document.createElement('div');
		window.gPopMask.className = "g-pop-mask";
		document.body.appendChild(window.gPopMask);
	}
	elem.oAddScrollBar = getElementsByClassName(document,"gradient-bg-body","div")[0]; //附加滚动对象
	elem.oClose = getElementsByClassName(elem,"close","a");
	elem.iWinSD = binApp.winScaleData();
	elem.getWinSD = function(){
		var D = binApp.winScaleData(),oSE = elem.oAddScrollBar;
		D.cW = D.minW;
		if(oSE){
			D.sT += oSE.scrollTop;
			D.sL += oSE.scrollLeft;
			D.sH = D.sH > oSE.scrollHeight? D.sH : oSE.scrollHeight;
			D.sW = D.sW > oSE.scrollWidth? D.sW : oSE.scrollWidth;
		}
		return D;
	};
	elem.winSD = elem.getWinSD();
	elem.overflowHidden = function(){
		var oHtml = document.getElementsByTagName('html')[0];
		oHtml.style.overflow = "hidden";
		if(elem.iWinSD.sT > 0 || elem.iWinSD.sH > elem.iWinSD.cH){
			oHtml.style.overflowY = "scroll";
		}
	};
	elem.overflowVisible = function(){
		document.getElementsByTagName('html')[0].style.overflow = "";
	};
	elem.overflowHidden();
	elem.setUp = function(e,j,s){
		for(var k in j){
			s ? e[s][k] = j[k] : e[k] = j[k];
		}
	};
	elem.setUp(elem,{display:"block",opacity:0,filter:"alpha(opacity=0)"}, 'style');
	elem.setUp(elem,{opts : opts || {},iLeft : new Number(),iTop : new Number(),defaultLeft : new Number(),defaultTop : new Number(),setMode : "Back",setEffect : "easeOut",outEffect : "easeIn",callback : callback || false,time:time || 'normal'}, false);
	elem.setUp(elem,{fixed : (opts.fixed || false)}, 'opts');
	if(!elem.opts.fixed || isIE6()){
		elem.iTop = (elem.offsetHeight > elem.winSD.cH) ? (elem.winSD.sT+28) : ((elem.winSD.sT + elem.winSD.cH/2) - elem.offsetHeight/2);
	}else {
		binApp.addClass(elem,"p-f");
		elem.iTop = (elem.offsetHeight > elem.winSD.cH) ? 28 : (elem.winSD.cH/2 - elem.offsetHeight/2);
	}
	elem.iLeft = (elem.winSD.sL + elem.winSD.cW/2) - elem.offsetWidth/2;
	elem.maskComeIn = function (){
		if(!window.gpmOpacityVal) window.gpmOpacityVal = getStyle(window.gPopMask,"opacity");
		elem.setUp(window.gPopMask,{display:"block", opacity:0, filter:"alpha(opacity=0)"}, 'style');
		binApp.animate(window.gPopMask, {mode:"Quart", effect:"easeOut"}, {opacity:(window.gpmOpacityVal*100)}, elem.time);
	};
	elem.maskOff = function (){
		binApp.animate(window.gPopMask, {mode:"Quart", effect:"easeOut"}, {opacity:0}, elem.time,function (){
			window.gPopMask.style.display = "none";
		});
	};
	elem.comeIn = function(actioin){
		if(actioin){
			switch(actioin){
				case "top":
					elem.setUp(elem,{defaultTop:-(elem.winSD.sT + elem.offsetHeight + 200)}, false);
					elem.setUp(elem,{left:elem.iLeft +"px", top:elem.defaultTop+"px"}, 'style');
					break;
				case "bottom":
					elem.setUp(elem,{defaultTop:(elem.winSD.sT + elem.winSD.cH + 200)}, false);
					elem.setUp(elem,{left:elem.iLeft +"px", top:elem.defaultTop+"px"}, 'style');
					break;
				case "left":
					elem.setUp(elem,{defaultLeft:-(elem.offsetWidth + 200)}, false);
					elem.setUp(elem,{left:elem.defaultLeft +"px", top:elem.iTop+"px"}, 'style');
					break;
				case "right":
					elem.setUp(elem,{defaultLeft:(elem.winSD.sL + elem.winSD.cW + 200)}, false);
					elem.setUp(elem,{left:elem.defaultLeft +"px", top:elem.iTop+"px"}, 'style');
					break;
				case "right,bottom":
					elem.setUp(elem,{defaultTop:-(elem.offsetHeight + 200), iLeft:(elem.winSD.cW - elem.offsetWidth), iTop:(elem.winSD.cW - elem.offsetHeight), setMode:"Quart"}, false);
					elem.setUp(elem,{left:"auto", top:"auto", right:0+"px", bottom:elem.defaultTop +"px"}, 'style');
					break;
				default:
					elem.setUp(elem,{time:8, defaultTop:elem.iTop, setMode:"Quart"}, false);
					elem.setUp(elem,{top:elem.iTop+"px", left:elem.iLeft+"px"}, 'style');
					break;
			}
		}else{
			elem.setUp(elem,{defaultTop:elem.iTop, setMode:"Quart"}, false);
			elem.setUp(elem,{top:elem.iTop+"px", left:elem.iLeft+"px"}, 'style');
		}
		var actionJson = (actioin == "top" || actioin == "bottom") ? {opacity:100,top:elem.iTop} :
						 (actioin == "left" || actioin == "right") ? {opacity:100,left:elem.iLeft} :
						 (actioin == "right,bottom") ? {opacity:100,bottom:0} : {opacity:100};
		if(actioin == "scale"){
			elem.setUp(elem,{opacity:1, filter:"alpha(opacity=100)", top:elem.iTop+"px", left:elem.iLeft+"px"}, 'style');
			if(elem.opts.fullScreen){
				elem.setUp(elem,{left:0+"px", top:0+"px"}, 'style');
				document.getElementsByTagName('html')[0].style.overflow = "hidden";
			}
			if(CSS3Check()){
				binApp.addClass(elem,"scaleIn animated");
				css3AnimatedEnd(elem,function (){ binApp.removeClass(elem,"scaleIn animated"); });
			}
			if(callback){callback.call(elem);};
			elem.time = 'normal';
			elem.style.filter = "none";
		}else{
			binApp.animate(elem, {mode:(elem.setMode), effect:(elem.setEffect)}, actionJson, elem.time,function (){
				elem.style.filter = "none";
				elem.overflowVisible();
				if(callback){callback.call(elem);};
			});
		}
		if(opts.mask) elem.maskComeIn();
		binApp.drag(elem);
	};
	elem.off = function (){
		elem.overflowHidden();
		if(opts.comeIn == "scale"){
			if(CSS3Check()){
				binApp.addClass(elem,"scaleOut animated");
				css3AnimatedEnd(elem,function (){ 
					binApp.removeClass(elem,"scaleOut animated");
					elem.style.display = "none";
					elem.overflowVisible();
				});
			}else{
				elem.style.display = "none";
				elem.overflowVisible();
			}
			if(opts.mask) elem.maskOff();
			return;
		}
		var actionJson = (opts.comeIn == "top" || opts.comeIn == "bottom") ? {opacity:0,top:elem.defaultTop} :
						 (opts.comeIn == "left" || opts.comeIn == "right") ? {opacity:0,left:elem.defaultLeft} :
						 (opts.comeIn == "right,bottom") ? {opacity:0,bottom:elem.defaultTop} : {opacity:0};
		binApp.animate(elem, {mode:elem.setMode, effect: elem.outEffect}, actionJson, elem.time,function (){
			elem.style.display = "none";
			elem.overflowVisible();
		});
		if(opts.mask) elem.maskOff();
	};
	elem.comeIn((opts.comeIn || false));
	binApp.each(elem.oClose,function (){
		binApp.addEvent(this,"click", elem.off);
	});
	if(opts.defaultConmeIn){opts.defaultConmeIn(elem);}
	if(opts.fnWith){opts.fnWith(elem);}
}
// for 上传文件窗口 回调函数
function toUploadMinSize(){
	var elem = this;
	binApp.removeEvent(elem,"mousemove");
	binApp.removeEvent(elem,"mouseout");
	this.oMinSizeBtn = getElementsByClassName(elem,"min-btn","a")[0];
	this.oMaxSizeBtn = getElementsByClassName(elem,"max-btn","a")[0];
	this.oClose = getElementsByClassName(elem,"close","a");
	
	this.fnMinimize = function (){
		elem.style.opacity = 1;
		elem.style.filter = "alpha(opacity=100)";
		binApp.animate(elem, {mode:"Quad", effect:"easeIn"}, {opacity:30,bottom:-(elem.offsetHeight-35)}, 'normal',function (){
			binApp.addEvent(elem,"mousemove",function (){
				binApp.animate(elem, {mode:"Quad", effect:"easeIn"}, {opacity:100}, 'fast');
			});
			binApp.addEvent(elem,"mouseout",function (){
				binApp.animate(elem, {mode:"Quad", effect:"easeIn"}, {opacity:30}, 'fast');
			});
		});
		binApp.addClass(elem.children[0],"minimize");
	};
	
	this.fnMaximize = function (){
		binApp.removeEvent(elem,"mousemove");
		binApp.removeEvent(elem,"mouseout");
		binApp.animate(elem, {mode:"Quad", effect:"easeIn"}, {opacity:100,bottom:0}, 'normal');
		binApp.removeClass(elem.children[0],"minimize");
	};
	
	this.oMinSizeBtn.onclick = this.fnMinimize;
	this.oMaxSizeBtn.onclick = this.fnMaximize;
	
	binApp.each(this.oClose,function (){
		binApp.addEvent(this,"click", function (){
			binApp.removeClass(elem.children[0],"minimize");
			binApp.removeEvent(elem,"mousemove");
			binApp.removeEvent(elem,"mouseout");
		});
	});
}
// for 上传文件窗口 默认显示 同步函数
function toUploadDefaultConmeIn(elem){
	elem.style.opacity = 1;
	elem.style.filter = "alpha(opacity=100)";
	binApp.animate(elem, {mode:"Quad", effect:"easeIn"}, {opacity:30,bottom:-(elem.offsetHeight-35)}, 'normal',function (){
		elem.overflowVisible();
		if(elem.callback){
			elem.callback.call(elem);
			elem.fnMinimize();
		}
	});
}
/* for 侧栏菜单*/
function doSidebarMenu(oWrap){
	var oSidebarMenu = document.getElementById(oWrap);
	oSidebarMenu.aMenuPart = getElementsByClassName(oSidebarMenu,'menu-part','div');
	oSidebarMenu.aKeys = [];
	binApp.each(oSidebarMenu.aMenuPart,function (index){
		this.select = true;
		this.oDt = getElementsByClassName(this,'dt','div')[0];
		this.oDd = getElementsByClassName(this,'dd','div')[0];
		this.oDt.onclick = function (){
			if(this.parentNode.select)
			binApp.removeClass(this.parentNode,'cur');
			else
			binApp.addClass(this.parentNode,'cur');
			this.parentNode.select = !this.parentNode.select;
		};
		if(this.oDd){
			aKey = getElementsByClassName(this.oDd,'key','a');
			var pDt = this.oDt;
			binApp.each(aKey,function (j){
				oSidebarMenu.aKeys.push(this);
				this.pDt = pDt;
				this.select = false;
				this.onclick = function (){
					binApp.each(oSidebarMenu.aKeys,function (){
						this.select = false;
						binApp.removeClass(this,'cur');
						binApp.removeClass(this.pDt,'cur');
					});
					binApp.addClass(this,'cur');
					binApp.addClass(this.pDt,'cur');
					this.select = true;
				};
			});
		}else{
			var oKey = this.oDt.children[0];
			oKey.select = false;
			oSidebarMenu.aKeys.push(oKey);
			oKey.pDt = this.oDt;
			this.oDt.onclick = function (){
				var oKey = this.children[0];
				binApp.each(oSidebarMenu.aKeys,function (){
					this.select = false;
					binApp.removeClass(this,'cur');
					binApp.removeClass(this.pDt,'cur');
				});
				binApp.addClass(oKey,'cur');
				binApp.addClass(this,'cur');
				oKey.select = true;
			};
			binApp.addClass(this.oDt,"alone");
			binApp.removeClass(this,'cur');
			this.select = false;
		}
	});
	oSidebarMenu.reset = function(opts){
		opts = opts ? opts : {};
		opts.curIndex = "curIndex" in opts ? parseInt(opts.curIndex) : 0;
		binApp.each(this.aKeys,function (){
			this.select = false;
			binApp.removeClass(this,'cur');
		});
		binApp.addClass(this.aKeys[opts.curIndex],'cur');
		this.aKeys[opts.curIndex].select = true;
	};
	//oSidebarMenu.reset({curIndex:10});
}

/*
 @ 荣誉等级 函数
 * 角色包括以下
 * expert - 专家 , seller - 卖家 , buyers - 买家
 * honorGrade({ 角色 : 分数 });  //返回一串图标字符串(html)
*/
function honorGrade(opts){
	var i, r, n, s, g = 0, l = 0, emS = '<em class="honor-icon', emE = '></em>';
	i = {
		expert:[emS+' expert-star" alt="专家初始星星"'+emE,emS+' expert-diamond" alt="专家等级钻石"'+emE,emS+' expert-silver" alt="专家银牌"'+emE,emS+' expert-gold" alt="专家金牌"'+emE],
		seller:[emS+' seller-heart" alt="卖家初始红心"'+emE,emS+' seller-diamond" alt="卖家等级钻石"'+emE,emS+' seller-silver" alt="卖家银牌"'+emE,emS+' seller-gold" alt="卖家金牌"'+emE],
		buyers:[emS+' buyers-heart" alt="买家初始红心"'+emE,emS+' buyers-diamond" alt="买家等级钻石"'+emE,emS+' buyers-silver" alt="买家银牌"'+emE,emS+' buyers-gold" alt="买家金牌"'+emE]
	};
	for(key in opts){ r = key; break;}
	n = opts[r];
	s = new String();
	var getIcon = function(g,l){ for(var j=0;j<l;j++){ s += i[r][g]; } },
		check = function(){
			var gConfig = [[4,250],[251,10000],[10001,500000],[500001]]; //分4级
			var lConfig = [
				[[4,10],[251,500],[10001,20000],[500001,1000000]], // 1颗
				[[11,40],[501,1000],[20001,50000],[1000001,2000000]], // 2颗
				[[41,90],[1001,2000],[50001,100000],[2000001,5000000]], // 3颗
				[[91,150],[2001,5000],[100001,200000],[5000001,10000000]],  //4颗
				[[151,250],[5001,10000],[200001,500000],[10000001]]  // 5颗
			];
			var flag = false;
			for(var j=0;j<gConfig.length;j++){ if(n >= gConfig[j][0] && n <= gConfig[j][1] || !gConfig[j][1] && n >= gConfig[j][0]){ g = j;break; } }
			for(var t=0;t<lConfig.length;t++){
				for(var j=0;j<lConfig[t].length;j++){ if(n >= lConfig[t][j][0] && n <= lConfig[t][j][1] || !lConfig[t][j][1] && n >= lConfig[t][j][0]){ l = (t+1);flag = true;break; }}
				if(flag) break;
			}
			getIcon(g,l);
		};
	check();
	return s;
}




//侯俊杰 ---------------------------------------------------------------------------------------------------------------------

//判断样式是否存在
function hasClass(ele,cls) {
	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

//为制定的dom添加样式
function addClass(ele,cls) { 
	if (!this.hasClass(ele,cls)) ele.className += " "+cls; 
}
//判断页面是否有滚动条。
function scrollTest(obj,className){
	if (document.documentElement.scrollHeight> document.documentElement.clientHeight){
	
	}else{ 
		addClass(document.getElementById(obj), className); 
	}	
}

//for 课程学习 点击展开 收起
function onOpenBut(oWrap){
	var oSidebarMenu = document.getElementById(oWrap);
	oSidebarMenu.aMenuPart = getElementsByClassName(oSidebarMenu,'st-list-warp','div');
	binApp.each(oSidebarMenu.aMenuPart,function (index){
		this.select = true;
		this.oBut = getElementsByClassName(this,'but-op','div')[0];
		this.oBut.onclick = function (){
			if(this.select)
			binApp.removeClass(this.parentNode.parentNode.parentNode,'cur');
			else
			binApp.addClass(this.parentNode.parentNode.parentNode,'cur');
			this.select = !this.select;
		};
	});
}

//for 我要做专家 点击打钩
function doGradeUi(elem,opts){
	var elems = getElementsByClassName(document,elem,'span');
	binApp.each(elems,function (index){
		this.select = false;
		binApp.addClass(this,'cur');
		binApp.removeClass(this,'cur');
		this.oOptions = getElementsByClassName(this,'li','li');
		binApp.addEvent(this,"click",gradeUi = function (){
			if(!this.select){
				binApp.addClass(this,'cur');
				forTrack(this);
			}else{
				binApp.removeClass(this,'cur');
				binApp.removeClass(this,'track');
			}
			this.select = !this.select;
			if(this.onchange) this.onchange.call(this);
		});
		this.change = function (callback){this.onchange = callback;};
	});
	function forTrack(elem){for(var i=0;i<elems.length;i++){binApp.removeClass(elems[i],'track');binApp.addClass(elem,'track');}};
}

//for 退款模板 点击切换
function switchUi(elem,opts){
	var elems = getElementsByClassName(document,elem,'span');
	binApp.each(elems,function (index){
		this.select = true;
		this.onclick = function (){
			if(this.select)
			binApp.addClass(this.parentNode,'cur');
		
			else
			binApp.removeClass(this.parentNode,'cur');
			this.select = !this.select;
		};
	});
	
}