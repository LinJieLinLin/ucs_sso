/******************************************
@ bingoo 触摸刷卡（幻灯片）插件 —— 使用方法 
new swiperPlug(
{
	oWrap:'touchWrap',
	imgView:'swiperImgView',
	btnView:'swiperBtnView'
},
{
	imgW:1460,
	imgH:650,
	time:3000,
	autoPlay:true,
	loop:true,
	swiper:true
}).start();
******************************************/
function swiperPlug(elem,opts){  //bin刷卡插件
	clearInterval(this.autoPlayTimer);
	this.oWrap = document.getElementById(elem.oWrap);  //插件整体盒子
	this.imgView = document.getElementById(elem.imgView);  //展示图片盒子
	this.oImg = binApp.children(this.imgView,'div');
	this.btnView = document.getElementById(elem.btnView);  //分页按钮盒子
	this.oBtn = binApp.children(this.btnView,'a');
	this.offLen = this.oBtn.length;
	this.effect = opts.effect || 'slide_l'; //设定效果
	this.imgW = opts.imgW;  //图片w尺寸
	this.imgH = opts.imgH;  //图片w尺寸
	this.time = opts.time || 5000; //轮播时间
	this.autoPlay = 'autoPlay' in opts ? opts.autoPlay : true; //自动播放
	this.loop = 'loop' in opts ? opts.loop : true;  //循环
	this.swiper = 'swiper' in opts ? opts.swiper : true; //触屏刷卡
	this.pageNode = 0;
	this.iCur = new Number();
	this.autoPlayTimer = null;
	this.css3Flag = CSS3Check();
	this.initFlag = false;
	if(this.offLen <= 1){ this.autoPlay = this.loop = false; }
	this._init.call(this);
};
swiperPlug.prototype._init = function (){  //初始化刷卡环境
	this.oWrap.style.width = '';
	this.w = this.oWrap.clientWidth;
	this.h = Math.ceil(this.imgH+(-(this.imgW-this.w))/this.imgW*this.imgH);
	this._setSize.call(this);
	if(this.loop && !this.initFlag){ this._loopLayout.call(this); }
	this.fixImg(this.pageNode);
	this.initFlag = true;
};
swiperPlug.prototype._setSize = function (){  //刷卡尺寸
	this.oWrap.style.cssText = "width:"+ this.w +"px;"+"height:"+ this.h +"px;";
	this.oImg = binApp.children(this.imgView,'div');
	for(var i=0;i<this.oImg.length;i++){
		if(this.loop && this.initFlag){
			var oImgChildrens = binApp.children(this.oImg[i],'div');
			for(var t=0;t<oImgChildrens.length;t++){
				oImgChildrens[t].style.cssText = "width:"+ this.w +"px;"+"height:"+ this.h +"px;";
			}
		}else{
			this.oImg[i].style.cssText = "width:"+ this.w +"px;"+"height:"+ this.h +"px;";
		}
	}
	this.totalW = ((this.loop && this.initFlag) ? this.oImg[0].children.length : this.oImg.length) * this.w;
	this.imgView.style.width = ((this.loop && this.initFlag) ? (this.totalW*2) : this.totalW) +"px";
};
swiperPlug.prototype._loopLayout = function (){  //循环布局
	this.loopWrap = document.createElement('div');
	this.ago_loopWrap = document.createElement('div');
	this.loopWrap.style.styleFloat = 'left'; //ie  
	this.loopWrap.style.cssFloat = 'left'; //ff
	this.ago_loopWrap.style.styleFloat = 'left'; //ie  
	this.ago_loopWrap.style.cssFloat = 'left'; //ff
	this.ago_loopWrap.style.marginLeft = '-150%';
	this.imgView.style.width =  (this.totalW*2)+"px";
	this.ago_loopWrap.innerHTML = this.loopWrap.innerHTML = this.imgView.innerHTML;
	this.imgView.innerHTML = "";
	this.imgView.appendChild(this.loopWrap);
	this.imgView.innerHTML += this.imgView.innerHTML;
	this.imgView.appendChild(this.ago_loopWrap);
};
swiperPlug.prototype._animate = function (index,way,fix){  //动画
	clearInterval(this.imgView.timer);
	var oThis = this;
	index %= this.offLen;
	if(fix){ this.iCur = (index*this.w); this._setStyle(this.imgView,{left:-this.iCur},false); }
	else{
		switch (this.effect){
			case 'slide_l':
				this._slideLeft(index,way,fix);
				break;
			default:
				this._slideLeft(index,way,fix);
				break;
		}
	}
	for(var i=0;i<this.offLen;i++){this.oBtn[i].className = "navBtn";}
	this.oBtn[index].className = "current";
	this.pageNode=index;
	return this;
};
swiperPlug.prototype._removeTransform = function (){this.imgView.style.webkitTransition = '';this.imgView.style.transform = '';};
swiperPlug.prototype._setStyle = function (elem,json,amtFlag){ //只限 left,top
	//if(amtFlag) { binApp.css(this.imgView,{webkitTransition:'-webkit-transform .5s ease-out',transition:'transform .5s ease-out'}); }
	for(attr in json){
		/*if(this.css3Flag){
			var valStr = (attr == 'left') ? 'translate('+json[attr]+'px,0px)' : 'translate(0px,'+json[attr]+'px)';
			elem.style['webkitTransform'] = valStr;
			elem.style['transform'] = valStr;
		}else{*/
			elem.style[attr] = json[attr]+="px";
		//}
	}
};
swiperPlug.prototype._slideLeft = function (index,way,fix){
	//clearTimeout(this.amtCallBackTimer);
	var oThis = this;
	if(this.iCur == 0 && way == 'prev' && this.loop){ //prev
		this._setStyle(this.imgView,{left:-(this.w*this.offLen)},false);
	}
	this.iCur = index*this.w;
	if(this.iCur == 0 && way == 'next' && this.loop){ //next
		!this.touchRetOne ? this._setStyle(this.imgView,{left:-(this.w*(this.offLen-1))},false) : null;
		this.iCur = this.w*this.offLen;
	};
	/*if(this.css3Flag){
		this._setStyle(this.imgView,{left:(-this.iCur)},true);
		this.amtCallBackTimer = setTimeout(function (){
			if(oThis.iCur == oThis.w*oThis.offLen){ oThis._setStyle(oThis.imgView,{left:0},false); }
			oThis._removeTransform();
		},500);
	}else{*/
		binApp.animate(this.imgView, {mode:'Quint', effect:'easeOut'}, {left: -(this.iCur)}, 'slow', function (){ 
			if(oThis.iCur == oThis.w*oThis.offLen){
				oThis.imgView.style.left = 0 +'px';
			}
			oThis.animateFlag = false;
		});
	//}
};
swiperPlug.prototype.fixImg = function (index){  //固定img
	this._animate(index,'','fixed');
	return this;
};
swiperPlug.prototype.gotoImg = function (index,way){  //动态转到指向img
	this._animate(index,way);
	return this;
};
swiperPlug.prototype.nextImg = function (){  //下一张img
	if(!this.autoPlay || this.animateFlag) return;
	this.animateFlag = true;
	this.pageNode++;
	if(this.loop){ this.pageNode%=this.offLen; }
	else{ this.pageNode >= this.offLen ? this.pageNode = this.offLen-1 : null; }
	this.gotoImg(this.pageNode,'next');
	return this;
};
swiperPlug.prototype.prevImg = function (){  //上一张img
	if(!this.autoPlay || this.animateFlag) return;
	this.animateFlag = true;
	this.pageNode--;
	if(this.loop){ this.pageNode%=this.offLen; }
	else{ this.pageNode < 0 ? this.pageNode = 0 : null; }
	this.pageNode < 0 ? this.pageNode += this.offLen : null;
	this.gotoImg(this.pageNode,'prev');
	return this;
};
swiperPlug.prototype._navClick = function (){  //导航按钮点击事件
	var oThis = this;
	for(var i=0;i<this.offLen;i++){
		this.oBtn[i].index = i;
		this.oBtn[i].onclick = function (){
			oThis.gotoImg(this.index);
			oThis._autoPlay.call(oThis);
		}
	}
	return this;
};
swiperPlug.prototype._touchSwiper = function (){  //触摸效果
	if(!this.swiper) return;
	var oThis = this,
	isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
	hasTouch = 'ontouchstart' in window && !isTouchPad,
	touchStart = hasTouch ? 'touchstart' : 'mousedown',
	touchMove = hasTouch ? 'touchmove' : 'mousemove',
	touchEnd = hasTouch ? 'touchend' : 'mouseup',
	startX = 0, startY = 0, distX = 0, distY = 0,
	startFlag = moveFlag = endFlag = true,
	startTime = new Date(), endTime = new Date(),
	start = function(ev){
		if(!endFlag) return !hasTouch ? false : null;
		oThis.animateFlag = false;
		startFlag = true;moveFlag = endFlag = false;
		startTime = new Date();
		var ev=ev||window.event;
		var point = hasTouch ? ev.touches[0] : ev;
		distX = distY = 0;
		startX =  (point.pageX || point.clientX) + document.documentElement.scrollLeft;
		startY =  (point.pageY || point.clientY) + document.documentElement.scrollTop;
		binApp.addEvent(document,touchMove,move);
		binApp.addEvent(document,touchEnd,end);
		oThis.imgView.parentNode.style.cursor= "-webkit-grabbing";
		document.body.onselectstart = function (){return false};
		if(!hasTouch) return false;
	},
	move = function(ev){
		var ev=ev||window.event;
		var point = hasTouch ? ev.touches[0] : ev;
		distX = distY = 0;
		distX = ((point.pageX || point.clientX) + document.documentElement.scrollLeft)-startX;
		distY = ((point.pageY || point.clientY) + document.documentElement.scrollTop)-startY;
		if(startFlag) moveFlag = (Math.abs(distX)-Math.abs(distY)) > 0 ? true : false;
		startFlag = false;
		if(moveFlag){
			//if(startFlag) {oThis._removeTransform();}
			clearInterval(oThis.imgView.timer);clearInterval(oThis.autoPlayTimer);
			/* 第一张返回最后一张 */
			if(oThis.iCur == 0 && distX > 0 && oThis.loop){
				oThis._setStyle(oThis.imgView,{left:-(oThis.w*oThis.offLen)},false);
				oThis.iCur = oThis.w*oThis.offLen;
			}
			/* 最后一张返回第一张 start--- */
			oThis.touchRetOne = (oThis.iCur >= oThis.w*(oThis.offLen-1) && distX < 0) ? true : false;
			if(oThis.iCur >= oThis.w*oThis.offLen && distX < 0 && oThis.loop){
				oThis._setStyle(oThis.imgView,{left:0},false);
				oThis.iCur = 0;
				oThis.touchRetOne = false;
			}
			/* 最后一张返回第一张 end --- */
			oThis.moveValL = oThis.iCur+-distX;
			oThis._setStyle(oThis.imgView,{left:-oThis.moveValL},false);
			return false;
		}else{
			end();
			return true;
		}
		//(!window.captureEvents) ? oThis.imgView.setCapture() : captureEvents();
	},
	end = function(ev){
		if(endFlag) return;
		endTime = new Date();
		if(moveFlag){
			if(Math.abs(startTime-endTime) < 250){
				distX < 0 ? oThis.nextImg() : oThis.prevImg();
			}else{
				if(distX<0 && Math.abs(distX) >= oThis.w/2){
					oThis.nextImg();
				}else if(distX>0 && Math.abs(distX) >= oThis.w/2){
					oThis.prevImg();
				}else{
					if(oThis.pageNode == 0){ oThis._setStyle(oThis.imgView,{left:distX},false); }
					oThis.gotoImg(oThis.pageNode);
				}
			}
		}else{
			if(oThis.pageNode == 0){ oThis._setStyle(oThis.imgView,{left:distX},false); }
			oThis.gotoImg(oThis.pageNode);
		}
		oThis._autoPlay.call(oThis);
		oThis.imgView.parentNode.style.cursor= "-webkit-grab";
		document.body.onselectstart = function (){return true};
		binApp.removeEvent(document,touchMove,move);
		binApp.removeEvent(document,touchEnd,end);
		moveFlag = false;endFlag = true;
		//(!window.releaseEvents) ? oThis.imgView.releaseCapture() : releaseEvents();
	};
	//添加“触摸开始”事件监听
	binApp.addEvent(oThis.imgView,touchStart,start);
};
swiperPlug.prototype._autoPlay = function (){  //自动播放
	if(!this.autoPlay) return;
	clearInterval(this.autoPlayTimer);
	var oThis = this;
	this.autoPlayTimer = setInterval(function (){ oThis.nextImg.call(oThis); },this.time);
};
swiperPlug.prototype._hover = function(){
	var oThis = this;
	this.oWrap.onmouseover = function (event){
		event = event || window.event;
		if(!fixedMouse(event,oThis.oWrap)) return;
		clearInterval(oThis.autoPlayTimer);
	};
	this.oWrap.onmouseout = function (event){
		event = event || window.event;
		if(!fixedMouse(event,oThis.oWrap)) return;
		oThis._autoPlay.call(oThis);
	};
};
swiperPlug.prototype._resize = function (){  //外尺改变,重新初始化
	var oThis = this;
	binApp.addEvent(window,'resize',function (){
		oThis._init(oThis);
	});
	return this;
};
swiperPlug.prototype.start = function (){  //开启
	this._navClick.call(this);
	this._autoPlay.call(this);
	this._hover.call(this);
	this._touchSwiper.call(this);
	this._resize.call(this);
	return this;
};