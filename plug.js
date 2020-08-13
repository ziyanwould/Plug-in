/*使用模块化的规范包装
虽然上面的包装基本上已经算是ok了的。但是如果是多个人一起开发一个大型的插件，这时我们要该怎么办呢？多人合作，肯定会产生多个文件，每个人负责一个小功能，那么如何才能将所有人开发的代码集合起来呢？
这是一个讨厌的问题。要实现协作开发插件，必须具备如下条件：

每功能互相之间的依赖必须要明确，则必须严格按照依赖的顺序进行合并或者加载
每个子功能分别都要是一个闭包，并且将公共的接口暴露到共享域也即是一个被主函数暴露的公共对象
关键如何实现，有很多种办法。最笨的办法就是按顺序加载js

<script type="text/javascript" src="part1.js"></script>
<script type="text/javascript" src="part2.js"></script>
<script type="text/javascript" src="part3.js"></script>
...
<script type="text/javascript" src="main.js"></script>
但是不推荐这么做，这样做与我们所追求的插件的封装性相背。
不过现在前端界有一堆流行的模块加载器，比如require、seajs，或者也可以像类似于Node的方式进行加载，不过在浏览器端，我们还得利用打包器来实现模块加载，比如browserify。
不过在此不谈如何进行模块化打包或者加载的问题，如有问题的同学可以去上面的链接上看文档学习。
为了实现插件的模块化并且让我们的插件也是一个模块，我们就得让我们的插件也实现模块化的机制。
我们实际上，只要判断是否存在加载器，如果存在加载器，我们就使用加载器，如果不存在加载器。我们就使用顶级域对象。
*/

//这样子我们的完整的插件的样子应该是这样子的：
;(function(undefined){
    "use strict"
    var _global;
    var plugin = {
        add: function(n1,n2){ return n1 + n2},//加
        sub: function(n1,n2){ return n1 - n2; },//减
        mul: function(n1,n2){ return n1 * n2; },//乘
        div: function(n1,n2){ return n1 / n2; },//除
        sur: function(n1,n2){ return n1 % n2; } //余
    }
    //最后将插件对象暴露给全局对象。
    _global = (function(){return this || (0,eval)('this');}());
    if(typeof module !== "undefined" && module.exports){
        module.exports = plugin;
    } else if (typeof define === "function" && define.amd){
        define(function(){return plugin;});
    }else{
        !('plugin' in _global) && (_global.plugin = plugin)
    }
}());
//我们引入了插件之后，则可以直接使用plugin对象。

with(plugin){
    console.log(add(2,1))
    console.log(sub(2,1))
    console.log(mul(2,1))
    console.log(div(2,1))
    console.log(sur(2,1))
}