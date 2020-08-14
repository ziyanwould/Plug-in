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