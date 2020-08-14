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

/**
 * 
 * 插件的API
插件的默认参数
我们知道，函数是可以设置默认参数这种说法，而不管我们是否传有参数，我们都应该返回一个值以告诉用户我做了怎样的处理，比如：

function add(param){
    var args = !!param ? Array.prototype.slice.call(arguments) : [];
    return args.reduce(function(pre,cur){
        return pre + cur;
    }, 0);
}

console.log(add()) //不传参，结果输出0，则这里已经设置了默认了参数为空数组
console.log(add(1,2,3,4,5)) //传参，结果输出15
则作为一个健壮的js插件，我们应该把一些基本的状态参数添加到我们需要的插件上去。
假设还是上面的加减乘除余的需求，我们如何实现插件的默认参数呢？道理其实是一样的。


 */ 
;(function(undefined){
    "use strict"
     var _global;

     function result(args,fn){
         /**
          * 所以整个过程我们基本就可以分2步进行理解了

            Array.prototype.slice.call(arguments)
            理解第一步:  其中，arguments是一个具有length属性的对象, 通过call 这个方法，把arguments 指向了Array.prototype.slice方法的作用域，
            也就是说通过call方法，让Array.prototype.slice对arguments对象进行操作

            理解第二步:  Array.prototype.slice就是对该对象使用Array类的slice方法。但是呢arguments它又不是个Array对象
                    */

         var argsArr = Array.prototype.slice.call(args); //将函数的实际参数转换成数组的方法
         if(argsArr.length>0){
             return argsArr.reduce(fn);
         } else {
             return 0;
         }
     }

     var plugin = {
         add:function(){
             return result(arguments,function(pre,cur){
                 return  pre + cur
             })
         },
         sub:function(){
             return result(arguments,function(pre,cur){
                 return pre -cur
             })
         },
         mul:function(){
             return result(arguments,function(pre,cur){
                 return pre * cur;
             })
         },
         div:function(){
             return result(arguments,function(pre,cur){
                 return pre / cur;
             })
         },
         sur:function(){
             return result(arguments,function(pre,cur){
                 return pre % cur;
             })
         }
     }

     //最后将全局插件对象暴露给全局对象
     _global = (function(){ return this || (0,eval)('this');}());
     if (typeof module !== "undefined" && module.exports){
         module.exports = plugin;
     } else if (typeof define === "function" && define.amd){
         define(function(){return plugin;});
     }else{
         !('plugin' in _global) && (_global.plugin = plugin);
     }
}());

// 输出结果为：
with(plugin){
    console.log(add()); // 0
    console.log(sub()); // 0
    console.log(mul()); // 0
    console.log(div()); // 0
    console.log(sur()); // 0

    console.log(add(2,1)); // 3
    console.log(sub(2,1)); // 1
    console.log(mul(2,1)); // 2
    console.log(div(2,1)); // 2
    console.log(sur(2,1)); // 0
}

//实际上，插件都有自己的默认参数，




/*
JavaScript中，万物皆对象，所有对象都是继承自原型。JS在创建对象（不论是普通对象还是函数对象）的时候，都有一个叫做__proto__的内置属性，用于指向创建它的函数对象的原型对象prototype。
关于原型问题，感兴趣的同学可以看这篇：js原型链
在上面的需求中，我们可以将plugin对象改为原型的方式，则需要将plugin写成一个构造方法，我们将插件名换为Calculate避免因为Plugin大写的时候与Window对象中的API冲突。
*/ 

//假设我们的插件是对初始化参数进行运算并只输出结果，我们可以稍微改一下：

// plugin.js
// plugin.js
;(function(undefined) {
    "use strict"
    var _global;

    function result(args,type){
        var argsArr = Array.prototype.slice.call(args);
        if(argsArr.length == 0) return 0;
        switch(type) {
            case 1: return argsArr.reduce(function(p,c){return p + c;});
            case 2: return argsArr.reduce(function(p,c){return p - c;});
            case 3: return argsArr.reduce(function(p,c){return p * c;});
            case 4: return argsArr.reduce(function(p,c){return p / c;});
            case 5: return argsArr.reduce(function(p,c){return p % c;});
            default: return 0;
        }
    }

    function Calculate(){}
    Calculate.prototype.add = function(){console.log(result(arguments,1));return this;}
    Calculate.prototype.sub = function(){console.log(result(arguments,2));return this;}
    Calculate.prototype.mul = function(){console.log(result(arguments,3));return this;}
    Calculate.prototype.div = function(){console.log(result(arguments,4));return this;}
    Calculate.prototype.sur = function(){console.log(result(arguments,5));return this;}


    // 最后将插件对象暴露给全局对象
    _global = (function(){ return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = Calculate;
    } else if (typeof define === "function" && define.amd) {
        define(function(){return Calculate;});
    } else {
        !('Calculate' in _global) && (_global.Calculate = Calculate);
    }
}());

var plugin = new Calculate();
plugin
    .add(2,1)
    .sub(2,1)
    .mul(2,1)
    .div(2,1)
    .sur(2,1);