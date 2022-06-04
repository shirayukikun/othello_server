!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?i(exports,require("pixi.js"),require("pixi-viewport")):"function"==typeof define&&define.amd?define(["exports","pixi.js","pixi-viewport"],i):i((t="undefined"!=typeof globalThis?globalThis:t||self).Scrollbox={},t.PIXI,t.Viewport)}(this,(function(t,i,o){"use strict";function s(t){if(t&&t.__esModule)return t;var i=Object.create(null);return t&&Object.keys(t).forEach((function(o){if("default"!==o){var s=Object.getOwnPropertyDescriptor(t,o);Object.defineProperty(i,o,s.get?s:{enumerable:!0,get:function(){return t[o]}})}})),i.default=t,Object.freeze(i)}var r=s(i),e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};var l=function(t){var i={exports:{}};return t(i,i.exports),i.exports}((function(t,i){(function(){var i;(function(i){t.exports=i})(i={linear:function(t,i,o,s){return o*t/s+i},easeInQuad:function(t,i,o,s){return o*(t/=s)*t+i},easeOutQuad:function(t,i,o,s){return-o*(t/=s)*(t-2)+i},easeInOutQuad:function(t,i,o,s){return(t/=s/2)<1?o/2*t*t+i:-o/2*(--t*(t-2)-1)+i},easeInCubic:function(t,i,o,s){return o*(t/=s)*t*t+i},easeOutCubic:function(t,i,o,s){return o*((t=t/s-1)*t*t+1)+i},easeInOutCubic:function(t,i,o,s){return(t/=s/2)<1?o/2*t*t*t+i:o/2*((t-=2)*t*t+2)+i},easeInQuart:function(t,i,o,s){return o*(t/=s)*t*t*t+i},easeOutQuart:function(t,i,o,s){return-o*((t=t/s-1)*t*t*t-1)+i},easeInOutQuart:function(t,i,o,s){return(t/=s/2)<1?o/2*t*t*t*t+i:-o/2*((t-=2)*t*t*t-2)+i},easeInQuint:function(t,i,o,s){return o*(t/=s)*t*t*t*t+i},easeOutQuint:function(t,i,o,s){return o*((t=t/s-1)*t*t*t*t+1)+i},easeInOutQuint:function(t,i,o,s){return(t/=s/2)<1?o/2*t*t*t*t*t+i:o/2*((t-=2)*t*t*t*t+2)+i},easeInSine:function(t,i,o,s){return-o*Math.cos(t/s*(Math.PI/2))+o+i},easeOutSine:function(t,i,o,s){return o*Math.sin(t/s*(Math.PI/2))+i},easeInOutSine:function(t,i,o,s){return-o/2*(Math.cos(Math.PI*t/s)-1)+i},easeInExpo:function(t,i,o,s){return 0===t?i:o*Math.pow(2,10*(t/s-1))+i},easeOutExpo:function(t,i,o,s){return t===s?i+o:o*(1-Math.pow(2,-10*t/s))+i},easeInOutExpo:function(t,i,o,s){return(t/=s/2)<1?o/2*Math.pow(2,10*(t-1))+i:o/2*(2-Math.pow(2,-10*--t))+i},easeInCirc:function(t,i,o,s){return-o*(Math.sqrt(1-(t/=s)*t)-1)+i},easeOutCirc:function(t,i,o,s){return o*Math.sqrt(1-(t=t/s-1)*t)+i},easeInOutCirc:function(t,i,o,s){return(t/=s/2)<1?-o/2*(Math.sqrt(1-t*t)-1)+i:o/2*(Math.sqrt(1-(t-=2)*t)+1)+i},easeInElastic:function(t,i,o,s){var r,e,l;return l=1.70158,0===t||(t/=s),(e=0)||(e=.3*s),(r=o)<Math.abs(o)?(r=o,l=e/4):l=e/(2*Math.PI)*Math.asin(o/r),-r*Math.pow(2,10*(t-=1))*Math.sin((t*s-l)*(2*Math.PI)/e)+i},easeOutElastic:function(t,i,o,s){var r,e,l;return l=1.70158,0===t||(t/=s),(e=0)||(e=.3*s),(r=o)<Math.abs(o)?(r=o,l=e/4):l=e/(2*Math.PI)*Math.asin(o/r),r*Math.pow(2,-10*t)*Math.sin((t*s-l)*(2*Math.PI)/e)+o+i},easeInOutElastic:function(t,i,o,s){var r,e,l;return l=1.70158,0===t||(t/=s/2),(e=0)||(e=s*(.3*1.5)),(r=o)<Math.abs(o)?(r=o,l=e/4):l=e/(2*Math.PI)*Math.asin(o/r),t<1?r*Math.pow(2,10*(t-=1))*Math.sin((t*s-l)*(2*Math.PI)/e)*-.5+i:r*Math.pow(2,-10*(t-=1))*Math.sin((t*s-l)*(2*Math.PI)/e)*.5+o+i},easeInBack:function(t,i,o,s,r){return void 0===r&&(r=1.70158),o*(t/=s)*t*((r+1)*t-r)+i},easeOutBack:function(t,i,o,s,r){return void 0===r&&(r=1.70158),o*((t=t/s-1)*t*((r+1)*t+r)+1)+i},easeInOutBack:function(t,i,o,s,r){return void 0===r&&(r=1.70158),(t/=s/2)<1?o/2*(t*t*((1+(r*=1.525))*t-r))+i:o/2*((t-=2)*t*((1+(r*=1.525))*t+r)+2)+i},easeInBounce:function(t,o,s,r){return s-i.easeOutBounce(r-t,0,s,r)+o},easeOutBounce:function(t,i,o,s){return(t/=s)<1/2.75?o*(7.5625*t*t)+i:t<2/2.75?o*(7.5625*(t-=1.5/2.75)*t+.75)+i:t<2.5/2.75?o*(7.5625*(t-=2.25/2.75)*t+.9375)+i:o*(7.5625*(t-=2.625/2.75)*t+.984375)+i},easeInOutBounce:function(t,o,s,r){return t<r/2?.5*i.easeInBounce(2*t,0,s,r)+o:.5*i.easeOutBounce(2*t-r,0,s,r)+.5*s+o}})}).call(e)}));const n={boxWidth:100,boxHeight:100,scrollbarSize:10,scrollbarBackground:14540253,scrollbarBackgroundAlpha:1,scrollbarForeground:8947848,scrollbarForegroundAlpha:1,dragScroll:!0,stopPropagation:!0,scrollbarOffsetHorizontal:0,scrollbarOffsetVertical:0,underflow:"top-left",fadeScrollbar:!1,fadeScrollbarTime:1e3,fadeScrollboxWait:3e3,fadeScrollboxEase:"easeInOutSine",passiveWheel:!1,clampWheel:!0};class a extends r.Container{constructor(t={}){if(super(),this.options=Object.assign({},n,t),t.overflow&&(this.options.overflowX=this.options.overflowY=t.overflow),this.ease="function"==typeof this.options.fadeScrollboxEase?this.options.fadeScrollboxEase:l[this.options.fadeScrollboxEase],this.content=this.addChild(new o.Viewport({passiveWheel:!1,stopPropagation:this.options.stopPropagation,screenWidth:this.options.boxWidth,screenHeight:this.options.boxHeight,interaction:this.options.interaction,divWheel:this.options.divWheel})),this.content.decelerate().on("moved",()=>this._drawScrollbars()),t.ticker)this.options.ticker=t.ticker;else{let i;const o=r;i=parseInt(/^(\d+)\./.exec(r.VERSION)[1])<5?o.ticker.shared:o.Ticker.shared,this.options.ticker=t.ticker||i}this.scrollbar=this.addChild(new r.Graphics),this.scrollbar.interactive=!0,this.scrollbar.on("pointerdown",this.scrollbarDown,this),this.interactive=!0,this.on("pointermove",this.scrollbarMove,this),this.on("pointerup",this.scrollbarUp,this),this.on("pointercancel",this.scrollbarUp,this),this.on("pointerupoutside",this.scrollbarUp,this),this._maskContent=this.addChild(new r.Graphics),this.update(),this.options.noTicker||(this.tickerFunction=()=>this.updateLoop(Math.min(this.options.ticker.elapsedMS,16.6667)),this.options.ticker.add(this.tickerFunction))}get scrollbarOffsetHorizontal(){return this.options.scrollbarOffsetHorizontal}set scrollbarOffsetHorizontal(t){this.options.scrollbarOffsetHorizontal=t}get scrollbarOffsetVertical(){return this.options.scrollbarOffsetVertical}set scrollbarOffsetVertical(t){this.options.scrollbarOffsetVertical=t}get disable(){return this._disabled}set disable(t){this._disabled!==t&&(this._disabled=t,this.update())}get stopPropagation(){return this.options.stopPropagation}set stopPropagation(t){this.options.stopPropagation=t}get dragScroll(){return this.options.dragScroll}set dragScroll(t){this.options.dragScroll=t,t?this.content.drag():void 0!==this.content.removePlugin?this.content.removePlugin("drag"):this.content.plugins.remove("drag"),this.update()}get boxWidth(){return this.options.boxWidth}set boxWidth(t){this.options.boxWidth=t,this.content.screenWidth=t,this.update()}get overflow(){return this.options.overflow}set overflow(t){this.options.overflow=t,this.options.overflowX=t,this.options.overflowY=t,this.update()}get overflowX(){return this.options.overflowX}set overflowX(t){this.options.overflowX=t,this.update()}get overflowY(){return this.options.overflowY}set overflowY(t){this.options.overflowY=t,this.update()}get boxHeight(){return this.options.boxHeight}set boxHeight(t){this.options.boxHeight=t,this.content.screenHeight=t,this.update()}get scrollbarSize(){return this.options.scrollbarSize}set scrollbarSize(t){this.options.scrollbarSize=t}get contentWidth(){return this.options.boxWidth-(this.isScrollbarVertical?this.options.scrollbarSize:0)}get contentHeight(){return this.options.boxHeight-(this.isScrollbarHorizontal?this.options.scrollbarSize:0)}get isScrollbarVertical(){return this._isScrollbarVertical}get isScrollbarHorizontal(){return this._isScrollbarHorizontal}get scrollTop(){return this.content.top}set scrollTop(t){this.content.top=t,this._drawScrollbars()}get scrollLeft(){return this.content.left}set scrollLeft(t){this.content.left=t,this._drawScrollbars()}get scrollWidth(){return this._scrollWidth||this.content.width}set scrollWidth(t){this._scrollWidth=t}get scrollHeight(){return this._scrollHeight||this.content.height}set scrollHeight(t){this._scrollHeight=t}_drawScrollbars(){this._isScrollbarHorizontal="scroll"===this.overflowX||-1===["hidden","none"].indexOf(this.overflowX)&&this.scrollWidth>this.options.boxWidth,this._isScrollbarVertical="scroll"===this.overflowY||-1===["hidden","none"].indexOf(this.overflowY)&&this.scrollHeight>this.options.boxHeight,this.scrollbar.clear(),this.scrollWidth,this._isScrollbarVertical&&this.options.scrollbarSize,this.scrollHeight,this.isScrollbarHorizontal&&this.options.scrollbarSize;const t=this.scrollWidth+(this.isScrollbarVertical?this.options.scrollbarSize:0),i=this.scrollHeight+(this.isScrollbarHorizontal?this.options.scrollbarSize:0);this.scrollbarTop=this.content.top/i*this.boxHeight,this.scrollbarTop=this.scrollbarTop<0?0:this.scrollbarTop,this.scrollbarHeight=this.boxHeight/i*this.boxHeight,this.scrollbarHeight=this.scrollbarTop+this.scrollbarHeight>this.boxHeight?this.boxHeight-this.scrollbarTop:this.scrollbarHeight,this.scrollbarLeft=this.content.left/t*this.boxWidth,this.scrollbarLeft=this.scrollbarLeft<0?0:this.scrollbarLeft,this.scrollbarWidth=this.boxWidth/t*this.boxWidth,this.scrollbarWidth=this.scrollbarWidth+this.scrollbarLeft>this.boxWidth?this.boxWidth-this.scrollbarLeft:this.scrollbarWidth,this.isScrollbarVertical&&this.scrollbar.beginFill(this.options.scrollbarBackground,this.options.scrollbarBackgroundAlpha).drawRect(this.boxWidth-this.scrollbarSize+this.options.scrollbarOffsetVertical,0,this.scrollbarSize,this.boxHeight).endFill(),this.isScrollbarHorizontal&&this.scrollbar.beginFill(this.options.scrollbarBackground,this.options.scrollbarBackgroundAlpha).drawRect(0,this.boxHeight-this.scrollbarSize+this.options.scrollbarOffsetHorizontal,this.boxWidth,this.scrollbarSize).endFill(),this.isScrollbarVertical&&this.scrollbar.beginFill(this.options.scrollbarForeground,this.options.scrollbarForegroundAlpha).drawRect(this.boxWidth-this.scrollbarSize+this.options.scrollbarOffsetVertical,this.scrollbarTop,this.scrollbarSize,this.scrollbarHeight).endFill(),this.isScrollbarHorizontal&&this.scrollbar.beginFill(this.options.scrollbarForeground,this.options.scrollbarForegroundAlpha).drawRect(this.scrollbarLeft,this.boxHeight-this.scrollbarSize+this.options.scrollbarOffsetHorizontal,this.scrollbarWidth,this.scrollbarSize).endFill(),this.activateFade()}_drawMask(){this._maskContent.beginFill(0).drawRect(0,0,this.boxWidth,this.boxHeight).endFill(),this.content.mask=this._maskContent}update(){if(this.content.mask=null,this._maskContent.clear(),!this._disabled){this._drawScrollbars(),this._drawMask();const t=this.isScrollbarHorizontal&&this.isScrollbarVertical?"all":this.isScrollbarHorizontal?"x":"y";null!==t&&(this.options.dragScroll&&this.content.drag({clampWheel:this.options.clampWheel,direction:t}),this.content.clamp({direction:t,underflow:this.options.underflow}))}}updateLoop(t){if(this.fade){if(this.fade.wait>0){if(this.fade.wait-=t,!(this.fade.wait<=0))return;t+=this.fade.wait}this.fade.duration+=t,this.fade.duration>=this.options.fadeScrollbarTime?(this.fade=null,this.scrollbar.alpha=0):this.scrollbar.alpha=this.ease(this.fade.duration,1,-1,this.options.fadeScrollbarTime),this.content.dirty=!0}}get dirty(){return this.content.dirty}set dirty(t){this.content.dirty=t}activateFade(){!this.fade&&this.options.fade&&(this.scrollbar.alpha=1,this.fade={wait:this.options.fadeScrollboxWait,duration:0})}scrollbarDown(t){const i=this.toLocal(t.data.global);return this.isScrollbarHorizontal&&i.y>this.boxHeight-this.scrollbarSize?(i.x>=this.scrollbarLeft&&i.x<=this.scrollbarLeft+this.scrollbarWidth?this.pointerDown={type:"horizontal",last:i}:i.x>this.scrollbarLeft?(this.content.left+=this.content.worldScreenWidth,this.update()):(this.content.left-=this.content.worldScreenWidth,this.update()),void(this.options.stopPropagation&&t.stopPropagation())):this.isScrollbarVertical&&i.x>this.boxWidth-this.scrollbarSize?(i.y>=this.scrollbarTop&&i.y<=this.scrollbarTop+this.scrollbarWidth?this.pointerDown={type:"vertical",last:i}:i.y>this.scrollbarTop?(this.content.top+=this.content.worldScreenHeight,this.update()):(this.content.top-=this.content.worldScreenHeight,this.update()),void(this.options.stopPropagation&&t.stopPropagation())):void 0}scrollbarMove(t){if(this.pointerDown){if("horizontal"===this.pointerDown.type){const i=this.toLocal(t.data.global),o=this.scrollWidth+(this.isScrollbarVertical?this.options.scrollbarSize:0);this.scrollbarLeft+=i.x-this.pointerDown.last.x,this.content.left=this.scrollbarLeft/this.boxWidth*o,this.pointerDown.last=i,this.update()}else if("vertical"===this.pointerDown.type){const i=this.toLocal(t.data.global),o=this.scrollHeight+(this.isScrollbarHorizontal?this.options.scrollbarSize:0);this.scrollbarTop+=i.y-this.pointerDown.last.y,this.content.top=this.scrollbarTop/this.boxHeight*o,this.pointerDown.last=i,this.update()}this.options.stopPropagation&&t.stopPropagation()}}scrollbarUp(){this.pointerDown=null}resize(t){this.options.boxWidth=void 0!==t.boxWidth?t.boxWidth:this.options.boxWidth,this.options.boxHeight=void 0!==t.boxHeight?t.boxHeight:this.options.boxHeight,t.scrollWidth&&(this.scrollWidth=t.scrollWidth),t.scrollHeight&&(this.scrollHeight=t.scrollHeight),this.content.resize(this.options.boxWidth,this.options.boxHeight,this.scrollWidth,this.scrollHeight),this.update()}ensureVisible(t,i,o,s){this.content.ensureVisible(t,i,o,s),this._drawScrollbars()}}t.Scrollbox=a,Object.defineProperty(t,"__esModule",{value:!0})}));
//# sourceMappingURL=scrollbox.js.map