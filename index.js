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
