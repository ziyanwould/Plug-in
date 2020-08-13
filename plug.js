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