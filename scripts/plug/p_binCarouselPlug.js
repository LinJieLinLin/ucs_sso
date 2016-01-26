/******************************************
@ bingoo 轮播插件 —— 使用方法
new carouselPlug(
{
	oWrap:"carousel-wrap",
	oMoving:"moving-obj-view",
	oBox:{
			className:"box",
			tagName:"li"
		 }
},
{
	time:5000,
	autoPlay:true
}).start();
******************************************/
function carouselPlug(elems,opts){
	clearInterval(this.autoPlayTimer);
	this.oWrap = document.getElementById(elems.oWrap); //整体包裹
	this.oMoving = document.getElementById(elems.oMoving); //移动对象 / img 盒子
	this.oBox = getElementsByClassName(this.oMoving,elems.oBox.className,elems.oBox.tagName);
	this.offLen = this.oBox.length;
	this.iW = this.oBox[0].clientWidth + parseInt(getStyle(this.oBox[0], "marginLeft")) + parseInt(getStyle(this.oBox[0], "marginRight"));
	this.iTotalW = this.iW * this.offLen;
	this.oPrevBtn = getElementsByClassName(this.oWrap,"prev",'a')[0];
	this.oNextBtn = getElementsByClassName(this.oWrap,"next",'a')[0];
	this.pageNode = 0;
	this.time = opts.time || 5000;
	this.autoPlay = 'autoPlay' in opts ? opts.autoPlay : true;
	this.loop = 'loop' in opts ? opts.loop : false; //(无限循环未能用)
	this.autoPlayTimer = null;
	this.iCurL = 0;
	this.visibleNum = Math.floor((this.oMoving.parentNode.clientWidth + parseInt(getStyle(this.oBox[0], "marginLeft")) + parseInt(getStyle(this.oBox[0], "marginRight"))) / this.iW);
	//document.title = this.visibleNum;
};
carouselPlug.prototype._configLayout = function(){ //配置布局
	this.oMoving.style.width = this.iTotalW +"px";
	if(this.loop)
	this._loopLayout.call(this);
};
carouselPlug.prototype._loopLayout = function (){  //循环布局设计
	var imgWrap = document.createElement('div');
	var ago_imgWrap = document.createElement('div');
	imgWrap.style.styleFloat = 'left'; //ie  
	imgWrap.style.cssFloat = 'left'; //ff
	ago_imgWrap.style.styleFloat = 'left'; //ie  
	ago_imgWrap.style.cssFloat = 'left'; //ff
	ago_imgWrap.style.marginLeft = '-150%';
	this.oMoving.style.width =  (this.iTotalW*2)+"px";
	ago_imgWrap.innerHTML = imgWrap.innerHTML = this.oMoving.innerHTML;
	this.oMoving.innerHTML = "";
	this.oMoving.appendChild(imgWrap);
	this.oMoving.innerHTML += this.oMoving.innerHTML;
	this.oMoving.appendChild(ago_imgWrap);
}
carouselPlug.prototype._animate = function(moveVal){ //动画
	this.iCurL = (this.iCurL + moveVal) % this.iTotalW;
	if(this.iCurL > (this.iTotalW - this.visibleNum * this.iW))
	this.iCurL = 0;
	binApp.animate(this.oMoving, {mode:'Back', effect:'easeOut'}, {left: -this.iCurL}, 'normal');
};
carouselPlug.prototype._autoPlay = function(){ //自动播放
	var oThis = this;
	if(!this.autoPlay) return;
	this.autoPlayTimer = setInterval(function (){
		oThis._animate.call(oThis,oThis.iW);
	},this.time);
};
carouselPlug.prototype._hover = function(){
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
carouselPlug.prototype._prev = function(){
	var oThis = this;
	this.oPrevBtn.onclick = function (){
		clearInterval(oThis.autoPlayTimer);
		if(oThis.iCurL == 0){
			binApp.animate(oThis.oMoving, {mode:'Sine', effect:'easeOut'}, {left: -(oThis.iCurL-parseInt(oThis.iW/4))}, 'fast',function (){
				binApp.animate(oThis.oMoving, {mode:'Back', effect:'easeOut'}, {left: 0}, 'slow');
			});
		}else{
			oThis._animate.call(oThis,-oThis.iW);
		}
		
	};
};
carouselPlug.prototype._next = function(){
	var oThis = this;
	this.oNextBtn.onclick = function (){
		clearInterval(oThis.autoPlayTimer);
		if(oThis.iCurL == (oThis.iTotalW - oThis.visibleNum * oThis.iW)){
			binApp.animate(oThis.oMoving, {mode:'Sine', effect:'easeOut'}, {left: -(oThis.iCurL+parseInt(oThis.iW/4))}, 'fast',function (){
				binApp.animate(oThis.oMoving, {mode:'Back', effect:'easeOut'}, {left: -oThis.iCurL}, 1000);
			});
		}else{
			oThis._animate.call(oThis,oThis.iW);
		}
	};
};
carouselPlug.prototype.start = function(){
	this._configLayout.call(this);
	if(this.offLen < this.visibleNum) return;
	this._prev.call(this);
	this._next.call(this);
	if(this.offLen > this.visibleNum){
		this._autoPlay.call(this);
		this._hover.call(this);
	}
	return this;
};