/*
 ********** Juicer **********
    ${A Fast template engine}
    Project Home: http://juicer.name

    Author: Guokai
    Gtalk: badkaikai@gmail.com
    Blog: http://benben.cc
    Licence: MIT License
    Version: 0.6.8-stable
*/

;(function() {

    // This is the main function for not only compiling but also rendering.
    // there's at least two parameters need to be provided, one is the tpl, 
    // another is the data, the tpl can either be a string, or an id like #id.
    // if only tpl was given, it'll return the compiled reusable(可重复使用的) function.
    // if tpl and data were given at the same time, it'll return the rendered 
    // result immediately.

    var juicer = function() {

        //  将类数组转换为真正的数组，便于使用数组的一些方法
        var args = [].slice.call(arguments);

        args.push(juicer.options);

		//  可以匹配这样的id(#:-.)
        if (args[0].match(/^\s*#([\w:\-\.]+)\s*$/igm)) {
            args[0].replace(/^\s*#([\w:\-\.]+)\s*$/igm, function($, $id) { // $(#:-.)    $id(:-.)
                // node.js环境没有`document`，所以会先判断`document`
                var _document = document;
                var elem = _document && _document.getElementById($id);
                args[0] = elem ? (elem.value || elem.innerHTML) : $;
            });
        }

        // 如果是浏览器环境
        if (typeof(document) !== 'undefined' && document.body) {
            // 先编译`document.body.innerHTML`一次
            juicer.compile.call(juicer, document.body.innerHTML);
        }

        //  一个参数，返回编译后的模板
        if (arguments.length == 1) {
            return juicer.compile.apply(juicer, args);
        }

        //  2个参数，编译模板后立即渲染数据
        if (arguments.length >= 2) {
            return juicer.to_html.apply(juicer, args);
        }
    };


    //  html转义字符操作对象
    var __escapehtml = {
        //  几种html字符转义集合
        escapehash: {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2f;'
        },
        //  根据传入的html字符进行转义
        escapereplace: function(k) {
            return __escapehtml.escapehash[k];
        },
        //  如果传入的str不是字符串，直接返回
        //  否则调用escapereplace方法对html字符转义替换
        escaping: function(str) {
            return typeof(str) !== 'string' ? str : str.replace(/[&<>"]/igm, this.escapereplace);
        },
        // 检测变量是否定义
        detection: function(data) {
            return typeof(data) === 'undefined' ? '' : data;
        }
    };

    //  如果控制台支持打印，从警告级别打印出错误信息。否则直接抛出
    var __throw = function(error) {
        if (typeof(console) !== 'undefined') {
            if (console.warn) {
                console.warn(error);
                return;
            }

            if (console.log) {
                console.log(error);
                return;
            }
        }

        throw (error);
    };

    // 传入两个对象，并返回一个对象，这个新对象同时具有两个对象的属性和方法。
    // 由于 o 是引用传递，因此 o 会被修改
    var __creator = function(o, proto) {
        o = o !== Object(o) ? {} : o; // 如果o不是引用类型

        if (o.__proto__) { // 如果可以使用__proto__
            o.__proto__ = proto;
            return o;
        }

        var empty = function() {};
        var n = Object.create ? //  如果支持create创建对象，用它创建对象。否则new一个对象
            Object.create(proto) :
            new(empty.prototype = proto, empty);

        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                n[i] = o[i]; // 将o的自有属性赋值到n上
            }
        }

        return n; // 返回一个带有参数自有属性的对象
    };

    var annotate = function(fn) {
        //  function (), function func()
        //  函数签名
        var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
        //  ,
        var FN_ARG_SPLIT = /,/;
        // _arg_?
        // 匹配参数，如果开头有下划线结尾也得有下划线
        // 因此自定义函数应避免使用`_X_`形式作为形参
        var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
        // 匹配函数的代码块里语句
        // [\s\S]*  .*  在单行模式下，2者相同，都是匹配任意字符
        // 贪婪匹配与非贪婪匹配（前提都是尽可能保证整个表达式匹配成功）
        var FN_BODY = /^function[^{]+{([\s\S]*)}/m;
        // 匹配注释(//...)或/**/
        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        var args = [],
            fnText,
            fnBody,
            argDecl;

        if (typeof fn === 'function') {
            //  如果函数有形参,arguments获取实参的个数
            if (fn.length) {
                // 获取该函数定义的文本
                fnText = fn.toString();
            }
        } else if (typeof fn === 'string') {
            fnText = fn;
        }

        //  去掉注释后的文本
        fnText = fnText.replace(STRIP_COMMENTS, '');
        fnText = fnText.trim();
        //  得到参数数组
        argDecl = fnText.match(FN_ARGS);
        //  得到函数体文本
        fnBody = fnText.match(FN_BODY)[1].trim();

        for (var i = 0; i < argDecl[1].split(FN_ARG_SPLIT).length; i++) {
            var arg = argDecl[1].split(FN_ARG_SPLIT)[i];
            arg.replace(FN_ARG, function(all, underscore, name) { // TODO 函数的各个参数
                args.push(name);
            });
        }

        //  返回一个数组[[arg1, arg2], '函数体文本']
        return [args, fnBody];
    };

    juicer.__cache = {};
    juicer.version = '0.6.8-stable';
    juicer.settings = {}; // 放置forstart：{@each data as item, index}等的正则

    juicer.tags = {
        operationOpen: '{@',
        operationClose: '}',
        interpolateOpen: '\\${',
        interpolateClose: '}',
        // 禁止对其内容转义的变量开
        noneencodeOpen: '\\$\\${',
        // 禁止对其内容转义的变量闭
        noneencodeClose: '}',
        commentOpen: '\\{#',
        commentClose: '\\}'
    };

    juicer.options = { // 配置缓存，剥除注释，错误处理，检测数据是否为空等选项
        //  是否缓存模板编译结果
        cache: true,
        strip: true, //  默认进行空白去除
        errorhandling: true,
        // 开启后，如果变量未定义，将用空白字符串代替变量位置，否则照常输出
        // 所以如果关闭此项，有可能造成输出 undefined
        detection: true,

        //  注册函数保存
        //  系统函数和用户自定义函数都保存在该_method中
        //  因此修改和注销时务必小心
        _method: __creator({
            __escapehtml: __escapehtml,
            __throw: __throw,
            __juicer: juicer
        }, {})
    };

    // 定义各种匹配正则表达式
    juicer.tagInit = function() {
        var forstart = juicer.tags.operationOpen + 'each\\s*([^}]*?)\\s*as\\s*(\\w*?)\\s*(,\\s*\\w*?)?' + juicer.tags.operationClose;
        var forend = juicer.tags.operationOpen + '\\/each' + juicer.tags.operationClose;
        var ifstart = juicer.tags.operationOpen + 'if\\s*([^}]*?)' + juicer.tags.operationClose;
        var ifend = juicer.tags.operationOpen + '\\/if' + juicer.tags.operationClose;
        var elsestart = juicer.tags.operationOpen + 'else' + juicer.tags.operationClose;
        var elseifstart = juicer.tags.operationOpen + 'else if\\s*([^}]*?)' + juicer.tags.operationClose;
        // 匹配变量${  }
        var interpolate = juicer.tags.interpolateOpen + '([\\s\\S]+?)' + juicer.tags.interpolateClose;
        // 匹配不对其内容转义的变量$${}
        var noneencode = juicer.tags.noneencodeOpen + '([\\s\\S]+?)' + juicer.tags.noneencodeClose;
        var inlinecomment = juicer.tags.commentOpen + '[^}]*?' + juicer.tags.commentClose;
        // for辅助循环
        // {@each data in range value,key}
        var rangestart = juicer.tags.operationOpen + 'each\\s*(\\w*?)\\s*in\\s*range\\(([^}]+?)\\s*,\\s*([^}]+?)\\)' + juicer.tags.operationClose;
        // 引入子模板
        // {@include tpl, data}
        var include = juicer.tags.operationOpen + 'include\\s*([^}]*?)\\s*,\\s*([^}]*?)' + juicer.tags.operationClose;
        // 内联辅助函数开始
        // {@helper funName}
        var helperRegisterStart = juicer.tags.operationOpen + 'helper\\s*([^}]*?)\\s*' + juicer.tags.operationClose; //{@helper}
        // 辅助函数代码块内语句
        var helperRegisterBody = '([\\s\\S]*?)';
        // {@/helper}
        var helperRegisterEnd = juicer.tags.operationOpen + '\\/helper' + juicer.tags.operationClose; //{@/helper}

        juicer.settings.forstart = new RegExp(forstart, 'igm');
        juicer.settings.forend = new RegExp(forend, 'igm');
        juicer.settings.ifstart = new RegExp(ifstart, 'igm');
        juicer.settings.ifend = new RegExp(ifend, 'igm');
        juicer.settings.elsestart = new RegExp(elsestart, 'igm');
        juicer.settings.elseifstart = new RegExp(elseifstart, 'igm');
        juicer.settings.interpolate = new RegExp(interpolate, 'igm');
        juicer.settings.noneencode = new RegExp(noneencode, 'igm');
        juicer.settings.inlinecomment = new RegExp(inlinecomment, 'igm');
        juicer.settings.rangestart = new RegExp(rangestart, 'igm');
        juicer.settings.include = new RegExp(include, 'igm');
        juicer.settings.helperRegister = new RegExp(helperRegisterStart + helperRegisterBody + helperRegisterEnd, 'igm');
    };

    juicer.tagInit();

    // Using this method to set the options by given conf-name and conf-value,
    // you can also provide more than one key-value pair wrapped by an object.
    // this interface also used to custom the template tag delimater, for this
    // situation, the conf-name must begin with tag::, for example: juicer.set
    // ('tag::operationOpen', '{@').

    // 设置各种配置
    // 2种传参方式juicer.set('cache', false),jucer.set({cache: false})
    juicer.set = function(conf, value) {
        var that = this;

        // $ () [] + ^ {} ? * | . 
        // 添加双斜杠转义
        var escapePattern = function(v) {
            return v.replace(/[\$\(\)\[\]\+\^\{\}\?\*\|\.]/igm, function($) {
                return '\\' + $;
            });
        };

        var set = function(conf, value) {
            //  得到匹配以tag::开头的数组
            var tag = conf.match(/^tag::(.*)$/i);

            if (tag) {
                //  用自定义语法边界符替换系统默认语法边界符
                // tag[1] = operationOpen,operationClose等语法边界符
                // 由于系统这里没有判断语法边界符是否是系统所用的
                // 所以一定要拼写正确
                that.tags[tag[1]] = escapePattern(value);
                //  重新初始化自定义语法边界符
                that.tagInit();
                return;
            }

            // 否则相当于自定义选项
            that.options[conf] = value;
        };

        //  key,value作为分别作为参数进行传参
        if (arguments.length === 2) {
            set(conf, value);
            return;
        }

        //  以对象的方式进行传参
        if (conf === Object(conf)) {
            for (var i in conf) {
                if (conf.hasOwnProperty(i)) {
                    //  循环调用上面的set方法进行初始化语法边界符
                    set(i, conf[i]);
                }
            }
        }
    };

    // Before you're using custom functions in your template like ${name | fnName},
    // you need to register this fn by juicer.register('fnName', fn).
    // 在模板中使用自定义函数，需要先注册
    juicer.register = function(fname, fn) {
        var _method = this.options._method;

        //  如果自定义函数和系统函数同名
        // 如果已经注册了该函数，不允许覆盖
        if (_method.hasOwnProperty(fname)) {
            return false;
        }

        //  将自定义函数添加到_method中返回
        return _method[fname] = fn;
    };

    // remove the registered function in the memory by the provided function name.
    // for example: juicer.unregister('fnName').

    juicer.unregister = function(fname) {
        var _method = this.options._method;

        // 没有检测是否注销的是系统自定义函数
        // 用户不要注销错了
        // 成功删除，返回true，否则返回false
        if (_method.hasOwnProperty(fname)) {
            return delete _method[fname];
        }
    };

    /**
     * 模板引擎
     * 作为构造函数使用
     * 注意，此处的options是覆盖，而不是合并
     */
    juicer.template = function(options) {
        var that = this;

        this.options = options;

        /**
         * 插入，篡改
           变量解析方法
          _escape是否需要转义
        
      该方法也可以用来创建自定义函数
        // 或者在模板内通过内联辅助函数间接创建
          {@helper echoArgs}
            function(a,b){
                return a+b;
          }
          {@/helper}
        // 本质仍然是使用了`juicer.register`
         通过`juicer.register`直接创建
        juicer.register('echoArgs',function(a,b){
            return a + b;
        });
        
         */
        this.__interpolate = function(_name, _escape, options) {
            //function f(a, b,c){console.log(a+";"+b+";"+c)};f.call({}, ["name,age,address"]);
            //name,age,address;undefined;undefined
            //  ${item.name,item.age | fnName, arg1, arg2}
            //  ${item.name | fnName,item.age, arg1, arg2}
            //  _fn为变量名，此处先暂取_define[0]
            var _define = _name.split('|'),
                _fn = _define[0] || '',
                _cluster;

            if (_define.length > 1) {
                //  变量
                _name = _define.shift(); // shift删除数组的第一个元素，并返回该值
                //  函数名和参数数组
                _cluster = _define.shift().split(',');
                // _cluster.shift() 取得函数名
                // '_method.' + _cluster.shift() 从_method中取得注册函数
                //  [_name].concat(_cluster) 将变量和自己传入的参数一同作为函数的参数传入
                _fn = '_method.' + _cluster.shift() + '.call({}, ' + [_name].concat(_cluster) + ')';
            }

            /**
             * _fn = _method[_cluster.shift()].call({}, [_name].concat(_cluster))
             * <%=_method.__escapehtml.escaping(_method.__escapehtml.detection(`_fn`))%>
             */
            return '<%= ' + (_escape ? '_method.__escapehtml.escaping' : '') + '(' +
                (!options || options.detection !== false ? '_method.__escapehtml.detection' : '') + '(' +
                _fn + ')' + ')' + ' %>';
        };

        //  模板解析方法
        //  返回处理后的模板
        this.__removeShell = function(tpl, options) {
            //  计数器
            //  利用计数器避免遍历时创建的临时变量与其他变量冲突
            var _counter = 0;

            tpl = tpl
                //  inline helper register
                //  juicer.settings.helperRegister内联辅助注册函数
                .replace(juicer.settings.helperRegister, function($, helperName, fnText) {
                    // [fnargs, fnbody]
                    var anno = annotate(fnText);
                    var fnArgs = anno[0];
                    var fnBody = anno[1];
                    //  new Function(arg1, arg2 [,arg3...], fnbody)
                    //  这种方法创建的函数比较适合在nodejs和全局环境中使用
                    //  前面的参数都是构造函数的参数，最后一个是函数体（都是字符串的形式）
                    var fn = new Function(fnArgs.join(','), fnBody);

                    juicer.register(helperName, fn);
                    // 没有清除{@helper}...{@/helper}
                    // 如果要清楚，应该return ''
                    return $;
                    //                    return '';
                })

            // for expression
            // 'each\\s*([^}]*?)\\s*as\\s*(\\w*?)\\s*(,\\s*\\w*?)?'
            // {@each data as item, index}
            .replace(juicer.settings.forstart, function($, _name, alias, key) {
                    var alias = alias || 'value',
                        key = key && key.substr(1); //  substring(start, end)  substr(start, length)
                    var _iterate = 'i' + _counter++;
                    /**
                     * 返回替换结果，举例如下
                     * <% ~function(){
                       for(var i0 in names){
                          if(names.hasOwnProperty(i0)){
                              var name = names[i0];
                              var index = i0;
                       %>
                     */
                    //  数组可以用for in循环，也可以调用hasOwnProperty方法
                    //  [2,3].hasOwnProperty(3) ==>true
                    return '<% ~function() {' +
                        'for(var ' + _iterate + ' in ' + _name + ') {' +
                        'if(' + _name + '.hasOwnProperty(' + _iterate + ')) {' +
                        'var ' + alias + '=' + _name + '[' + _iterate + '];' +
                        (key ? ('var ' + key + '=' + _iterate + ';') : '') +
                        ' %>';
                })
                .replace(juicer.settings.forend, '<% }}}(); %>')

            // if expression
            // {@if item.name != ''}
            // 'if\\s*([^}]*?)'
            .replace(juicer.settings.ifstart, function($, condition) {
                    return '<% if(' + condition + ') { %>';
                })
                .replace(juicer.settings.ifend, '<% } %>')

            // else expression
            .replace(juicer.settings.elsestart, function($) {
                return '<% } else { %>';
            })

            // else if expression
            .replace(juicer.settings.elseifstart, function($, condition) {
                return '<% } else if(' + condition + ') { %>';
            })

            // interpolate without escape
            // '([\\s\\S]+?)'
            // 解析禁止对其内容转义的变量
            .replace(juicer.settings.noneencode, function($, _name) {
                return that.__interpolate(_name, false, options);
            })

            // interpolate with escape
            .replace(juicer.settings.interpolate, function($, _name) {
                return that.__interpolate(_name, true, options);
            })

            // clean up comments
            // {#}   '[^}]*?'
            // 去掉注释
            .replace(juicer.settings.inlinecomment, '')

            // range expression
            // 'each\\s*(\\w*?)\\s*in\\s*range\\(([^}]+?)\\s*,\\s*([^}]+?)\\)'
            // 解析辅助循环
            .replace(juicer.settings.rangestart, function($, _name, start, end) {
                var _iterate = 'j' + _counter++;
                return '<% ~function() {' +
                    'for(var ' + _iterate + '=' + start + ';' + _iterate + '<' + end + ';' + _iterate + '++) {{' +
                    'var ' + _name + '=' + _iterate + ';' +
                    ' %>';
            })

            // include sub-template
            // 'include\\s*([^}]*?)\\s*,\\s*([^}]*?)'
            // 子模板渲染
            .replace(juicer.settings.include, function($, tpl, data) {
                // compatible for node.js
                // 如果是node.js环境
                if (tpl.match(/^file\:\/\//igm)) return $;
                return '<%= _method.__juicer(' + tpl + ', ' + data + '); %>';
            });

            // exception handling
            if (!options || options.errorhandling !== false) {
                tpl = '<% try { %>' + tpl;
                tpl += '<% } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} %>';
            }

            return tpl;
        };

        //  转换为js可执行的模板
        // 根据`juicer.options.strip`判断是否清除多余空白
        // 而后调用`juicer.template.__convert`
        this.__toNative = function(tpl, options) {
            return this.__convert(tpl, !options || options.strip);
        };

        // 词法分析，生成变量和自定义函数定义语句
        this.__lexicalAnalyze = function(tpl) {
            var buffer = []; // 变量
            var method = []; // 方法，已经存储到`juicer.options.__method`才能被采用
            var prefix = ''; // 返回结果
            var reserved = [
                'if', 'each', '_', '_method', 'console',
                'break', 'case', 'catch', 'continue', 'debugger', 'default', 'delete', 'do',
                'finally', 'for', 'function', 'in', 'instanceof', 'new', 'return', 'switch',
                'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'null', 'typeof',
                'class', 'enum', 'export', 'extends', 'import', 'super', 'implements', 'interface',
                'let', 'package', 'private', 'protected', 'public', 'static', 'yield', 'const', 'arguments',
                'true', 'false', 'undefined', 'NaN'
            ];

            //  自定义数组indexOf方法
            var indexOf = function(array, item) {
                //  支持Array的indexOf方法，就调用Array.indexOf方法
                if (Array.prototype.indexOf && array.indexOf === Array.prototype.indexOf) {
                    return array.indexOf(item);
                }

                for (var i = 0; i < array.length; i++) {
                    if (array[i] === item) return i;
                }

                return -1;
            };

            var variableAnalyze = function($, statement) {
                statement = statement.match(/\w+/igm)[0];

                // 如果没有分析过，并且非保留字符
                if (indexOf(buffer, statement) === -1 && indexOf(reserved, statement) === -1 && indexOf(method, statement) === -1) {

                    // avoid re-declare native function, if not do this, template 
                    // `{@if encodeURIComponent(name)}` could be throw undefined.

                    // 跳过window内置函数
                    if (typeof(window) !== 'undefined' && typeof(window[statement]) === 'function' && window[statement].toString().match(/^\s*?function \w+\(\) \{\s*?\[native code\]\s*?\}\s*?$/i)) {
                        return $;
                    }

                    // 跳过node.js内置函数
                    // compatible for node.js
                    if (typeof(global) !== 'undefined' && typeof(global[statement]) === 'function' && global[statement].toString().match(/^\s*?function \w+\(\) \{\s*?\[native code\]\s*?\}\s*?$/i)) {
                        return $;
                    }

                    // avoid re-declare registered function, if not do this, template 
                    // `{@if registered_func(name)}` could be throw undefined.

                    // 如果是自定义函数
                    if (typeof(juicer.options._method[statement]) === 'function' || juicer.options._method.hasOwnProperty(statement)) {
                        method.push(statement);
                        return $;
                    }

                    buffer.push(statement); // fuck ie
                }

                return $;
            };

            // 分析出现在for/变量/if/elseif/include中的变量名
            tpl.replace(juicer.settings.forstart, variableAnalyze).
            replace(juicer.settings.interpolate, variableAnalyze).
            replace(juicer.settings.ifstart, variableAnalyze).
            replace(juicer.settings.elseifstart, variableAnalyze).
            replace(juicer.settings.include, variableAnalyze).
            replace(/[\+\-\*\/%!\?\|\^&~<>=,\(\)\[\]]\s*([A-Za-z_]+)/igm, variableAnalyze);

            // 遍历要定义的变量
            for (var i = 0; i < buffer.length; i++) {
                // prefix = 'var arg1 = _.arg1;var arg2 = _.arg2;'
                prefix += 'var ' + buffer[i] + '=_.' + buffer[i] + ';';
            }

            // 遍历要创建的函数表达式
            for (var i = 0; i < method.length; i++) {
                prefix += 'var ' + method[i] + '=_method.' + method[i] + ';';
            }

            return '<% ' + prefix + ' %>';
        };

        //通过不断替换切割等组成函数语句。
        this.__convert = function(tpl, strip) {
            var buffer = [].join(''); //  创建一个空字符串

            buffer += "'use strict';"; // use strict mode
            buffer += "var _=_||{};";
            buffer += "var _out='';_out+='";

            if (strip !== false) {
                buffer += tpl
                    .replace(/\\/g, "\\\\") //  单斜杠转义
                    .replace(/[\r\t\n]/g, " ") //  换行符，制表符替换
                    .replace(/'(?=[^%]*%>)/g, "\t") // 使%>和其中的代码字符串保持一个tab符
                    .split("'").join("\\'")
                    .split("\t").join("'")
                    .replace(/<%=(.+?)%>/g, "';_out+=$1;_out+='")
                    .split("<%").join("';")
                    .split("%>").join("_out+='") +
                    "';return _out;";

                return buffer;
            }

            buffer += tpl
                .replace(/\\/g, "\\\\")
                .replace(/[\r]/g, "\\r")
                .replace(/[\t]/g, "\\t")
                .replace(/[\n]/g, "\\n")
                .replace(/'(?=[^%]*%>)/g, "\t")
                .split("'").join("\\'")
                .split("\t").join("'")
                .replace(/<%=(.+?)%>/g, "';_out+=$1;_out+='")
                .split("<%").join("';")
                .split("%>").join("_out+='") +
                "';return _out.replace(/[\\r\\n]\\s+[\\r\\n]/g, '\\r\\n');";

            return buffer;
        };

        // 渲染模板的入口
        this.parse = function(tpl, options) {
            var _that = this;

            if (!options || options.loose !== false) {
                tpl = this.__lexicalAnalyze(tpl) + tpl;
            }

            tpl = this.__removeShell(tpl, options);
            tpl = this.__toNative(tpl, options);

            this._render = new Function('_, _method', tpl);

            this.render = function(_, _method) {
                if (!_method || _method !== that.options._method) {
                    _method = __creator(_method, that.options._method);
                }

                return _that._render.call(this, _, _method);
            };

            return this;
        };
    };

    //  编译模板，如果成功编译，返回编译后的模板
    juicer.compile = function(tpl, options) {
        if (!options || options !== this.options) {
            options = __creator(options, this.options);
        }

        try {
            var engine = this.__cache[tpl] ?
                this.__cache[tpl] :
                new this.template(this.options).parse(tpl, options);

            if (!options || options.cache !== false) {
                this.__cache[tpl] = engine;
            }

            return engine; // 如果成功编译，返回编译后的模板

        } catch (e) {
            __throw('Juicer Compile Exception: ' + e.message);

            return {
                render: function() {} // noop
            };
        }
    };

    juicer.to_html = function(tpl, data, options) {
        if (!options || options !== this.options) {
            options = __creator(options, this.options);
        }

        return this.compile(tpl, options).render(data, options._method);
    };

    window.juicer = juicer
})()
