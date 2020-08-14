/**
 *  接下来，我们开始编写我们的交互插件。
    我们假设组件的弹出层就是一个对象。则这个对象是包含了我们的交互、样式、结构及渲染的过程。于是我们定义了一个构造方法：
    function MyDialog(){} // MyDialog就是我们的组件对象了
    对象MyDialog就相当于一个绳子，我们只要往这个绳子上不断地挂上钩子就是一个组件了。于是我们的组件就可以表示为：

    function MyDialog(){}
    MyDialog.prototype = {
        constructor: this,
        _initial: function(){},
        _parseTpl: function(){},
        _parseToDom: function(){},
        show: function(){},
        hide: function(){},
        css: function(){},
        ...
    }
    然后就可以将插件的功能都写上。不过中间的业务逻辑，需要自己去一步一步研究。无论如何写，我们最终要做到通过实例化一个MyDialog对象就可以使用我们的插件了。
    在编写的过程中，我们得先做一些工具函数：
 */

 //对象合并
 function extend(o,n,override) {
     for(var key in n){
         if(n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)){
             o[key]=n[key];
         }
     }
     return o;
 }

 //自定义模板引擎解释函数
 function templateEngine(html,data){
     var re = /<%([^%>]+)?%>/g,
        reExp = /(^()?(if|for|else|switch|case|break|{|}))(.*)?/g,
        code = 'var r=[];\n',
        cursor = 0;
    var match;
    var add = function(line,js) {
        js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
            (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
            return add;
    }
    while(match = re.exec(html)){
        add(html.slice(cursor,match.index))(match[1],true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor,html.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(data);

 }