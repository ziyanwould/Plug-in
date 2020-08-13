/**
 * OK，现在已经实现我们所需要的所有功能。并且我们也把这些函数都写到一个js里面了。如果是一个人在用，那么可以很清楚知道自己是否已经定义了什么，并且知道自己写了什么内容，我在哪个页面需要，那么就直接引入这个js文件就可以搞定了。
不过，如果是两个人以上的团队，或者你与别人一起协作写代码，这时候，另一个人并不知道你是否写了add方法，这时他也定义了同样的add方法。那么你们之间就会产生命名冲突，一般称之为变量的 全局污染

用全局对象包装
为了解决这种全局变量污染的问题。这时，我们可以定义一个js对象来接收我们这些工具函数。
上面的方式，约定好此插件名为plugin，让团队成员都要遵守命名规则，在一定程度上已经解决了全局污染的问题。在团队协作中只要约定好命名规则了，告知其它同学即可以
 */
var plugin = {
    add: function(n1,n2){ return n1 + n2;},//加
    sub: function(n1,n2){return n1 - n2;},//减
    mul: function(n1,n2){return n1 * n2;},//乘
    div: function(n1,n2){ return n1 / n2;},//除
    sur: function(n1,n2){return n1 % n2;} //余
}
// 调用
plugin.add(1,2)
console.log(plugin.add(1,2))
// 输出：3


//http://www.ruanyifeng.com/blog/2011/05/how_to_judge_the_existence_of_a_global_object_in_javascript.html  var 为什么会导致变量提升

//可能你会这么干来解决掉命名冲突问题：
if(!plugin){ //这里的if条件也可以用： (typeof plugin == 'undefined')
    var plugin = {
        // 以此写你的函数逻辑
        //var 为什么会导致变量提升
    }
}

//或者
var plugin;
if(!plugin){
    plugin = {
        // ...
    }
}


/**
 * 利用闭包包装
上面的例子，虽然可以实现了插件的基本上的功能。不过我们的plugin对象，是定义在全局域里面的。我们知道，js变量的调用，
从全局作用域上找查的速度会比在私有作用域里面慢得多得多。所以，我们最好将插件逻辑写在一个私有作用域中。
实现私有作用域，最好的办法就是使用闭包。可以把插件当做一个函数，插件内部的变量及函数的私有变量，为了在调用插件后依旧能使用其功能，
闭包的作用就是延长函数(插件)内部变量的生命周期，使得插件函数可以重复调用，而不影响用户自身作用域。
故需将插件的所有功能写在一个立即执行函数中：
 */

;(function(global,undefined){
    var plugin = {
        add: function(n1,n2){ return n1 + n2;},//加
        sub: function(n1,n2){return n1 - n2;},//减
        mul: function(n1,n2){return n1 * n2;},//乘
        div: function(n1,n2){ return n1 / n2;},//除
        sur: function(n1,n2){return n1 % n2;} //余
    }
    //最后将插件对象暴露给全局对象
    'plugin' in global && (global.plugin = plugin)
})(window)


/**
 * 对上面的代码段传参问题进行解释一下：

在定义插件之前添加一个分号，可以解决js合并时可能会产生的错误问题；
undefined在老一辈的浏览器是不被支持的，直接使用会报错，js框架要考虑到兼容性，因此增加一个形参undefined，就算有人把外面的 undefined 定义了，里面的 undefined 依然不受影响；
把window对象作为参数传入，是避免了函数执行的时候到外部去查找。
 */

 console.log(plugin.mul(3,8))


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