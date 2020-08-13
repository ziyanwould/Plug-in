/*
*我们觉得直接自运行函数传window对象进去，我觉得还是不太妥当。我们并不确定我们的插件就一定用于浏览器上，也有可能使用在一些非浏览端上。
所以我们还可以这么干，我们不传参数，直接取当前的全局this对象为作顶级对象用。
*/ 
;(function(global,underfined){
    "use strict"//使用js严格模式检查，使语法更规范
     var _global;
     var plugin = {
        add: function(n1,n2){ return n1 + n2;},//加
        sub: function(n1,n2){return n1 - n2;},//减
        mul: function(n1,n2){return n1 * n2;},//乘
        div: function(n1,n2){ return n1 / n2;},//除
        sur: function(n1,n2){return n1 % n2;} //余
     }
     //最后将插件对象暴露给全局对象
     _global = (function(){ return this || (0,eval)('this');}());  //使得严格模式指向也不会是underfined
     !('plugin' in _global) && (_global.plugin= plugin);
}())

/**
 * 如此，我们不需要传入任何参数，并且解决了插件对环境的依事性。如此我们的插件可以在任何宿主环境上运行了。
 */

console.log(plugin.mul(3,5))

//关于立即自执行函数，有两种写法：
// 写法一
(function(){})()

//写法二
(function(){}())


/**
 * 附加一点知识：
    js里面()括号就是将代码结构变成表达式，被包在()里面的变成了表达式之后，则就会立即执行，js中将一段代码变成表达式有很多种方式，比如：
 */
void function(){...}();
// 或者
!function foo(){...}();
// 或者
+function foot(){...}();