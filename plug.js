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