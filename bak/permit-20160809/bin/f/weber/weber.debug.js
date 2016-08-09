/*
* weber - web develop tool
* name: default 
* version: 1.3.0
* build: 2016-07-21 16:40:20
* files: 65(63)
*    partial/default/begin.js
*    core/Module.js
*    core/Node.js
*    core/$.js
*    core/Weber.js
*    core/console.js
*    excore/Config.js
*    excore/Defaults.js
*    excore/Log.js
*    excore/Config/Data.js
*    excore/String.js
*    excore/Tasks.js
*    excore/Url.js
*    crypto/MD5.js
*    fs/Directory.js
*    fs/File.js
*    fs/FileRefs.js
*    fs/Path.js
*    fs/Patterns.js
*    html/Attribute.js
*    html/CssLinks.js
*    html/HtmlLinks.js
*    html/HtmlList.js
*    html/JsList.js
*    html/JsScripts.js
*    html/LessLinks.js
*    html/LessList.js
*    html/Lines.js
*    html/MasterPage.js
*    html/MasterPage/CssList.js
*    html/MasterPage/HtmlList.js
*    html/MasterPage/JsList.js
*    html/MasterPage/Less.js
*    html/MasterPage/Pages.js
*    html/MasterPage/Patterns.js
*    html/Tag.js
*    html/Verifier.js
*    html/WebSite.js
*    html/WebSite/Masters.js
*    html/WebSite/Packages.js
*    html/WebSite/Url.js
*    pack/HtmlPackage.js
*    pack/JsPackage.js
*    pack/LessPackage.js
*    pack/Package.js
*    third/Html.js
*    third/JS.js
*    third/Less.js
*    third/Watcher.js
*    partial/default/defaults/excore/Module.js
*    partial/default/defaults/excore/Url.js
*    partial/default/defaults/html/CssLinks.js
*    partial/default/defaults/html/HtmlLinks.js
*    partial/default/defaults/html/HtmlList.js
*    partial/default/defaults/html/JsList.js
*    partial/default/defaults/html/JsScripts.js
*    partial/default/defaults/html/LessLinks.js
*    partial/default/defaults/html/LessList.js
*    partial/default/defaults/html/MasterPage.js
*    partial/default/defaults/html/WebSite.js
*    partial/default/defaults/pack/Package.js
*    partial/default/defaults/third/Html.js
*    partial/default/defaults/third/Watcher.js
*    partial/default/expose.js
*    partial/default/end.js
*/
;( function (
    global, 
    module,
    $require, // node 的原生 require

    console,
    setTimeout,
    setInterval,

    Array, 
    Boolean,
    Date,
    Error,
    Function,
    Math,
    Number,
    Object,
    RegExp,
    String,

    JSON,

    MiniQuery,


    undefined
) {




/**
* KISP 内部模块管理器
* @ignore
*/
var Module = (function ($require) {

    var Module = MiniQuery.require('Module');

    var mod = new Module({
        seperator: '/',
        crossover: true,
        repeated: false, //不允许重复定义 
    });

    return {
        define: mod.define.bind(mod),
        require: mod.require.bind(mod), //该方法仅用于 end.js 中

        expose: mod.expose.bind(mod),
        modules: mod.modules.bind(mod),
        //tree: mod.tree.bind(mod),

        /**
        * 绑定到指定模块的指定方法。
        * @param {string} id 模块的名称(id)。
        * @param {string} name 模块的方法名称。
        * @param {Object|boolean} context 绑定的方法执行时的上下文，即 this 变量的指向。
            如果传入 true，则表示当前要绑定的模块本身。
        * @return {function} 返回绑定后的方法。
        */
        bind: function (id, name, context) {
            return function () {
                var M = mod.require(id);
                var args = [].slice.call(arguments, 0);
                context = context === true ? M : context;
                M[name].apply(context || null, args);
            };
        },
    };

})($require);



//提供快捷方式
var define = Module.define;
//var require = Module.require;








//NodeJs 的原生模块
(function ($require) {

    [
        'crypto',
        'fs',
        'path',
        'os',
        'child_process',

        'colors',           //https://github.com/Marak/colors.js
        'gaze',             //文件监控器，https://github.com/shama/gaze
        'html-minifier',
        'iconv-lite',       //https://www.npmjs.com/package/iconv-lite
        'less',
        'minimatch',
        'uglify-js',

    ].forEach(function (name) {

        define(name, function (require, module, exports) {
            return $require(name);
        });
    });

    //这个要先加载，因为其它模块用的是 string 的原型上的颜色值。
    $require('colors');

})($require);

define('$', function (require, module, exports) {
    return MiniQuery;
});


/**
* Weber 框架命名空间
* @namespace
* @name Weber
*/
define('Weber', function (require, module, exports) {

    var cfg = null; //for data

    module.exports = exports = /**@lends Weber*/ {

        /**
        * 名称。 
        */
        name: 'default',

        /**
        * 版本号。 (由 grunt 自动插入)
        */
        version: '1.3.0',


        /**
        * 获取已经定义的所有模块的描述信息。
        * @function
        */
        modules: Module.modules,

        /**
        * 加载 Weber 框架内公开的模块。
        * @param {string} id 模块的名称(id)。
        * @return {Object} 返回模块的导出对象。
        * @example
        *   var API = Weber.require('API');    
        */
        require: function (id) {
            return Module.expose(id) ? require(id) : null;
        },

       
        /**
        * 获取或 设置 Weber 内部模块的默认配置。
        * @function
        * @example
        *   Weber.config({});    
        */
        config: function (name, value) {

            var Defaults = require('Defaults');

            //get(name)
            if (typeof name == 'string' && arguments.length == 1) { 
                return Defaults.get(name);
            }

            //set
            Defaults.set(name, value);

        },

        /**
        * 提供 website.buid 的快捷方式，用于构建整个站点。
        */
        build: function (options) {
            var WebSite = require('WebSite');
            var website = new WebSite();
            website.build(options);
        },

        /**
        * 提供 website.watch 的快捷方式，用于编译并监控整个站点。
        */
        watch: function (fn) {
            var WebSite = require('WebSite');
            var website = new WebSite();
            website.watch(fn);
        },
        

    };
});


define('console', function (require, module) {

    var console = global.console;

  


});


//var log = console.log.bind(console);


//console.log = function () {
//    //var now = $.Date.format(new Date(), 'yyyyMMddhhmmss');
//    var args = [].slice.call(arguments, 0);
//    //args = [now].concat(args);

//    var $ = Module.require('$');
//    var File = Module.require('File');
//    var file = 'log.txt';


//    var content = File.exists(file) ? File.read(file) : '';
//    content += args.join(' ') + '\r\n';

//    File.write(file, content, null); //本身不能输出 log


//    log.apply(null, args);

//};
/**
* 配置工具类。
* @class
* @name Config
*/
define('Config', function (require, module,  exports) {

    var $ = require('$');
    var Mapper = $.require('Mapper');
    var mapper = new Mapper();


    /**
    * 构造器。
    */
    function Config() {

        Mapper.setGuid(this);

        var meta = {
            'name$config': {},
            'name$formatted': {},
        };

        mapper.set(this, meta);
    }

    //实例方法
    Config.prototype = /**@lends Config#*/ {
        constructor: Config,

        /**
        * 设置指定模块的默认配置。
        * 已重载 set({...})，因此可以批量设置。
        * @param {string} name 要设置的模块的名称。
        * @param {Object} config 要设置的默认配置对象。
        */
        set: function (name, config) {

            var meta = mapper.get(this);
            var name$config = meta.name$config;
            var name$formatted = meta.name$formatted;

            if (typeof name == 'object') { //批量设置: set({...})
                $.Object.each(name, function (name, config) {
                    setItem(name, config);
                });
            }
            else { //单个设置 set(name, config)
                setItem(name, config);
            }
            

            //内部共用方法，设置单个模块的默认配置对象。
            function setItem(name, config) {

                var obj;

                if (name in name$config) {
                    obj = name$config[name];
                    if ($.Object.isPlain(obj)) { //纯对象
                        obj = $.Object.extend(obj, config); //则合并
                    }
                    else { //其他的，则重设
                        obj = name$config[name] = config;
                    }
                }
                else { //首次设置
                    obj = name$config[name] = config;
                }


                //第一次或重新设置了 config，让其 formatted 指示已失效
                name$formatted[name] = false;

                return obj;
            }

        },



        /**
        * 获取指定模块名称的默认配置。
        * @param {string|object} name 要获取的模块的名称。
        *   或者传入 module 对象，会读取其 id。
        * @return {Object} 返回该模块的默认配置对象。
        */
        get: function (name) {

            var meta = mapper.get(this);
            var name$config = meta.name$config;
            var name$formatted = meta.name$formatted;

            if (typeof name == 'object') { // 重载 get(module)
                name = name.id;
            }

            var config = name$config[name];

            if (!$.Object.isPlain(config)) { //非纯对象，直接返回即可
                return config;
            }

            //这个模块特殊，不用也不能转换，否则会构成 require 死循环。
            if (name == 'Url') { 
                return config;
            }

            var formatted = name$formatted[name];

            if (!formatted) { //该模块的配置对象里尚未格式化 url，

                var Data = module.require('Data');
                config = Data.format(config);

                name$config[name] = config; //回写
                name$formatted[name] = true;
            }

            return config;
        },

        /**
        * 获取并克隆指定模块名称的默认配置。
        * @param {string} name 要获取的模块的名称。
        * @param {Object} [target] 需要合并的对象。
        *   如果需要提供额外的合并成员，可指定此参数。
        * @return {Object} 返回该模块的默认配置对象的克隆版本。
        */
        clone: function (name, target, target1, targetN) {
            var config = this.get(name);

            var args = [].slice.call(arguments, 1);
            args = [{}, config].concat(args);

            return $.Object.extendDeeply.apply(null, args);

        },

    };


    return Config;

   
});


/**
* KISP 内部模块使用的默认配置管理器。
* @namespace
* @name Defaults
*/
define('Defaults', function (require, module, exports) {

    var $ = require('$');

    var cfg = null;
    var name$used = {}; // { 模块名: 已经使用了默认配置 }



    //使用默认配置
    function use(name) {
        if (name$used[name]) {
            return;
        }

        if (!cfg) {
            var Config = require('Config');
            cfg = new Config();
        }

        var obj = require(name + '.defaults');
        cfg.set(name, obj);

        name$used[name] = true;
    }




    module.exports = exports = /**@lends Defaults*/ {

        set: function (name, config) {
            if (typeof name == 'object') { //批量设置: set({...})
                $.Object.each(name, function (name, config) {
                    use(name);
                    cfg.set(name, config);
                });
            }
            else { //单个设置 set(name, config)
                use(name);
                cfg.set(name, config);
            }
        },

        get: function (name) {
            if (typeof name == 'object') { // 重载 get(module)
                name = name.id;
            }

            use(name);
            return cfg.get(name);
        },


        clone: function (name, target, target1, targetN) {

            var config = exports.get(name);

            var args = [].slice.call(arguments, 1);
            args = [{}, config].concat(args);

            return $.Object.extendDeeply.apply(null, args);
        },

    };

});



define('Log', function (require, module, exports) {


    function seperate() {
        console.log('------------------------------------------------------------------------------'.magenta);
    }

    function allDone(s) {
        console.log(('=================================' + s + '=================================').green);
    }

    function logArray(list, color) {
        color = color || 'green';
        console.log('    ' + list.join('\r\n    ')[color]);
    }



    return {
        'seperate': seperate,
        'allDone': allDone,
        'logArray': logArray,
    };

});






/**
* 配置工具的预留数据填充格式化工具。
* @namespace
*/
define('Config/Data', function (require, module, exports) {

    var $ = require('$');


    function fill(sample) {

        return $.String.format(sample, {

            'now': new Date().getTime(),

        });

    }


    /**
    * 递归扫描并填充预留的数据。
    */
    function format(config) {

        return $.Object.map(config, function (key, value) {

            if (typeof value == 'string') {
                return fill(value);
            }

            if (value instanceof Array) {

                return $.Array.keep(value, function (item, index) {

                    if (typeof item == 'string') {
                        return fill(item);
                    }

                    if (typeof item == 'object') {
                        return format(item); //递归
                    }

                    return item;

                }, true);
            }

            return value;

        }, true); //深层次来扫描

    }


    return {
        format: format,
    };


});




/**
* 字符串工具类
* @namesapce
* @name String
*/
define('String', function (require, module,  exports) {



    function replaceBetween(s, beginTag, endTag, value) {

        //重载 replaceBetween(s, opt);
        if (typeof beginTag == 'object') {
            var opt = beginTag;
            beginTag = opt.begin;
            endTag = opt.end;
            value = opt.value;
        }


        if (s.indexOf(beginTag) < 0 || s.indexOf(endTag) < 0) {
            return s;
        }

        var list = s.split(beginTag).map(function (item) {

            var a = item.split(endTag);

            if (a.length == 1) {
                return a[0];
            }

            return value + a.slice(1).join(endTag);

        });


        s = list.join('');
        return s;

    }


    return /**@lends String*/ {
        'replaceBetween': replaceBetween,

    };


});



/**
* 任务处理工具类
* @namesapce
* @name Tasks
*/
define('Tasks', function (require, module,  exports) {

    //并行发起异步操作
    function parallel(list, each, allDone) {

        //重载 parallel(options)
        if (!(list instanceof Array)) {
            var options = list;
            list = options.data;
            each = options.each;
            allDone = options.all;
        }

        var count = list.length;
        if (count == 0) {
            allDone && allDone([]);
            return;
        }

        var values = [];
        var dones = new Array(count);

        function done(index) {
            dones[index] = true;
            count--;    

            //单纯记录计数不够安全，因为调用者可能会恶意多次调用 done()。
            if (count > 0) { //性能优化
                return;
            }

            //安全起见，检查每项的完成状态
            for (var i = 0, len = dones.length; i < len; i++) {

                if (!dones[i]) {
                    return;
                }

            }

            allDone && allDone(values);
        }

        list.forEach(function (item, index) {
            (function (index) { //done(index) 是异步调用，要多一层闭包。
                each(item, index, function (value) {
                    
                    values.push(value); //需要收集的值，由调用者传入。
                    done(index);
                });
            })(index);
        });
    }

    //串行发起异步操作
    function serial(list, each, allDone) {
        //重载 serial(options)
        if (!(list instanceof Array)) {
            var options = list;
            list = options.data;
            each = options.each;
            allDone = options.all;
        }


        var index = 0;
        var len = list.length;
        var values = [];

        function process() {
            var item = list[index];

            each(item, index, function (value) {
                index++;
                values.push(value); //需要收集的值，由调用者传入。

                if (index < len) {
                    process();
                }
                else {
                    allDone && allDone(values);
                }
            });
        }

        process();

    }



    return /**@lends Tasks*/ {

        'parallel': parallel,
        'serial': serial,
    };


});



/**
* 当前页面的 Url 工具类
* @namespace
* @name Url
*/
define('Url', function (require, module, exports) {

    var $ = require('$');
    
    module.exports = exports = /**@lends Url*/ {

        /**
        * 检查给定的 url 是否为完整的 url。
        * 即是否以 'http://' 或 'https://' 开头。
        * @param {string} url 要检查的 url。
        */
        checkFull: function (url) {
            if (typeof url != 'string') {
                return false;
            }


            return url.startsWith('http://')||
                url.startsWith('https://')||
                url.startsWith('//');             //这个也是绝对地址
        },

        /**
        * 获取 url 中的 query 和 hash 部分。
        * @param {string} 要获取的 url 地址。
        * @return {string} 返回 url 中的 query 和 hash 部分。
        * @example
            suffix('test.js?a=1&b=2#hash') => '?a=1&b=2#hash'
            suffix('test.js?a=1&b=2') => '?a=1&b=2'
            suffix('test.js#hash') => '#hash'
            suffix('test.js') => ''
        */
        suffix: function (url) {
            var index = url.indexOf('?');
            if (index < 0) {
                index = url.indexOf('#');
            }

            return index >= 0 ? url.slice(index) : '';
        },
        
    };

});



/**
* MD5工具类
* @namespace
* @name MD5
*/
define('MD5', function (require, module, exports) {


    var crypto = require('crypto');


    /**
    * 读取指定文件的内容并计算 MD5 值。
    */
    function read(file, len) {

        var File = require('File');
        var content = File.read(file);
        var md5 = get(content, len);

        return md5;
    }

    /**
    * 计算指定内容的 MD5 值。
    * @param {string} content 要计算的字符串内容。 
        如果传入的不是字符串，则会转成 JSON 字符串再进行计算。
    * @param {number} len 要对计算结果即 MD5 值进行截取的长度。
        当不指定时，则全部返回(32 位)。
    * @return {string} 返回一个 32 位(或指定长度)的 MD5 字符串。
    */
    function get(content, len) {

        if (typeof content != 'string') {
            content = JSON.stringify(content) || '';
        }

        var md5 = crypto.createHash('md5');
        md5 = md5.update(content).digest('hex');

        if (typeof len == 'number') {
            md5 = md5.slice(0, len);
        }

        md5 = md5.toUpperCase();

        return md5;
    }







   

    module.exports = exports = /**@lends MD5*/ {
        'get': get,
        'read': read,
        
    };

});



/**
* 目录工具
*/
define('Directory', function (require, module, exports) {


    var fs = require('fs');
    var path = require('path');

    /**
    * 格式化指定的路径为一个目录。
    */
    function format(dir) {

        var Path = require('Path');

        dir = Path.format(dir); 

        if (dir.slice(-1) != '/') { //确保以 '/' 结束，统一约定，不易出错
            dir += '/';
        }

        return dir;

    }


    /**
    * 检测指定的路径是否为目录。
    */
    function check(path) {
        var stat = fs.statSync(path);
        return stat.isDirectory();
    }



    /**
    * 递归的获取指定目录下及子目录下的所有文件列表。
    */
    function getFiles(dir, filter) {

        dir = format(dir);


        var isFn = typeof filter == 'function';
        var list = fs.readdirSync(dir);
        var files = [];


        list.forEach(function (item, index) {

            item = dir + item;

            if (check(item)) { // item 还是个目录， 递归
                var fn = isFn ? filter : null; //为回调函数时才需要进一步传到递归函数
                var list = getFiles(item, fn);
                files = files.concat(list);
                return;
            }

            //让回调函数去处理
            if (isFn) {
                item = filter(item); 

                if (item === null) {
                    return;
                }
            }

            files.push(item);
        });


        //最外层的才需要匹配指定模式的文件，递归的不需要。
        if (filter instanceof Array) {

            var Patterns = require('Patterns');

            var patterns = Patterns.combine(dir, filter);

            files = Patterns.match(patterns, files);
        }


        return files;
    }




    /**
    * 递归地删除指定目录及子目录的所有文件。
    */
    function deletes(dir) {

        dir = format(dir);


        var existed = fs.existsSync(dir);
        if (!existed) {
            return;
        }

        var list = fs.readdirSync(dir);

        list.forEach(function (item, index) {

            item = dir + item;

            if (check(item)) {
                deletes(item); //递归
            }
            else {
                fs.unlinkSync(item); //删除文件
            }

        });

        fs.rmdirSync(dir);

    }

    /**
    * 递归地删除指定目录及子目录下的所有空目录。
    */
    function trim(dir) {

        dir = format(dir);

        var existed = fs.existsSync(dir);
        if (!existed) {
            return;
        }

        var list = fs.readdirSync(dir);

        if (list.length == 0) {//空目录
            fs.rmdirSync(dir);
            return;
        }

        list.forEach(function (item, index) {

            item = dir + item;

            if (!check(item)) { //不是目录
                return;
            }

            //是一个目录
            trim(item); //递归

            var list = fs.readdirSync(dir);
            if (list.length == 0) {//空目录
                fs.rmdirSync(dir);
                return;
            }
            
        });

    }



    /**
    * 递归地创建目录及子目录。
    */
    function create(dir) {

        dir = dir.slice(-1) == '/' ?
            dir.slice(0, -1) :
            path.dirname(dir);


        if (fs.existsSync(dir)) { //已经存在该目录
            return;
        }


        var parent = path.dirname(dir) + '/';

        if (!fs.existsSync(parent)) {
            create(parent);
        }

        fs.mkdirSync(dir);
    }


    /**
    * 递归地复制指定目录及子目录的所有文件。
    */
    function copy(srcDir, destDir) {


        create(destDir);

        var Path = require('Path');
        var File = require('File');
        var list = fs.readdirSync(srcDir);
        

        list.forEach(function (item, index) {

            var src = srcDir + '\\' + item;
            var dest = destDir + '\\' + item;

            src = Path.format(src);
            dest = Path.format(dest);

            //是一个目录，递归处理
            if (check(src)) {
                copy(src, dest);
                return;
            }

            File.copy(src, dest);
        });

    }

   
    



    return {
        'getFiles': getFiles,
        'check': check,
        'delete': deletes,
        'trim': trim,
        'format': format,
        'copy': copy,
        'create': create,

    };

});


/**
* 文件类。
*/
define('File', function (require, module, exports) {

    'use strict';

    var fs = require('fs');
    var iconv = require('iconv-lite');
    
    function exists(file) {
        return fs.existsSync(file);
    }


    function deletes(file) {

        //重载 deletes(list)
        if (file instanceof Array) {
            file.forEach(deletes);
            return;
        }


        if (!exists(file)) {
            return;
        }

        //console.log('删除'.bgMagenta, file.bgMagenta);
        fs.unlinkSync(file);
        
    }

    /**
    * 读取文件。
    */
    function read(file, encoding) {

        file = String(file);
        encoding = encoding === null ? null : encoding || 'utf8'; //有可能为 undefined

        var contents = fs.readFileSync(file); //读到的是 buffer。

       
        //如果指定了 encoding 则把内容从 buffer 形式转成 string 形式。
        if (encoding) { 
            contents = iconv.decode(contents, encoding); //解码成 string。

            // strip any BOM that might exist.
            if (contents.charCodeAt(0) === 0xFEFF) {
                contents = contents.substring(1);
            }
        }


        return contents;

    }



   

    function write(file, contents, encoding) {

        var Directory = require('Directory');
        Directory.create(file);

        // If contents is already a Buffer, don't try to encode it
        if (!Buffer.isBuffer(contents)) {
            contents = iconv.encode(contents, encoding || 'utf8'); //编码成 buffer。
        }

        fs.writeFileSync(file, contents);

        //当指定为 null 时，表示是复制而写入的，不输出 log。
        if (encoding !== null) {
            console.log('写入'.bgYellow, file.yellow);
        }
    }


    function copy(src, dest) {
        var contents = read(src, null); //读到的是 buffer
        write(dest, contents, null);
    }


    function writeJSON(file, json, minify) {
        json = minify ?
            JSON.stringify(json) :
            JSON.stringify(json, null, 4);

        write(file, json);
    }

    function readJSON(file) {
        if (!exists(file)) {
            return;
        }

        var json = read(file);
        if (!json) {
            return;
        }

        json = JSON.parse(json);
        return json;
       
    }

    return {
        'delete': deletes,
        'read': read,
        'write': write,
        'copy': copy,
        'exists': exists,
        'writeJSON': writeJSON,
        'readJSON': readJSON,

    };

});


/**
* 文件引用管理类。
*/
define('FileRefs', function (require, module, exports) {

    'use strict';

    var file$count = {}; //文件计数器。


    function add(file) {
        if (!file) {
            return;
        }

        var count = file$count[file] || 0;
        file$count[file] = count + 1;
    }


    function deletes(file, force) {

        if (!file) {
            return;
        }

        if (force) { //立即强制删除
            var File = require('File');

            file$count[file] = 0;
            File.delete(file);
            return;
        }

        var count = file$count[file] || 0;
        count = count - 1;
        if (count < 0) {
            count = 0;
        }

        file$count[file] = count;

    }


    /**
    * 删除引用计数为 0 的物理文件。
    */
    function clean() {
     
        var files = Object.keys(file$count).filter(function (file) {
            return file$count[file] == 0;
        });

        var File = require('File');
        File.delete(files);

    }
    
    



    return {
        'add': add,
        'delete': deletes,
        'clean': clean,
    };

});



/**
* 路径解析器。
*/
define('Path', function (require, module, exports) {

    'use strict';


    var path = require('path');
    var $ = require('$');



    /**
    * 进行标准化处理，以得到格式统一的路径。
    */
    function format(url) {
     
        var Url = require('Url');

        //以 http:// 等开头的，不要处理。
        if (!Url.checkFull(url)) {
            url = url.replace(/\\/g, '/');    //把 '\' 换成 '/'
            url = url.replace(/\/+/g, '/');   //把多个 '/' 合成一个
        }


        url = url.split('#')[0]; //去掉带 hash 部分的
        url = url.split('?')[0]; //去掉带 query 部分的

        return url;
    }

    function dirname(src) {
        var dir = path.dirname(src) + '/';
        return format(dir);
    }


    /**
    * 解析路径，获取基本信息。
    */
    function parse(src) {

        var dir = path.dirname(src) + '/';
        var ext = path.extname(src);
        var filename = path.basename(src);
        var basename = path.basename(src, ext);

        return {
            'dir': dir,
            'name': dir + basename,
            'fullname': src,
            'filename': filename,
            'basename': basename,
            'ext': ext,
        };

    }






    /**
    * 内部方法
    * @inner
    */
    function combine(dir, files, state) {

        if (dir && dir.slice(-1) != '/') { //确保以 '/' 结束，统一约定，不易出错
            dir += '/';
        }

        var depth = 1;

        return $.Array.keep(files, function (item, index) {

            if (typeof item == 'string') {
                return dir + item;
            }

            depth++;

            if (state) {
                state.depth = depth;
            }

            return combine(dir + item.dir, item.files, state); //递归
        });
    }

    /**
    * 把一个对象/数组表示的路径结构线性化成一个一维的数组。
    */
    function linearize(dir, files) {

        if (dir instanceof Array) { //重载 linearize([ ]);
            files = dir;
            dir = '';
        }
        else if (typeof dir == 'object') { //重载 linearize( { dir: '', files: [] } );
            files = dir.files;
            dir = dir.dir;
        }

        var state = { depth: 0 };

        var a = combine(dir, files, state);
        var b = $.Array.reduceDimension(a, state.depth); //降维

        return b;
    }



   

    function join(a, b) {

        var args = [].slice.call(arguments, 0);
        var all = path.join.apply(path, args);

        return format(all);
    }


    function relative(a, b) {
        return format(path.relative(a, b));
    }
 

    return {
        dirname: dirname,
        format: format,
        //parse: parse,
        linearize: linearize,
        join: join,
        relative: relative,
    };

});



/**
* 路径模式工具
*/
define('Patterns', function (require, module, exports) {

    var fs = require('fs');
    var minimatch = require('minimatch');
    var $ = require('$');
    var $String = require('String');

   
    /**
    * 把一个目录和模式列表组合成一个新的模式列表。
    */
    function combine(dir, list) {

        //重载 combine(list);
        if (dir instanceof Array) {
            return dir;
        }

        //重载 combine(item);
        if (!list) {
            return [dir];
        }

        if (!Array.isArray(list)) {
            list = [list];
        }


        var Path = require('Path');

        list = $.Array.map(list, function (item, index) {

            if (typeof item != 'string') {
                return null;
            }

            if (item.indexOf('!') == 0) { //如 '!foo/bar/index.js'
                item = '!' + Path.join(dir, item.slice(1));
            }
            else {
                item = Path.join(dir, item);
            }

            return item;

        });
      
        return list;

    }

    /**
    * 获取指定模式下的所有文件列表。
    */
    function getFiles(dir, patterns) {

        //重载 getFiles(patterns);
        if (Array.isArray(dir)) {
            patterns = dir;
            dir = '';
        }

        //指定了基目录，则组合起来。
        if (dir) {
            patterns = combine(dir, patterns);
        }


        var files = [];
        var Directory = require('Directory');

        patterns.forEach(function (item, index) {
            //"../htdocs/modules/**/*.less"
            //"../htdocs/modules/*.less"
            //"!../htdocs/test.js"
            //"../htdocs/api/"

            if (item.slice(-1) == '/') { //以 '/' 结束，是个目录
                item += '**/*';
                patterns[index] = item; //这里回写进原数组。
            }

            if (item.slice(0, 1) == '!') { // 以 '!' 开头的，如 '!../htdocs/test.js'
                return;
            }
            

            var index = item.indexOf('**/');
            if (index < 0) {
                index = item.indexOf('*');
            }

            if (index < 0) { //不存在 '**/' 或 '*'
                files.push(item);
                return;
            }


            //
            var dir = item.slice(0, index);
            if (!fs.existsSync(dir)) {
                return;
            }

            var list = Directory.getFiles(dir);
            files = files.concat(list);


        });


        files = match(patterns, files);
       

        return files;

    }

    /**
    * 获取指定模式下的所有文件列表所对应的目录。
    */
    function getDirs(dir, patterns) {
        var Path = require('Path');

        var list = getFiles(dir, patterns);

        list = list.map(function (item) {
            item = Path.relative(dir, item);
            item = Path.dirname(item);
            return item;
        });

        return list;
    }



    /**
    * 从指定的 html 中解析出引用的文件模式列表。
    */
    function parse(dir, html, tags) {

        html = $.String.between(html, tags.begin, tags.end);

        if (!html) {
            return null;
        }

        var list = $.String.between(html, '<script>', '</script>');
        if (!list) {
            return null;
        }

        list = new Function('return (' + list + ');')();

        if (!(list instanceof Array)) {
            throw new Error('引入文件的模式必须返回一个数组!');
        }

        list = combine(dir, list);

        return {
            'html': html,
            'outer': tags.begin + html + tags.end,
            'list': list,
        };
    }




    function match(patterns, files) {

        var includes = {};
        var excludes = {};

        patterns.forEach(function (pattern) {

            var excluded = pattern.slice(0, 1) == '!';
            var obj = excluded ? excludes : includes;

            if (excluded) {
                pattern = pattern.slice(1);
            }

            files.forEach(function (file) {
                var matched = minimatch(file, pattern);
                if (matched) {
                    obj[file] = true;
                }
            });
        });

        var matches = Object.keys(includes).filter(function (file) {
            return !(file in excludes);
        });

        return matches;

    }

    /**
    * 检查指定的文件是否被特定模式列表匹配中。
    */
    function matchedIn(patterns, file) {
        var list = match(patterns, [file]);
        return list.length > 0;
    }

    /**
    * 填充模式中的模板。
    */
    function fill(dir, patterns) {

        var Path = require('Path');

        var list = patterns.map(function (item) {

            if (item.indexOf('<%=') < 0 || item.indexOf('%>') < 0) {
                return item;
            }


            var s = $.String.between(item, '<%=', '%>');
            s = s.trim();

            if (!s) {
                console.log('模式路径非法:'.bgRed, item.yellow);
                console.log('<%= %> 中不能为空'.bgRed);
                throw new Error();
            }


            //提取 <%= 和 %> 之前和之后的两部分。
            var parts = $String.replaceBetween(item, '<%=', '%>', '<%=%>').split('<%=%>');


            if (s.startsWith('dir{') && s.endsWith('}')) {
                s = $.String.between(s, 'dir{', '}');
                s = s.trim();

                if (!s) {
                    console.log('模式路径非法:'.bgRed, item.yellow);
                    console.log('dir{ } 中不能为空'.bgRed);
                    throw new Error();
                }

                var dirs = getDirs(dir, s);

                //拼接前缀和后缀。
                return dirs.map(function (item) {
                    return parts[0] + item + parts[1];
                });
            }

            return item;
        });


        //降维
        list = [].concat.apply([], list);
        return list;

    }


    return {
        combine: combine,
        getFiles: getFiles,
        getDirs: getDirs,
        parse: parse,
        match: match,
        matchedIn: matchedIn,
        fill: fill,

    };

});


define('Attribute', function (require, module, exports) {

    /**
    * 从指定的标签中提取所有的属性。
    * @param {string} tag 要提取的标签 html。
    * @return {string} 返回指定由所有的属性名称和属性值组成的 Object。
    * @example 
        getAll('<link rel="stylesheet" data-tab="no" />'); 
        //得到 
        { 
            rel: 'stylesheet', 
            'data-tab': 'no', 
        }
    */
    function getAll(tag) {

        var reg = new RegExp('[\\w\\-\\_\\d]*?\\s*=\\s*["\'][\\s\\S]*?["\']', 'gi');
        var a = tag.match(reg);

        if (!a) {
            return {};
        }


        var name$value = {};

        a.forEach(function (item, i) {

            var index = item.indexOf('='); //第一个 '=' 的位置
            var name = item.slice(0, index);
            var value = item.slice(index + 1);

            var s = value[0];
            if (s == '"' || s == "'") { //以双引号或单引号开头的，要去掉
                value = value.slice(1, -1);
            }

            name$value[name] = value;

        });

        return name$value;

    }


    /**
    * 从指定的标签中提取指定的属性值。
    * @param {string} tag 要提取的标签 html。
    * @param {string} name 要提取的属性名称。
    * @return {string} 返回指定的属性值。
        当不存在该属性时，返回 undefined。
    * @example 
        getAttribute('<link rel="stylesheet" data-tab="no" />', 'data-tab'); //得到 'no'
    */
    function get(tag, name) {
        var obj = getAll(tag);
        return name ? obj[name] : obj;

        //var reg = new RegExp(name + '\\s*=\\s*["\'][\\s\\S]*?["\']', 'gi');
        //var a = tag.match(reg);

        //if (!a) {
        //    return;
        //}

        //var s = a[0];
        //reg = new RegExp('^' + name + '\\s*=\\s*["\']');
        //s = s.replace(reg, '')
        //s = s.replace(/["']$/gi, '');
        //return s;
    }






    return {
        get: get,
    };



});






/**
* 静态 CSS 资源文件列表。
*/
define('CssLinks', function (require, module, exports) {

    var $ = require('$');
    var path = require('path');

    var Watcher = require('Watcher');
    var Defaults = require('Defaults');
    var MD5 = require('MD5');
    var File = require('File');
    var FileRefs = require('FileRefs');
    var Lines = require('Lines');
    var Path = require('Path');
    var Url = require('Url');
    var Attribute = require('Attribute');

    var Mapper = $.require('Mapper');
    var Emitter = $.require('Emitter');
    var $Url = $.require('Url');

    var mapper = new Mapper();



    function CssLinks(dir, config) {

        Mapper.setGuid(this);

        config = Defaults.clone(module.id, config);

        var meta = {
            'dir': dir,
            'master': '',
            'list': [],
            'lines': [],    //html 换行拆分的列表
            'file$md5': {},

            'emitter': new Emitter(this),
            'watcher': null,    //监控器，首次用到时再创建。

            'regexp': config.regexp,
            'md5': config.md5,
            'exts': config.exts,
            'minify': config.minify,
        };

        mapper.set(this, meta);

    }



    CssLinks.prototype = {
        constructor: CssLinks,

        /**
        * 重置为初始状态，即创建时的状态。
        */
        reset: function () {

            var meta = mapper.get(this);


            meta.list.forEach(function (item) {
                FileRefs.delete(item.file); //删除之前的文件引用计数
                FileRefs.delete(item.build.file); //删除之前的文件引用计数
            });


            $.Object.extend(meta, {
                'master': '',
                'list': [],
                'lines': [],
                'file$md5': {},
            });

        },

        /**
        * 从当前或指定的母版页 html 内容中提出 css 文件列表信息。
        * @param {string} master 要提取的母版页 html 内容字符串。
        */
        parse: function (master) {

            var meta = mapper.get(this);
            master = meta.master = master || meta.master;

            //这里必须要有，不管下面的 list 是否有数据。
            var lines = Lines.get(master);
            meta.lines = lines;


            //提取出 link 标签
            var list = master.match(meta.regexp);

            if (!list) {
                return;
            }

            var debug = meta.exts.debug;
            var min = meta.exts.min;
            var startIndex = 0;         //搜索的起始行号

            list = $.Array.map(list, function (item, index) {

                var src = Attribute.get(item, 'href');
                if (!src) {
                    return null;
                }

                var index = Lines.getIndex(lines, item, startIndex);
                startIndex = index + 1;     //下次搜索的起始行号。 这里要先加

                var line = lines[index];    //整一行的 html。
                lines[index] = null;        //先清空，后续会在 mix() 中重新计算而填进去。

                //所在的行给注释掉了，忽略
                if (Lines.commented(line, item)) {
                    return null;
                }

                var href = Path.format(src);

                var ext = $.String.endsWith(href, debug) ? debug :
                    $.String.endsWith(href, min) ? min :
                    path.extname(href);

                var name = href.slice(0, -ext.length);

                var file = '';
                if (!Url.checkFull(src)) { //不是绝对(外部)地址
                    file = Path.join(meta.dir, href);
                   
                }

                var suffix = Url.suffix(src);

                return {
                    'file': file,       //完整的物理路径。 如果是外部地址，则为空字符串。
                    'src': src,         //原始地址，带 query 和 hash 部分。
                    'suffix': suffix,   //扩展名之后的部分，包括 '?' 在内的 query 和 hash 一整体。
                    'name': name,       //扩展名之前的部分。
                    'ext': ext,         //路径中的后缀名，如 '.debug.css' 或 '.min.css' 或 '.css'。
                    'index': index,     //行号，从 0 开始。
                    'html': item,       //标签的 html 内容。
                    'line': line,       //整一行的 html 内容。
                    'build': {},
                };

            });

            meta.list = list;
        

        },


        /**
        * 获取 css 文件列表所对应的 md5 值和引用计数信息。
        */
        md5: function () {
            var meta = mapper.get(this);
            var file$md5 = meta.file$md5;
            var list = meta.list;

            var file$stat = {};

            list.forEach(function (item) {

                var file = item.file;
                if (!file) {
                    return;
                }

                var stat = file$stat[file];
                if (stat) {
                    stat['count']++;
                    return;
                }


                var md5 = file$md5[file];
                if (!md5) {
                    md5 = file$md5[file] = MD5.read(file);
                }

                file$stat[file] = {
                    'count': 1,
                    'md5': md5,
                };

            });

            return file$stat;
        },

        /**
        * 监控 css 文件的变化。
        */
        watch: function () {
            var meta = mapper.get(this);

            //这里不要缓存起来，因为可能在 parse() 中给重设为新的对象。
            //var list = meta.list; 
            //var file$md5 = meta.file$md5; 

            var watcher = meta.watcher;

            if (!watcher) { //首次创建。

                watcher = meta.watcher = new Watcher();

                var self = this;
                var emitter = meta.emitter;

                watcher.on({

                    'added': function (files) {

                    },

                    'deleted': function (files) {

                        console.log('文件已给删除'.yellow, files);
                    },

                    //重命名的，会先后触发：deleted 和 renamed
                    'renamed': function (files) {

                        //emitter.fire('change');
                    },


                    'changed': function (files) {

                        files.forEach(function (file) {

                            //让对应的 md5 记录作废。
                            meta.file$md5[file] = '';

                            //根据当前文件名，找到具有相同文件名的节点集合。
                            var items = $.Array.grep(meta.list, function (item, index) {
                                return item.file == file;
                            });

                            //对应的 html 作废。
                            items.forEach(function (item) {
                                meta.lines[item.index] = null;
                            });

                        });

                        emitter.fire('change');
                    },

                });
            }


            var files = $.Array.map(meta.list, function (item) {
                return item.file || null;
            });

            watcher.set(files);


        },

        /**
        * 
        */
        mix: function () {
            var meta = mapper.get(this);
            var list = meta.list;
            var lines = meta.lines;
            var file$md5 = meta.file$md5;
            var replace = $.String.replaceAll;

            var len = meta.md5;
            var rid = $.String.random(32);

            list.forEach(function (item) {

                var index = item.index;
                if (lines[index]) { //之前已经生成过了
                    return;
                }

                var build = item.build;
                var ext = build.ext || item.ext;
                var dest = item.name + ext + item.suffix;
                var file = build.file || item.file;

                if (file) {

                    FileRefs.add(file);

                    var md5 = file$md5[file];

                    if (!md5) { //动态去获取 md5 值。
                        md5 = file$md5[file] = MD5.read(file);
                    }

                    md5 = md5.slice(0, len);
                    dest = $Url.addQueryString(dest, md5, rid);
                    dest = replace(dest, md5 + '=' + rid, md5); //为了把类似 'MD5=XXX' 换成 'MD5'。
                }


                var html = replace(item.html, item.src, dest);
                var line = replace(item.line, item.html, html);

                lines[index] = line;

            });

 
            return Lines.join(lines);

        },

        /**
        * 压缩对应的 css 文件。
        */
        minify: function (options, done) {

            if (!options) {
                done && done();
                return;
            }

            var meta = mapper.get(this);
            if (options === true) { //直接指定了为 true，则使用默认配置。
                options = meta.minify;
            }

            var Less = require('Less');

            var meta = mapper.get(this);
            var list = meta.list;

            //并行地发起异步编译。
            var Tasks = require('Tasks');
            Tasks.parallel({
                data: list,
                all: done,
                each: function (item, index, done) {

                    var file = item.file;
                    var opts = options[item.ext];

                    if (!opts) {
                        return done();
                    }

                    if (!file) { //外部地址
                        if (opts.outer) { //指定了替换外部地址为压缩版
                            item.build.ext = opts.ext;
                        }

                        return done();
                    }


                    var dest = item.name + opts.ext;
                    dest = Path.join(meta.dir, dest);

                    Less.compile({
                        'src': file,
                        'compress': true,
                        'delete': opts.delete,
                        'overwrite': opts.overwrite,
                        'dest': opts.write ? dest : '',

                        'done': function (content) {

                            $.Object.extend(item.build, {
                                'file': dest,
                                'ext': opts.ext,
                                'content': content,
                            });

                            done();
                        },
                    });


                },
            });

        },

        /**
        * 删除列表中所对应的 css 物理文件。
        */
        'delete': function () {
            var meta = mapper.get(this);
            var list = meta.list;

            list.forEach(function (item) {
                FileRefs.delete(item.file);
            });

        },

        /**
        * 绑定事件。
        */
        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);

            return this;
        },



    };



    return CssLinks;



});






/**
* 静态引用 HTML 资源文件列表。
*/
define('HtmlLinks', function (require, module, exports) {

    var $ = require('$');
    var path = require('path');

    var File = require('File');
    var FileRefs = require('FileRefs');
    var Path = require('Path');
    var Watcher = require('Watcher');
    var Defaults = require('Defaults');
    var Lines = require('Lines');
    var Attribute = require('Attribute');

    var Mapper = $.require('Mapper');
    var Emitter = $.require('Emitter');
    var Url = $.require('Url');

    var mapper = new Mapper();




    function HtmlLinks(dir, config) {


        Mapper.setGuid(this);
        config = Defaults.clone(module.id, config);


        //base 为下级页面的基目录。
        //假如 base='Detail'，而引入下级页面的 href='/panel.html'，
        //则 href='Detai/panel.html'，即提供了一种短名称引入下级页面的方式。

        var meta = {
            'dir': dir,     //当前分母版页所在的目录。
            'master': '',   //当前分母版页的内容。
            'lines': [],    //html 换行拆分的列表
            'list': [],     //html 片段文件列表及其它信息。
            'emitter': new Emitter(this),
            'watcher': null,            //监控器，首次用到时再创建
            'regexp': config.regexp,    //
            'base': config.base,        //下级页面的基目录。
        };

        mapper.set(this, meta);


    }



    HtmlLinks.prototype = {
        constructor: HtmlLinks,

        /**
        * 重置为初始状态，即创建时的状态。
        */
        reset: function () {
            var meta = mapper.get(this);


            meta.list.forEach(function (item) {
                item.links.destroy();               //移除之前的子节点实例
                FileRefs.delete(item.file);         //删除之前的文件引用计数
            });


            $.Object.extend(meta, {
                'master': '',   //当前分母版页的内容。
                'lines': [],    //html 换行拆分的列表
                'list': [],     //html 片段文件列表及其它信息。
            });

        },

        /**
        * 从当前或指定的母版页 html 内容中提出 html 标签列表信息
        * @param {string} master 要提取的母版页 html 内容字符串。
        */
        parse: function (master) {
            var meta = mapper.get(this);
            master = meta.master = master || meta.master;

            //提取出如引用了 html 分文件的 link 标签
            var list = master.match(meta.regexp);
            if (!list) {
                return;
            }


            var lines = Lines.get(master);
            meta.lines = lines;

            var startIndex = 0;

            list = $.Array.map(list, function (item, index) {


                var index = Lines.getIndex(lines, item, startIndex);
                var line = lines[index]; //整一行的 html
                startIndex = index + 1; //下次搜索的起始行号

                //所在的行给注释掉了，忽略
                if (Lines.commented(line, item)) {
                    return null;
                }

                var href = Attribute.get(item, 'href');
                if (!href) {
                    return null;
                }


                //以 '/' 开头，如 '/panel.html'，则补充完名称。
                if (href.slice(0, 1) == '/') {
                    href = meta.base + href;
                }

                var file = path.join(meta.dir, href);

                href = Path.format(href);
                file = Path.format(file);

                FileRefs.add(file); //添加文件引用计数。
               

                var pad = line.indexOf(item);       //前导空格数
                pad = new Array(pad + 1).join(' '); //产生指定数目的空格

                var dir = Path.dirname(file);


                //递归下级页面

                //下级节点的基目录，根据当前页面的文件名得到
                var ext = path.extname(file);
                var base = path.basename(file, ext);


                var master = File.read(file);
                var links = new HtmlLinks(dir, { 'base': base });
                var list = links.parse(master);

                if (list && list.length > 0) {
                    console.log('复合片段'.bgMagenta, file.bgMagenta);
                }
            
                return {
                    'href': href,   //原始地址
                    'file': file,   //完整的物理路径。 
                    'index': index, //行号，从 0 开始
                    'html': item,   //标签的 html 内容
                    'line': line,   //整一行的 html 内容
                    'pad': pad,     //前导空格
                    'dir': dir,     //所在的目录
                    'name': base,   //基本名称，如 'CardList'
                    'links': links,  //下级页面
                };

            });

            meta.list = list;

            return list;
           

        },

        /**
        * 混入(递归)。
        * 即把对 html 分文件的引用用所对应的内容替换掉。
        */
        mix: function (options) {

            options = options || {
                'delete': false,    //是否删除源 master 文件，仅提供给上层业务 build 时使用。
            };

            var meta = mapper.get(this);
            var list = meta.list;

            if (list.length == 0) { //没有下级页面
                return meta.master;   //原样返回
            }

            var lines = meta.lines;


            list.forEach(function (item, index) {
              
                var html = item.links.mix(options); //递归
                console.log('混入'.yellow, item.file.green);


                //在所有行的前面加上空格串，以保持原有的缩进
                var pad = item.pad;
                html = pad + Lines.get(html).join(Lines.seperator + pad);

                lines[item.index] = html;

                if (options.delete) {
                    FileRefs.delete(item.file);
                }

            });

            var html = Lines.join(lines);

            return html;
        },

        /**
        * 监控当前 html 文件列表的变化。
        */
        watch: function () {
            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var watcher = meta.watcher;

            if (!watcher) { //首次创建
                
                watcher = meta.watcher = new Watcher();

                //因为是静态文件列表，所以只监控文件内容是否发生变化即可。
                watcher.on('changed', function (files) {

                    //{ 文件名: [节点, 节点, ..., 节点] }，一对多的关系。
                    files.forEach(function (file) {

                        //根据当前文件名，找到具有相同文件名的节点集合。
                        //闭包的关系，这里必须用 meta.list，且不能缓存起来。
                        var items = $.Array.grep(meta.list, function (item, index) {
                            return item.file == file;
                        });

                        items.forEach(function (item) {

                            var file = item.file;
                            var html = File.read(file);
                            var links = item.links;

                            links.reset();      //
                            links.parse(html);  //可能添加或移除了下级子节点
                            links.watch();      //更新监控列表

                        });
                    });

                    emitter.fire('change');

                });
            }


            //监控下级节点所对应的文件列表。

            var files = [];

            meta.list.forEach(function (item) {

                files.push(item.file);


                var links = item.links;

                links.on('change', function () {
                    emitter.fire('change');
                });

                links.watch();

            });

            watcher.set(files);

        },


        /**
        * 删除引用列表中所对应的 html 物理文件。
        */
        delete: function () {
            var meta = mapper.get(this);
            var list = meta.list;

            list.forEach(function (item) {

                FileRefs.delete(item.file);

                item.links.delete(); //递归删除下级的
            });

        },



        /**
        * 绑定事件。
        */
        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);

            return this;
        },

        /**
        * 销毁当前对象。
        */
        destroy: function () {

            var meta = mapper.get(this);

            meta.emitter.destroy();

            var watcher = meta.watcher;
            watcher && watcher.destroy();

            meta.list.forEach(function (item) {
                item.links.destroy();
            });

            mapper.remove(this);



        },

    };



    return HtmlLinks;



});






/**
* 动态引用 HTML 资源文件列表。
*/
define('HtmlList', function (require, module, exports) {

    var $ = require('$');
    var path = require('path');

    var Watcher = require('Watcher');
    var Patterns = require('Patterns');
    var Path = require('Path');
    var Defaults = require('Defaults');
    var Log = require('Log');
    var Mapper = $.require('Mapper');
    var Emitter = $.require('Emitter');
    var Url = $.require('Url');
   

    var mapper = new Mapper();


    //该模块不需要进行资源文件引用计数，交给 HtmlLinks 计数即可。

    function HtmlList(dir, config) {

 
        Mapper.setGuid(this);
        config = Defaults.clone(module.id, config);

        var rid = $.String.random(4); //随机 id

        var meta = {
            
            'dir': dir,         //母版页所在的目录。
            'master': '',       //母版页的内容，在 parse() 中用到。
            'html': '',         //模式所生成的 html 块，即缓存 toHtml() 方法中的返回结果。
            'outer': '',        //包括开始标记和结束标记在内的原始的整一块的 html。
            'patterns': [],     //模式列表。
            'list': [],         //真实 html 文件列表及其它信息。

            'emitter': new Emitter(this),
            'watcher': null,    //监控器，首次用到时再创建

            'extraPatterns': config.extraPatterns,  //额外附加的模式。
            'sample': config.sample, //使用的模板
            'tags': config.tags,

        };

        mapper.set(this, meta);

    }



    HtmlList.prototype = {
        constructor: HtmlList,

        /**
        * 重置为初始状态，即创建时的状态。
        */
        reset: function () {

            var meta = mapper.get(this);

            $.Object.extend(meta, {
                'master': '',       //母版页的内容，在 parse() 中用到。
                'html': '',         //模式所生成的 html 块，即缓存 toHtml() 方法中的返回结果。
                'outer': '',        //包括开始标记和结束标记在内的原始的整一块的 html。
                'patterns': [],     //模式列表。
                'list': [],         //真实 html 文件列表及其它信息。
            });

        },


        /**
        * 从当前或指定的母版页 html 内容中提出 html 文件列表信息。
        * @param {string} master 要提取的母版页 html 内容字符串。
        * @return {Array} 返回一个模式数组。
        */
        parse: function (master) {
            var meta = mapper.get(this);
            master = meta.master = master || meta.master;

            var tags = meta.tags;
            var dir = meta.dir;

            var html = $.String.between(master, tags.begin, tags.end);
            if (!html) {
                return;
            }

            var patterns = $.String.between(html, '<script>', '</script>');
            if (!patterns) {
                return;
            }

            //母版页中可能会用到的上下文。
            var context = {
                'dir': dir,
                'master': master,
                'tags': tags,
            };

            var fn = new Function('require', 'context',
                //包装多一层匿名立即执行函数
                'return (function () { ' +
                    'var a = ' + patterns + '; \r\n' +
                    'return a;' +
                '})();'
            );

            //执行母版页的 js 代码，并注入变量。
            patterns = fn(require, context);

            if (!Array.isArray(patterns)) {
                throw new Error('引入文件的模式必须返回一个数组!');
            }

            patterns = patterns.concat(meta.extraPatterns); //跟配置中的模式合并
            patterns = Patterns.fill(dir, patterns);
            patterns = Patterns.combine(dir, patterns);

            console.log('匹配到'.bgGreen, patterns.length.toString().cyan, '个 html 模式:');
            Log.logArray(patterns);

            meta.patterns = patterns;
            meta.outer = tags.begin + html + tags.end;

        },

        /**
        * 根据当前模式获取对应真实的 html 文件列表和其它信息。
        */
        get: function () {

            var meta = mapper.get(this);


            var patterns = meta.patterns;
            var list = Patterns.getFiles(patterns);

            meta.list = list = list.map(function (file, index) {

                file = Path.format(file);

                var href = path.relative(meta.dir, file);
                href = Path.format(href);

                return {
                    'file': file,
                    'href': href,
                };

            });

            return list;

        },

        /**
        * 把当前的动态 html 引用模式块转成真实的静态 html 引用所对应的 html。
        */
        toHtml: function () {
            var meta = mapper.get(this);

            var list = meta.list;
            if (list.length == 0) {
                meta.html = '';
                return;
            }


            var tags = meta.tags;
            var sample = meta.sample;

            //todo: 检查重复的文件
            list = list.map(function (item, index) {

                return $.String.format(sample, {
                    'href': item.href,
                });
            });

            var Lines = require('Lines');
            var seperator = Lines.seperator + '    ';
            meta.html = list.join(seperator) + seperator;

        },

        /**
        * 把整一块动态 html 引用模式替换成真实的静态 html 引用。
        * @param {string} [master] 要替换的母版 html。 如果不指定，则使用原来的。
        *   注意，如果使用新的模板，则该模板中的模式不能变。
        */
        mix: function (master) {
            var meta = mapper.get(this);
            var outer = meta.outer;

            master = master || meta.master;

            //实现安全替换
            var beginIndex = master.indexOf(outer);
            var endIndex = beginIndex + outer.length;

            master =
                master.slice(0, beginIndex) +
                meta.html +
                master.slice(endIndex);

            return master;

        },

        /**
        * 监控当前模式下 html 文件的变化。
        */
        watch: function () {
            var meta = mapper.get(this);
            var patterns = meta.patterns;
            if (patterns.length == 0) { //列表为空，不需要监控
                return;
            }

            var watcher = meta.watcher;
            if (!watcher) { //首次创建
                watcher = meta.watcher = new Watcher();

                var emitter = meta.emitter;
                var self = this;

                watcher.on({
                    'added': function (files) {
                        self.get();
                        self.toHtml();
                        emitter.fire('change');
                    },

                    'deleted': function (files) {
                        self.get();
                        self.toHtml();
                        emitter.fire('change');
                    },

                    //重命名的，会先后触发：deleted 和 renamed
                    'renamed': function (files) {
                        self.get();
                        self.toHtml();
                        emitter.fire('change');
                    },

                });

            }

            watcher.set(patterns);
           

        },
        

        /**
        * 绑定事件。
        */
        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);

            return this;
        },



    };



    return HtmlList;



});






/**
* 动态 JS 资源文件列表。
*/
define('JsList', function (require, module, exports) {

    var $ = require('$');
    var path = require('path');

    var File = require('File');
    var FileRefs = require('FileRefs');
    var Path = require('Path');
    var Patterns = require('Patterns');
    var MD5 = require('MD5');
    var Watcher = require('Watcher');
    var Defaults = require('Defaults');
    var Log = require('Log');
    var Attribute = require('Attribute');
    var Lines = require('Lines');
    var Url = require('Url');

    var Mapper = $.require('Mapper');
    var Emitter = $.require('Emitter');
    


    var mapper = new Mapper();




    function JsList(dir, config) {


        Mapper.setGuid(this);
        config = Defaults.clone(module.id, config);

        var rid = $.String.random(4); //随机 id

        var meta = {

            'dir': dir,         //母版页所在的目录。
            'master': '',       //母版页的内容，在 parse() 中用到。
            'html': '',         //模式所生成的 html 块，即缓存 toHtml() 方法中的返回结果。
            'outer': '',        //包括开始标记和结束标记在内的原始的整一块 html。
            'patterns': [],     //模式列表。
            'list': [],         //真实 js 文件列表及其它信息。
            'file$stat': {},    //记录文件内容中的最大行数和最大列数信息。 
            'file$md5': {}, 


            'scriptType': $.String.random(64),      //用于 script 的 type 值。 在页面压缩 js 时防止重复压缩。
            'emitter': new Emitter(this),
            'watcher': null,                        //监控器，首次用到时再创建。

            'extraPatterns': config.extraPatterns,  //额外附加的模式。
            'regexp': config.regexp,
            'md5': config.md5,
            'sample': config.sample,
            'tags': config.tags,
            'concat': config.concat,
            'minify': config.minify,
            'inline': config.inline,
            'max': config.max,              //允许的最大行数和列数。
            'htdocsDir': config.htdocsDir,

            //记录 concat, minify 的输出结果
            'build': {
                file: '',       //完整物理路径
                content: '',    //合并和压缩后的内容
            },

        };

        mapper.set(this, meta);

    }



    JsList.prototype = {
        constructor: JsList,

        /**
        * 重置为初始状态，即创建时的状态。
        */
        reset: function () {

            var meta = mapper.get(this);

            //删除之前的文件引用计数
            meta.list.forEach(function (item) {
                FileRefs.delete(item.file);         
            });


            $.Object.extend(meta, {
                'master': '',       //母版页的内容，在 parse() 中用到。
                'html': '',         //模式所生成的 html 块，即缓存 toHtml() 方法中的返回结果。
                'outer': '',        //包括开始标记和结束标记在内的原始的整一块 html。
                'patterns': [],     //模式列表。
                'list': [],         //真实 js 文件列表及其它信息。
                'file$stat': {},    //文件所对应的最大行数和最大列数等统计信息。 
                'file$md5': {},     //
                'build': {
                    file: '',       //完整物理路径
                    content: '',    //合并和压缩后的内容
                },
            });

        },


        /**
        * 从当前或指定的母版页 html 内容中提出 js 文件列表信息。
        * @param {string} master 要提取的母版页 html 内容字符串。
        */
        parse: function (master) {
            var meta = mapper.get(this);
            master = meta.master = master || meta.master;
           

            var tags = meta.tags;
            var dir = meta.dir;
        
            var html = $.String.between(master, tags.begin, tags.end);
            if (!html) {
                return;
            }

            var patterns = $.String.between(html, '<script>', '</script>');

            if (!patterns) {

                var list = html.match(meta.regexp);
                if (!list) {
                    return;
                }
                
                var lines = Lines.get(html);
                var startIndex = 0;

                patterns = $.Array.map(list, function (item, index) {

                    var src = Attribute.get(item, 'src');
                    if (!src) {
                        console.log('JsList 块里的 script 标签必须含有 src 属性:'.bgRed, item);
                        throw new Error();
                    }

                    var index = Lines.getIndex(lines, item, startIndex);
                    var line = lines[index];    //整一行的 html。

                    //所在的行给注释掉了，忽略
                    if (Lines.commented(line, item)) {
                        return null;
                    }

                    startIndex = index + 1; //下次搜索的起始行号
                    
                    if (Url.checkFull(src)) { //是绝对(外部)地址
                        console.log('JsList 块里的 script 标签 src 属性不能引用外部地址:'.bgRed, item);
                        throw new Error();
                    }

                    src = Path.format(src);
                    return src;
                });

                patterns = JSON.stringify(patterns, null, 4);
            }


            if (!patterns) {
                return;
            }

            //母版页中可能会用到的上下文。
            var context = {
                'dir': dir,
                'master': master,
                'tags': meta.tags,
                'htdocsDir': meta.htdocsDir,
            };

            var fn = new Function('require', 'context',
                //包装多一层匿名立即执行函数
                'return (function () { ' +
                    'var a = ' + patterns + '; \r\n' +
                    'return a;' +
                '})();'
            );

            //执行母版页的 js 代码，并注入变量。
            patterns = fn(require, context);

            if (!Array.isArray(patterns)) {
                throw new Error('引入文件的模式必须返回一个数组!');
            }

            patterns = patterns.concat(meta.extraPatterns); //跟配置中的模式合并
            patterns = Patterns.fill(dir, patterns);
            patterns = Patterns.combine(dir, patterns);

            console.log('匹配到'.bgGreen, patterns.length.toString().cyan, '个 js 模式:');
            Log.logArray(patterns);

            meta.patterns = patterns;
            meta.outer = tags.begin + html + tags.end;

        },

        /**
        * 根据当前模式获取对应真实的 js 文件列表和其它信息。
        */
        get: function () {
            var meta = mapper.get(this);
           
            //删除之前的文件引用计数
            meta.list.forEach(function (item) {
                FileRefs.delete(item.file);
            });

            var patterns = meta.patterns;
            var list = Patterns.getFiles(patterns);

            list = $.Array.keep(list, function (file, index) {

                file = Path.format(file);

                var href = path.relative(meta.dir, file);
                href = Path.format(href);

                FileRefs.add(file);

                return {
                    'file': file,
                    'href': href,
                };

            });

            meta.list = list;

        },


        /**
        * 获取 js 文件列表所对应的 md5 值和引用计数信息。
        */
        md5: function () {
            var meta = mapper.get(this);
            var file$md5 = meta.file$md5;
            var list = meta.list;
   
            var file$stat = {};

            list.forEach(function (item) {

                var file = item.file;
                var stat = file$stat[file];
                if (stat) {
                    stat['count']++;
                    return;
                }


                var md5 = file$md5[file];
                if (!md5) {
                    md5 = file$md5[file] = MD5.read(file);
                }

                file$stat[file] = {
                    'count': 1,
                    'md5': md5,
                };

            });

            return file$stat;
        },

        /**
        * 把当前的动态 js 引用模式块转成真实的静态 js 引用所对应的 html。
        */
        toHtml: function () {
            var meta = mapper.get(this);
            var sample = meta.sample;
            var list = meta.list;
            if (list.length == 0) {
                meta.html = '';
                return;
            }

            var tags = meta.tags;
            var file$stat = meta.file$stat;
            var file$md5 = meta.file$md5;

            var max = meta.max;

            //需要排除的文件列表，即不作检查的文件列表。
            var excludes = max.excludes;
            if (excludes) {
                excludes = Patterns.combine(meta.htdocsDir, excludes);
            }


            //todo: 检查重复的文件
            list = $.Array.keep(list, function (item, index) {
                var href = item.href;
                var file = item.file;

                var stat = file$stat[file];
                if (!stat) {
                    var content = File.read(file);
                    stat = file$stat[file] = Lines.stat(content);
                }

                //在排除列表中的文件，不作检查。
                //具体为: 如果未指定排除列表，或者不在排除列表中。
                if (!excludes || !Patterns.matchedIn(excludes, file)) {

                    if (stat.y > max.y) {
                        console.log('超出所允许的最大行数'.bgRed, JSON.stringify({
                            '所在文件': file,
                            '当前原始行数': stat.y0,
                            '当前有效行数': stat.y,
                            '允许最大行数': max.y,
                            '超过行数': stat.y - max.y,
                        }, null, 4).yellow);
                        throw new Error();
                    }

                    if (stat.x > max.x) {
                        console.log('代码行超出所允许的最大长度'.bgRed, JSON.stringify({
                            '所在文件': file,
                            '所在行号': stat.no,
                            '当前行长度': stat.x,
                            '允许最大长度': max.x,
                            '超过长度': stat.x - max.x,
                        }, null, 4).yellow);
                        throw new Error();
                    }
                }



                var len = meta.md5;
                if (len > 0) {

                    var md5 = file$md5[file];

                    if (!md5) { //动态去获取 md5 值。
                        md5 = file$md5[file] = MD5.read(file);
                    }

                    md5 = md5.slice(0, len);

                    href = href + '?' + md5;
                }

                return $.String.format(sample, {
                    'href': href,
                });
            });

            meta.html =
                tags.begin + '\r\n    ' +
                list.join('\r\n    ') + '\r\n    ' +
                tags.end + '\r\n';

        },

        /**
        * 把整一块动态 js 引用模式替换成真实的静态 js 引用。
        * @param {string} [master] 要替换的母版 html。 如果不指定，则使用原来的。
        *   注意，如果使用新的模板，则该模板中的模式不能变。
        */
        mix: function (master) {
            var meta = mapper.get(this);
            var outer = meta.outer;

            master = master || meta.master;

            //实现安全替换
            var beginIndex = master.indexOf(outer);
            var endIndex = beginIndex + outer.length;

            master =
                master.slice(0, beginIndex) +
                meta.html + 
                master.slice(endIndex);

            return master;

        },

        /**
        * 监控当前模式下 js 文件的变化。
        */
        watch: function () {
            var meta = mapper.get(this);
            var patterns = meta.patterns;
            if (patterns.length == 0) { //列表为空，不需要监控
                return;
            }


            var watcher = meta.watcher;

            if (!watcher) { //首次创建
               
                watcher = meta.watcher = new Watcher();

                var self = this;
                var file$stat = meta.file$stat;
                var file$md5 = meta.file$md5;
                var emitter = meta.emitter;

                watcher.on({
                    'added': function (files) {
                        self.get();
                        self.toHtml();
                        emitter.fire('change');
                    },

                    'deleted': function (files) {

                        //删除对应的记录
                        files.forEach(function (file) {
                            delete file$stat[file];
                            delete file$md5[file];
                            FileRefs.delete(file, true);
                        });

                        self.get();
                        self.toHtml();
                        emitter.fire('change');
                    },

                    //重命名的，会先后触发：deleted 和 renamed
                    'renamed': function (files) {
                        self.get();
                        self.toHtml();
                        emitter.fire('change');
                    },

                    'changed': function (files) {

                        //让对应的记录作废
                        files.forEach(function (file) {
                            file$stat[file] = null;
                            file$md5[file] = null;
                        });

                        self.toHtml();
                        emitter.fire('change');
                    },

                });
                
            }


            watcher.set(patterns);

        },

        /**
        * 合并对应的 js 文件列表。
        */
        concat: function (options) {

            var meta = mapper.get(this);
            var list = meta.list;
            if (list.length == 0) {
                meta.html = '';
                return;
            }


            if (options === true) { //直接指定了为 true，则使用默认配置。
                options = meta.concat;
            }
           

            list = $.Array.keep(list, function (item) {
                return item.file;
            });

            //加上文件头部和尾部，形成闭包
            var header = options.header;
            if (header) {
                header = Path.format(header);
                FileRefs.add(header);
                list = [header].concat(list);
            }

            var footer = options.footer;
            if (footer) {
                footer = Path.format(footer);
                FileRefs.add(footer);
                list = list.concat(footer);
            }

            var JS = require('JS');
            var content = JS.concat(list, {
                'addPath': options.addPath,
                'delete': options.delete,
            });


            var name = options.name || 32;
            var isMd5Name = typeof name == 'number';  //为数字时，则表示使用 md5 作为名称。
            var md5 = MD5.get(content);

            if (isMd5Name) {
                name = md5.slice(0, name) + '.js';
            }

            var file = meta.dir + name;

            if (options.write) { //写入合并后的 js 文件
                File.write(file, content);
            }


            $.Object.extend(meta.build, {
                'file': file,
                'content': content,
            });


            //更新 html

            var href = name;

            //当不是以 md5 作为名称时，即当成使用固定的名称，如 index.all.debug.js，
            //为了确保能刷新缓存，这里还是强行加进了 md5 值作为 query 部分。
            var len = meta.md5;
            if (len > 0 && !isMd5Name) { 
                href = href + '?' + md5.slice(0, len);
            }
           
            meta.html = $.String.format(meta.sample, {
                'href': href,
            });

        },


        /**
        * 压缩合并后的 js 文件。
        */
        minify: function (options) {
           
            var meta = mapper.get(this);
            if (meta.list.length == 0) {
                meta.html = '';
                return;
            }


            if (options === true) { //直接指定了为 true，则使用默认配置。
                options = meta.minify;
            }


            var build = meta.build;
            var content = build.content;

            if (options.delete) { //删除 concat() 产生的文件
                File.delete(build.file);
            }

            var JS = require('JS');
            content = JS.minify(content);    //直接从内容压缩，不读取文件


            var name = options.name || 32;
            var isMd5Name = typeof name == 'number';  //为数字时，则表示使用 md5 作为名称。
            var md5 = MD5.get(content);

            if (isMd5Name) {
                name = md5.slice(0, name) + '.js';
            }

            var file = meta.dir + name;

            if (options.write) {
                File.write(file, content);
            }


            $.Object.extend(build, {
                'file': file,
                'content': content,
            });

            //更新 html
            var href = name;

            //当不是以 md5 作为名称时，即当成使用固定的名称，如 index.all.debug.js，
            //为了确保能刷新缓存，这里还是强行加进了 md5 值作为 query 部分。
            var len = meta.md5;
            if (len > 0 && !isMd5Name) {
                href = href + '?' + md5.slice(0, len);
            }

            meta.html = $.String.format(meta.sample, {
                'href': href,
            });


        },

        /**
        * 把 js 文件的内容内联到 html 中。
        */
        inline: function (options) {

            var meta = mapper.get(this);
            if (meta.list.length == 0) {
                meta.html = '';
                return;
            }

            if (options === true) {//直接指定了为 true，则使用默认配置。
                options = meta.inline;
            }

            var build = meta.build;
            var content = build.content;

            //删除 concat() 或 minify() 产生的文件
            if (options.delete) {
                File.delete(build.file);
            }
            
            //添加一个随机的 type 值，变成不可执行的 js 代码，
            //可以防止在压缩页面时重复压缩本 js 代码。
            var sample = '<script type="{type}">{content}</script>'
            meta.html = $.String.format(sample, {
                'type': meta.scriptType,
                'content': content,
            });

        },

        /**
        * 移除临时添加进去的 script type，恢复成可执行的 script 代码。
        */
        removeType: function (master) {
            var meta = mapper.get(this);

            var tag = $.String.format('<script type="{type}">', {
                'type': meta.scriptType,
            });

            master = master.split(tag).join('<script>'); //replaceAll
            return master;
        },

        /**
        * 删除模式列表中所对应的 js 物理文件。
        */
        delete: function () {
            var meta = mapper.get(this);

            meta.list.forEach(function (item) {
                FileRefs.delete(item.file);
            });
        },

        /**
        * 绑定事件。
        */
        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);

            return this;
        },

    };


    return $.Object.extend(JsList, {

        //子类，用于提供实例方法:
        //检查 JsList 块里是否包含指定的 script 标签。
        Checker: (function () {

            var tags = null;

            function Checker(master) {
                tags = tags || Defaults.get(module.id).tags;
                this.html = $.String.between(master, tags.begin, tags.end);
            }

            Checker.prototype = {
                constructor: Checker,

                /**
                * 检查 JsList 块里是否包含指定的 script 标签。
                * 该方法主要是给 JsScripts 模块使用。
                * @param {string} 要检查的 html 文本内容。
                * @param {string} script 要检查的 script 标签内容。
                * @return {boolean} 返回一个布尔值，该值指示指定的 script 标签是否出现在 JsList 块里。
                */
                has: function (script) {
                    return this.html.indexOf(script) >= 0;
                },
            };

            return Checker;

        })(),

    });



});






/**
* 静态 JS 资源文件列表。
*/
define('JsScripts', function (require, module, exports) {

    var $ = require('$');
    var path = require('path');

    var Watcher = require('Watcher');
    var Defaults = require('Defaults');
    var MD5 = require('MD5');
    var File = require('File');
    var FileRefs = require('FileRefs');
    var Lines = require('Lines');
    var Path = require('Path');
    var Url = require('Url');
    var Attribute = require('Attribute');

    var Mapper = $.require('Mapper');
    var Emitter = $.require('Emitter');
    var $Url = $.require('Url');

    var mapper = new Mapper();



    function JsScripts(dir, config) {

 
        Mapper.setGuid(this);

        config = Defaults.clone(module.id, config);

        var meta = {
            'dir': dir,
            'master': '',
            'list': [],     //js 文件列表及其它信息。
            'lines': [],    //html 换行拆分的列表
            'file$md5': {},
         
            'emitter': new Emitter(this),
            'watcher': null,    //监控器，首次用到时再创建。

            'regexp': config.regexp,
            'md5': config.md5,
            'exts': config.exts,
            'minify': config.minify,
        };

        mapper.set(this, meta);


    }



    JsScripts.prototype = {
        constructor: JsScripts,

        /**
        * 重置为初始状态，即创建时的状态。
        */
        reset: function () {

            var meta = mapper.get(this);


            meta.list.forEach(function (item) {
                FileRefs.delete(item.file); //删除之前的文件引用计数
                FileRefs.delete(item.build.file); //删除之前的文件引用计数
            });


            $.Object.extend(meta, {
                'master': '',
                'list': [],
                'lines': [],
                'file$md5': {},
            });

        },

        /**
        * 从当前或指定的母版页 html 内容中提出 js 文件列表信息。
        * @param {string} master 要提取的母版页 html 内容字符串。
        */
        parse: function (master) {

            var meta = mapper.get(this);
            master = meta.master = master || meta.master;

            //这个不能少，不管下面的 list 是否为空。 在 mix() 中用到。
            var lines = Lines.get(master);
            meta.lines = lines;             


            //<script src="f/jquery/jquery-2.1.1.debug.js"></script>
            //提取出含有 src 属性的 script 标签
            //var reg = /<script\s+.*src\s*=\s*["\'][\s\S]*?["\'].*>[\s\S]*?<\/script>/ig;
            //var reg = /<script[^>]*?>[\s\S]*?<\/script>/gi;
            //var reg = /<script\s+.*src\s*=\s*[^>]*?>[\s\S]*?<\/script>/gi;
            var list = master.match(meta.regexp);

            if (!list) {
                return;
            }

            var debug = meta.exts.debug;
            var min = meta.exts.min;
            
            var Checker = require('JsList').Checker;
            var JsList = new Checker(master);

            var startIndex = 0;

            list = $.Array.map(list, function (item, index) {

                //不含有 src 属性，忽略掉。
                var src = Attribute.get(item, 'src');
                if (!src) {
                    return null;
                }

                //该 script 标签出现在 JsList 块里，忽略掉。
                if (JsList.has(item)) {
                    return null;
                }

                var index = Lines.getIndex(lines, item, startIndex);
                var line = lines[index];    //整一行的 html。
                lines[index] = null;        //先清空，后续会在 mix() 中重新计算而填进去。

                //所在的行给注释掉了，忽略掉。
                if (Lines.commented(line, item)) {
                    return null;
                }


                startIndex = index + 1; //下次搜索的起始行号
            
                var suffix = Url.suffix(src);
                var prefix = suffix ? src.slice(0, -suffix.length) : src;
                var ext = $.String.endsWith(prefix, debug) ? debug :
                        $.String.endsWith(prefix, min) ? min :
                        path.extname(prefix);

                var name = ext ? prefix.slice(0, -ext.length) : prefix;

                var file = '';

                if (!Url.checkFull(src)) { //不是绝对(外部)地址
                    file = Path.format(src);
                    file = Path.join(meta.dir, file);
             
                    FileRefs.add(file);
                }
                


                return {
                    'file': file,       //完整的物理路径。 如果是外部地址，则为空字符串。
                    'src': src,         //原始地址，带 query 和 hash 部分。
                    'suffix': suffix,   //扩展名之后的部分，包括 '?' 在内的 query 和 hash 一整体。
                    'name': name,       //扩展名之前的部分。
                    'ext': ext,         //路径中的后缀名，如 '.debug.js'|'.min.js'|'.js'。
                    'index': index,     //行号，从 0 开始。
                    'html': item,       //标签的 html 内容。
                    'line': line,       //整一行的 html 内容。
                    'build': {},        //记录 build() 的输出结果。
                };

            });

            meta.list = list;

        },

        /**
        * 获取 js 文件列表所对应的 md5 值和引用计数信息。
        */
        md5: function () {
            var meta = mapper.get(this);
            var file$md5 = meta.file$md5;
            var list = meta.list;

            var file$stat = {};

            list.forEach(function (item) {

                var file = item.file;
                if (!file) {
                    return;
                }

                var stat = file$stat[file];
                if (stat) {
                    stat['count']++;
                    return;
                }


                var md5 = file$md5[file];
                if (!md5) {
                    md5 = file$md5[file] = MD5.read(file);
                }

                file$stat[file] = {
                    'count': 1,
                    'md5': md5,
                };
                
            });

            return file$stat;
        },

        /**
        * 监控 js 文件的变化。
        */
        watch: function () {
            var meta = mapper.get(this);

            //这里不要缓存起来，因为可能在 parse() 中给重设为新的对象。
            //var list = meta.list; 
            //var file$md5 = meta.file$md5; 

            var watcher = meta.watcher;

            if (!watcher) { //首次创建。

                watcher = meta.watcher = new Watcher();

                var self = this;
                var emitter = meta.emitter;

                watcher.on({

                    'added': function (files) {
                        
                    },

                    'deleted': function (files) {
                        
                        console.log('文件已给删除'.yellow, files);
                    },

                    //重命名的，会先后触发：deleted 和 renamed
                    'renamed': function (files) {
                       
                        //emitter.fire('change');
                    },


                    'changed': function (files) {

                        files.forEach(function (file) {

                            //让对应的 md5 记录作废。
                            meta.file$md5[file] = '';

                            //根据当前文件名，找到具有相同文件名的节点集合。
                            var items = $.Array.grep(meta.list, function (item, index) {
                                return item.file == file;
                            });

                            //对应的 html 作废。
                            items.forEach(function (item) {
                                meta.lines[item.index] = null;
                            });

                        });

                        emitter.fire('change');
                    },

                });
            }


            var files = $.Array.map(meta.list, function (item) {
                return item.file || null;
            });



            //watcher.set(files);


        },

        /**
        * 
        */
        mix: function () {
            var meta = mapper.get(this);
            var list = meta.list;
            var lines = meta.lines;
            var file$md5 = meta.file$md5;
            var replace = $.String.replaceAll;

            var len = meta.md5;
            var rid = $.String.random(32);

            list.forEach(function (item) {

                var index = item.index;
                if (lines[index]) { //之前已经生成过了
                    return;
                }

                var build = item.build;
                var ext = build.ext || item.ext;
                var dest = item.name + ext + item.suffix;
                var file = build.file || item.file;
               
                if (file) {//引用的是本地文件
                    var md5 = file$md5[file];

                    if (!md5) { //动态去获取 md5 值。
                        md5 = file$md5[file] = MD5.read(file);
                    }

                    md5 = md5.slice(0, len);
                    dest = $Url.addQueryString(dest, md5, rid);
                    dest = replace(dest, md5 + '=' + rid, md5); //为了把类似 'MD5=XXX' 换成 'MD5'。
                }

   
                var html = replace(item.html, item.src, dest);
                var line = replace(item.line, item.html, html);

                lines[index] = line;
                
            });

            return Lines.join(lines);

        },


        /**
        * 压缩对应的 js 文件。
        */
        minify: function (options) {

            var meta = mapper.get(this);

            if (options === true) { //直接指定了为 true，则使用默认配置。
                options = meta.minify;
            }

            //https://github.com/mishoo/UglifyJS2
            var UglifyJS = require('uglify-js');
            var list = meta.list;

            list.forEach(function (item) {

                var ext = item.ext;
                var opts = options[ext];
                if (!opts) {
                    return;
                }


                var file = item.file;
                if (!file) { //外部地址
                    if (opts.outer) { //指定了替换外部地址为压缩版
                        item.build.ext = opts.ext;
                    }
                    return;
                }

               
                var result = UglifyJS.minify(file);
                var content = result.code;

                if (opts.delete) { //删除源 js文件
                    FileRefs.delete(file);
                }

                var dest = item.name + opts.ext;
                dest = Path.join(meta.dir, dest);

                if (opts.write) {
                    if (File.exists(dest)) {
                        if (opts.overwrite) {
                            File.write(dest, content);
                        }
                    }
                    else {
                        File.write(dest, content);
                    }
                }

                $.Object.extend(item.build, {
                    'file': dest,
                    'ext': opts.ext,
                    'content': content,
                });

            });

        },


        /**
        * 把 js 文件的内容内联到 html 中。
        */
        inline: function (items) {

            var meta = mapper.get(this);
            var list = meta.list;
            var lines = meta.lines;

            //重载 inline();
            if (!items) {
                items = $.Array.map(list, function (item) {
                    var file = item.file;
                    if (!file) {
                        return null;
                    }

                    return {
                        'file': item.file,
                        'delete': false, //是否删除源 js 文件。
                    };
                });
            }


            items.forEach(function (item) {
                var file = Path.format(item.file);
                var content = File.read(file);

                var items = $.Array.grep(list, function (item) {
                    return item.file == file;
                });

                items.forEach(function (item) {
                    var index = item.index;
                    lines[index] = '    <script>' + content + '</script>';
                });

                //删除
                if (item.delete) {
                    FileRefs.delete(file);
                }
            });

            return Lines.join(lines);


        },


        /**
        * 删除列表中所对应的 js 物理文件。
        */
        'delete': function () {
            var meta = mapper.get(this);
            var list = meta.list;

            list.forEach(function (item) {
                FileRefs.delete(item.file);
            });


        },


        /**
        * 绑定事件。
        */
        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);

            return this;
        },



    };



    return JsScripts;



});






/**
* 静态 less 资源文件列表。
*/
define('LessLinks', function (require, module, exports) {

    var $ = require('$');
    var path = require('path');

    var Watcher = require('Watcher');
    var Defaults = require('Defaults');
    var MD5 = require('MD5');
    var File = require('File');
    var FileRefs = require('FileRefs');
    var Lines = require('Lines');
    var Path = require('Path');
    var Url = require('Url');
    var Attribute = require('Attribute');

    var Mapper = $.require('Mapper');
    var Emitter = $.require('Emitter');
    var $Url = $.require('Url');

    var mapper = new Mapper();



    function LessLinks(dir, config) {

        Mapper.setGuid(this);

        config = Defaults.clone(module.id, config);

        var meta = {
            'dir': dir,

            'master': '',
            'list': [],
            'lines': [],        //html 换行拆分的列表
            'less$item': {},    //less 文件所对应的信息

            'emitter': new Emitter(this),
            'watcher': null,    //监控器，首次用到时再创建

            'regexp': config.regexp,
            'md5': config.md5,          //填充模板所使用的 md5 的长度
            'sample': config.sample,    //使用的模板
            'tags': config.tags,
            'htdocsDir': config.htdocsDir,
            'cssDir': config.cssDir,
            'minify': config.minify,
          
        };





        mapper.set(this, meta);

    }



    LessLinks.prototype = {
        constructor: LessLinks,

        /**
        * 重置为初始状态，即创建时的状态。
        * @param {boolean} keep 是否保留之前编译过的信息。
        *   如果需要保留，请指定为 true；否则指定为 false 或不指定。
        */
        reset: function (keep) {
            var meta = mapper.get(this);
            var less$item = meta.less$item;

            meta.list.forEach(function (obj) {
                var less = obj.file;
                var item = less$item[less];

                FileRefs.delete(less);
                FileRefs.delete(item.file);
            });

            $.Object.extend(meta, {
                'master': '',
                'list': [],
                'lines': [],        //html 换行拆分的列表
                'less$item': keep ? less$item : {},    //less 文件所对应的信息
            });
        },

        /**
        * 从当前或指定的母版页 html 内容中提出 less 文件列表信息。
        * @param {string} master 要提取的母版页 html 内容字符串。
        */
        parse: function (master) {

            var meta = mapper.get(this);
            master = meta.master = master || meta.master;

            //这里必须要有，不管下面的 list 是否有数据。
            var lines = Lines.get(master);
            meta.lines = lines;

            //提取出 link 标签
            var list = master.match(meta.regexp);
            if (!list) {
                return;
            }

            var startIndex = 0;         //搜索的起始行号

            list = $.Array.map(list, function (item, index) {

                var href = Attribute.get(item, 'href');
                if (!href) {
                    return null;
                }

                var index = Lines.getIndex(lines, item, startIndex);
                startIndex = index + 1;     //下次搜索的起始行号。 这里要先加

                var line = lines[index];    //整一行的 html。
                lines[index] = null;        //先清空，后续会在 mix() 中重新计算而填进去。

                //所在的行给注释掉了，忽略
                if (Lines.commented(line, item)) {
                    return null;
                }

                var file = Path.join(meta.dir, href);

                return {
                    'file': file,
                    'index': index,     //行号，从 0 开始。
                    'html': item,       //标签的 html 内容。
                    'line': line,       //整一行的 html 内容。
                };
            });

            meta.list = list;



        },


        /**
        * 根据当前真实的 less 文件列表获取对应将要产生 css 文件列表。
        */
        get: function () {
            var meta = mapper.get(this);

            var htdocsDir = meta.htdocsDir;
            var cssDir = meta.cssDir;
            var less$item = meta.less$item;

            meta.list.forEach(function (item) {
                var less = item.file;

                //如 less = '../htdocs/html/test/style/less/index.less';

                if (less$item[less]) { //已处理过该项，针对 watch() 中的频繁调用。
                    return;
                }


                var name = path.relative(htdocsDir, less);  //如 'html/test/style/less/index.less'
                var ext = path.extname(name);               //如 '.less' 
                var basename = path.basename(name, ext);    //如 'index'

                name = path.dirname(name);              //如 'html/test/style/less'
                name = name.split('\\').join('.');      //如 'html.test.style.less'
                name = name + '.' + basename + '.css';  //如 'html.test.style.less.index.css'

                var file = path.join(cssDir, name);
                file = Path.format(file);

                var href = path.relative(meta.dir, file);
                href = Path.format(href);

                less$item[less] = {
                    'file': file,   //完整的 css 物理路径。
                    'href': href,   //用于 link 标签中的 href 属性(css)
                    'content': '',  //编译后的 css 内容。
                    'md5': '',      //编译后的 css 内容对应的 md5 值，需要用到时再去计算。
                };

                FileRefs.add(less);
                FileRefs.add(file);

            });



        },


        /**
        * 获取 less 文件列表所对应的 md5 值和引用计数信息。
        */
        md5: function () {
            var meta = mapper.get(this);
            var list = meta.list;
            var file$stat = {};

            list.forEach(function (item) {

                var file = item.file;
                var stat = file$stat[file];

                if (stat) {
                    stat['count']++;
                    return;
                }

                var md5 = MD5.read(file);

                file$stat[file] = {
                    'count': 1,
                    'md5': md5,
                };

            });

            return file$stat;
        },



        /**
        * 编译 less 文件列表(异步模式)。
        * 如果指定了要编译的列表，则无条件进行编译。
        * 否则，从原有的列表中过滤出尚未编译过的文件进行编译。
        * 已重载:
            compile(list, fn);
            compile(list, options);
            compile(list);
            compile(fn);
            compile(options);
            compile(options, fn);
        * @param {Array} [list] 经编译的 less 文件列表。 
            如果指定了具体的 less 文件列表，则必须为当前文件引用模式下的子集。 
            如果不指定，则使用原来已经解析出来的文件列表。
            提供了参数 list，主要是在 watch() 中用到。
        */
        compile: function (list, options) {
            var fn = null;
            if (list instanceof Array) {
                if (typeof options == 'function') { //重载 compile(list, fn);
                    fn = options;
                    options = null;
                }
                else if (typeof options == 'object') { //重载 compile(list, options);
                    fn = options.done;
                }
                else { //重载 compile(list);
                    options = null;
                }
            }
            else if (typeof list == 'function') { //重载 compile(fn);
                fn = list;
                list = null;
            }
            else if (typeof list == 'object') { //重载 compile(options); 或 compile(options, fn)
                fn = options;
                options = list;
                list = null;
                fn = fn || options.done;
            }


            options = options || {  //这个默认值不能删除，供开发时 watch 使用。
                'write': true,      //写入 css
                'minify': false,    //使用压缩版。
                'delete': false,    //删除 less，仅提供给上层业务 build 时使用。
            };


            var Less = require('Less');
            var meta = mapper.get(this);
            var less$item = meta.less$item;
            var force = !!list;         //是否强制编译

            list = list || meta.list.map(function (item) {
                return item.file;
            });


            if (list.length == 0) { //没有 less 文件
                fn && fn();
                return;
            }



            //并行地发起异步的 less 编译
            var Tasks = require('Tasks');
            Tasks.parallel({
                data: list,
                each: function (less, index, done) {
                    var item = less$item[less];

                    //没有指定强制编译，并且该文件已经编译过了，则跳过。
                    if (!force && item.content) {
                        done();
                        return;
                    }

                    Less.compile({
                        'src': less,
                        'dest': options.write ? item.file : '',
                        'delete': options.delete,
                        'compress': options.minify,
                        'done': function (css) {
                            item.content = css;
                            done();
                        },
                    });

                },
                all: function () {  //已全部完成
                    fn && fn();
                },
            });
        },


        /**
        * 监控 css 文件的变化。
        */
        watch: function () {
            var meta = mapper.get(this);

            //这里不要缓存起来，因为可能在 parse() 中给重设为新的对象。
            //var list = meta.list; 
            var watcher = meta.watcher;

            if (!watcher) { //首次创建。
                watcher = meta.watcher = new Watcher();

                var self = this;
                var emitter = meta.emitter;
                var less$item = meta.less$item;

                watcher.on({

                    'deleted': function (files) {
                        console.log('文件已给删除'.yellow, files);
                    },

                    'changed': function (files) {

                        //让对应的记录作废
                        files.forEach(function (less) {
                            var item = less$item[less];
                            item.md5 = '';
                            item.content = '';

                            //根据当前文件名，找到具有相同文件名的节点集合。
                            //让对应的 html 作废。
                            meta.list.forEach(function (item) {
                                if (item.file != less) {
                                    return;
                                }

                                meta.lines[item.index] = null;
                            });
                        });

                        self.compile(files, function () {
                            emitter.fire('change');
                        });

                    },

                });
            }


            var files = meta.list.map(function (item) {
                return item.file;
            });

            watcher.set(files);

        },


        /**
        * 
        */
        mix: function () {
            var meta = mapper.get(this);
            var list = meta.list;
            var lines = meta.lines;
            var replace = $.String.replaceAll;
            var len = meta.md5;
            var less$item = meta.less$item;
            var sample = meta.sample;


            list.forEach(function (obj) {

                var index = obj.index;
                if (lines[index]) { //之前已经生成过了
                    return;
                }

                var less = obj.file;
                var item = less$item[less];
                var href = item.href;

                if (len > 0) {
                    var md5 = item.md5;
                    if (!md5) { //动态去获取 md5 值。
                        md5 = item.md5 = MD5.get(item.content, len);
                    }

                    href = href + '?' + md5;
                }

                var html = $.String.format(sample, {
                    'href': href,
                });

                var line = replace(obj.line, obj.html, html);

                lines[index] = line;

            });


            return Lines.join(lines);

        },





        /**
        * 绑定事件。
        */
        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);

            return this;
        },



    };



    return LessLinks;



});






/**
* 动态 Less 资源文件列表。
*/
define('LessList', function (require, module, exports) {

    var $ = require('$');
    var path = require('path');

    var File = require('File');
    var FileRefs = require('FileRefs');
    var Watcher = require('Watcher');
    var MD5 = require('MD5');
    var Path = require('Path');
    var Patterns = require('Patterns');
    var Defaults = require('Defaults');
    var Log = require('Log');

    var Mapper = $.require('Mapper');
    var Emitter = $.require('Emitter');
    var Url = $.require('Url');
   

    var mapper = new Mapper();




    function LessList(dir, config) {


        Mapper.setGuid(this);
        config = Defaults.clone(module.id, config);


        var meta = {
            'dir': dir,         //母版页所在的目录。
            'master': '',       //母版页的内容，在 parse() 中用到。
            'html': '',         //模式所生成的 html 块。
            'outer': '',        //包括开始标记和结束标记在内的原始的整一块 html。
            'patterns': [],     //全部模式列表。
            'list': [],         //真实 less 文件列表。
            'less$item': {},    //less 文件所对应的信息

            'emitter': new Emitter(this),
            'watcher': null,    //监控器，首次用到时再创建

            'extraPatterns': config.extraPatterns,  //额外附加的模式。
            'md5': config.md5,                      //填充模板所使用的 md5 的长度
            'sample': config.sample,                //使用的模板
            'tags': config.tags,
            'htdocsDir': config.htdocsDir,
            'cssDir': config.cssDir,
            'concat': config.concat,
            'minify': config.minify,

            //记录 concat, minify 的输出结果
            'build': {
                file: '',       //完整物理路径
                href: '',       //用于 link 标签中的 href 属性
                content: '',    //合并和压缩后的内容
            },

        };

        mapper.set(this, meta);

    }



    LessList.prototype = {
        constructor: LessList,

        /**
        * 重置为初始状态，即创建时的状态。
        */
        reset: function () {
            var meta = mapper.get(this);
            var less$item = meta.less$item;

            meta.list.forEach(function (less) {
                var item = less$item[less];

                FileRefs.delete(less);
                FileRefs.delete(item.file);
            });


            $.Object.extend(meta, {
                'master': '',       //母版页的内容，在 parse() 中用到。
                'html': '',         //模式所生成的 html 块。
                'outer': '',        //包括开始标记和结束标记在内的原始的整一块 html。
                'patterns': [],     //模式列表。
                'list': [],         //真实 less 文件列表。
                'less$item': {},    //less 文件所对应的信息

                //记录 concat, minify 的输出结果
                'build': {
                    file: '',       //完整物理路径
                    href: '',       //用于 link 标签中的 href 属性
                    content: '',    //合并和压缩后的内容
                },
            });
        },

        /**
        * 从当前或指定的母版页 html 内容中提出 less 文件列表信息。
        * @param {string} master 要提取的母版页 html 内容字符串。
        */
        parse: function (master) {
            var meta = mapper.get(this);
            master = meta.master = master || meta.master;

            var tags = meta.tags;
            var html = $.String.between(master, tags.begin, tags.end);

            if (!html) {
                return;
            }

            var patterns = $.String.between(html, '<script>', '</script>');
            if (!patterns) {
                return;
            }

            var dir = meta.dir;

            //母版页中可能会用到的上下文。
            var context = {
                'dir': dir,
                'master': master,
                'tags': meta.tags,
                'htdocsDir': meta.htdocsDir,
                'cssDir': meta.cssDir,
            };

            var fn = new Function('require', 'context',
                //包装多一层匿名立即执行函数
                'return (function () { ' +
                    'var a = ' + patterns + '; \r\n' +
                    'return a;' +
                '})();'
            );

            //执行母版页的 js 代码，并注入变量。
            patterns = fn(require, context);

            if (!Array.isArray(patterns)) {
                throw new Error('引入文件的模式必须返回一个数组!');
            }

            patterns = patterns.concat(meta.extraPatterns); //跟配置中的模式合并
            patterns = Patterns.fill(dir, patterns);
            patterns = Patterns.combine(dir, patterns);

            console.log('匹配到'.bgGreen, patterns.length.toString().cyan, '个 less 模式:');
            Log.logArray(patterns);

            meta.patterns = patterns;
            meta.outer = tags.begin + html + tags.end;

        },

        /**
        * 根据当前模式获取对应真实的 less 文件列表和将要产生 css 文件列表。
        */
        get: function () {
            var meta = mapper.get(this);
            var patterns = meta.patterns;
            var htdocsDir = meta.htdocsDir;
            var cssDir = meta.cssDir;
            var less$item = meta.less$item;
          
            var list = Patterns.getFiles(patterns);

            list.forEach(function (less) {
                //如 less = '../htdocs/html/test/style/less/index.less';

                if (less$item[less]) { //已处理过该项，针对 watch() 中的频繁调用。
                    return;
                }

                var name = path.relative(htdocsDir, less);  //如 'html/test/style/less/index.less'
                var ext = path.extname(name);               //如 '.less' 
                var basename = path.basename(name, ext);    //如 'index'

                name = path.dirname(name);              //如 'html/test/style/less'
                name = name.split('\\').join('.');      //如 'html.test.style.less'
                name = name + '.' + basename + '.css';  //如 'html.test.style.less.index.css'

                var file = path.join(cssDir, name);
                file = Path.format(file);

                var href = path.relative(meta.dir, file);
                href = Path.format(href);

                less$item[less] = {
                    'file': file,   //完整的 css 物理路径。
                    'href': href,   //用于 link 标签中的 href 属性(css)
                    'content': '',  //编译后的 css 内容。
                    'md5': '',      //编译后的 css 内容对应的 md5 值，需要用到时再去计算。
                };

                FileRefs.add(less);
                FileRefs.add(file);

            });

            meta.list = list;
            
           
        },


        /**
        * 获取 less 文件列表所对应的 md5 值和引用计数信息。
        */
        md5: function () {
            var meta = mapper.get(this);
            var list = meta.list;
            var file$stat = {};

            list.forEach(function (file) {

                var stat = file$stat[file];
                if (stat) {
                    stat['count']++;
                    return;
                }

                var md5 = MD5.read(file);

                file$stat[file] = {
                    'count': 1,
                    'md5': md5,
                };

            });

            return file$stat;
        },

        /**
        * 编译 less 文件列表(异步模式)。
        * 如果指定了要编译的列表，则无条件进行编译。
        * 否则，从原有的列表中过滤出尚未编译过的文件进行编译。
        * 已重载:
            compile(list, fn);
            compile(list, options);
            compile(list);
            compile(fn);
            compile(options);
            compile(options, fn);
        * @param {Array} [list] 经编译的 less 文件列表。 
            如果指定了具体的 less 文件列表，则必须为当前文件引用模式下的子集。 
            如果不指定，则使用原来已经解析出来的文件列表。
            提供了参数 list，主要是在 watch() 中用到。
        */
        compile: function (list, options) {
            var fn = null;
            if (list instanceof Array) {
                if (typeof options == 'function') { //重载 compile(list, fn);
                    fn = options;
                    options = null;
                }
                else if (typeof options == 'object') { //重载 compile(list, options);
                    fn = options.done;
                }
                else { //重载 compile(list);
                    options = null;
                }
            }
            else if (typeof list == 'function') { //重载 compile(fn);
                fn = list;
                list = null;
            }
            else if (typeof list == 'object') { //重载 compile(options); 或 compile(options, fn)
                fn = options;
                options = list;
                list = null;
                fn = fn || options.done;
            }


            options = options || {  //这个默认值不能删除，供开发时 watch 使用。
                'write': true,      //写入 css
                'delete': false,    //删除 less，仅提供给上层业务 build 时使用。
            };


            var Less = require('Less');
            var meta = mapper.get(this);
            var less$item = meta.less$item;

            var force = !!list;         //是否强制编译
            list = list || meta.list;

            if (list.length == 0) { //没有 less 文件
                fn && fn();
                return;
            }



            //并行地发起异步的 less 编译
            var Tasks = require('Tasks');
            Tasks.parallel({
                data: list,
                each: function (less, index, done) {
                    var item = less$item[less];

                    //没有指定强制编译，并且该文件已经编译过了，则跳过。
                    if (!force && item.content) {
                        done();
                        return;
                    }

                    Less.compile({
                        'src': less,
                        'dest': options.write ? item.file : '',
                        'delete': options.delete,
                        'compress': false,
                        'done': function (css) {
                            item.content = css;
                            done();
                        },
                    });

                },
                all: function () {
                    //已全部完成
                    fn && fn();
                },
            });
        },


        
        /**
        * 把当前的动态 less 引用模式块转成真实的静态 css 引用所对应的 html。
        */
        toHtml: function () {
            var meta = mapper.get(this);
            var sample = meta.sample;
            var list = meta.list;
            if (list.length == 0) {
                meta.html = '';
                return;
            }

            var tags = meta.tags;
            var less$item = meta.less$item;

            //todo: 检查重复的文件
            list = $.Array.keep(list, function (less, index) {

                var item = less$item[less];
                var href = item.href;

                var len = meta.md5;
                if (len > 0) {

                    var md5 = item.md5;
                    if (!md5) { //动态去获取 md5 值。
                        md5 = item.md5 = MD5.get(item.content, len);
                    }
         
                    href = href + '?' + md5;
                }

                return $.String.format(sample, {
                    'href': href,
                });
            });

            meta.html =
                tags.begin + '\r\n    ' +
                list.join('\r\n    ') + '\r\n    ' +
                tags.end + '\r\n    ';


        },

        /**
        * 把整一块动态 less 引用模式替换成真实的静态 css 引用。
        * @param {string} [master] 要替换的母版 html。 如果不指定，则使用原来的。
        *   注意，如果使用新的模板，则该模板中的模式不能变。
        */
        mix: function (master) {
            var meta = mapper.get(this);
            var outer = meta.outer;

            master = master || meta.master;

            //实现安全替换
            var beginIndex = master.indexOf(outer);
            var endIndex = beginIndex + outer.length;

            master =
                master.slice(0, beginIndex) +
                meta.html +
                master.slice(endIndex);

            return master;

        },

        /**
        * 合并对应的 css 文件列表。
        */
        concat: function (options) {

            var meta = mapper.get(this);
            var list = meta.list;
            if (list.length == 0) { //没有 less 文件
                meta.html = '';
                return;
            }



            if (options === true) { //直接指定了为 true，则使用默认配置。
                options = meta.concat;
            }

            var build = meta.build;
            var cssDir = meta.cssDir;
            var less$item = meta.less$item;
           

            var contents = [];

            list.forEach(function (less) {
                var item = less$item[less];
                contents.push(item.content);

                if (options.delete) { //删除源分 css 文件
                    FileRefs.delete(item.file);
                }
                
            });

            var content = contents.join('');



            var name = options.name || 32;
            var isMd5Name = typeof name == 'number';  //为数字时，则表示使用 md5 作为名称。
            var md5 = MD5.get(content);

            if (isMd5Name) {
                name = md5.slice(0, name) + '.css';
            }

            var file = cssDir + name;

            var href = path.relative(meta.dir, file);
            href = Path.format(href);

            if (options.write) { //写入合并后的 css 文件
                File.write(file, content);
            }


            $.Object.extend(build, {
                'file': file,
                'href': href,
                'content': content,
            });

            //更新 html

            //当不是以 md5 作为名称时，即当成使用固定的名称，如 index.all.debug.css，
            //为了确保能刷新缓存，这里还是强行加进了 md5 值作为 query 部分。
            var len = meta.md5;
            if (len > 0 && !isMd5Name) {
                href = href + '?' + md5.slice(0, len);
            }

            meta.html = $.String.format(meta.sample, {
                'href': href,
            });

        },

        /**
        * 压缩合并后的 css 文件。
        */
        minify: function (options, fn) {

            if (!options) {
                fn && fn();
                return;
            }


            var meta = mapper.get(this);
            if (meta.list.length == 0) { //没有 less 文件
                meta.html = '';
                fn && fn();
                return;
            }


            if (options === true) { //直接指定了为 true，则使用默认配置。
                options = meta.minify;
            }

            var cssDir = meta.cssDir;
            var build = meta.build;
            var content = build.content;

            

            var Less = require('less');

            Less.render(content, {
                compress: true,

            }, function (error, output) {
            
                var content = output.css;

                var file = MD5.get(content);
                file = cssDir + file + '.css';

                var href = path.relative(meta.dir, file);
                href = Path.format(href);

                //删除 concat() 产生的文件
                if (options.delete) {
                    File.delete(build.file);
                }

                File.write(file, content);


                $.Object.extend(build, {
                    'file': file,
                    'href': href,
                    'content': content,
                });

                //更新 html
                meta.html = $.String.format(meta.sample, {
                    'href': href,
                });

                fn && fn();

            });

        },

        /**
        * 删除模式列表中所对应的 less 物理文件。
        */
        delete: function () {
            var meta = mapper.get(this);
            var list = meta.list;

            list.forEach(function (less) {
                FileRefs.delete(less);
            });

        },


        /**
        * 监控当前模式下的所有 less 文件。
        */
        watch: function () {
            var meta = mapper.get(this);
            var patterns = meta.patterns;

            if (patterns.length == 0) { //列表为空，不需要监控
                return;
            }

            var watcher = meta.watcher;
            if (!watcher) { //首次创建
                
                watcher = meta.watcher = new Watcher();

                var self = this;
                var less$item = meta.less$item;
                var emitter = meta.emitter;


                watcher.on({
                    'added': function (files) {
                        self.get();
                        self.compile(files, function () {
                            self.toHtml();
                            emitter.fire('change');
                        });
                        
                    },

                    'deleted': function (files) {

                        //删除对应的记录
                        files.forEach(function (less) {
                            var item = less$item[less];
                            delete less$item[less];

                            FileRefs.delete(less, true);
                            FileRefs.delete(item.file, true); //实时删除对应的 css 文件。

                        });

                        self.get();
                        self.toHtml();

                        emitter.fire('change');
                    },

                    //重命名的，会分别触发：deleted 和 renamed
                    'renamed': function (files) {
                        self.get();
                        self.compile(files, function () {
                            self.toHtml();
                            emitter.fire('change');
                        });
                        
                    },

                    'changed': function (files) {

                        //让对应的记录作废
                        files.forEach(function (less) {
                            var item = less$item[less];
                            item.md5 = '';
                            item.content = '';
                        });


                        //有一种情况：less 虽然发生了变化，但生成的 css 文件内容却不变。
                        //比如在 less 里加了些无用的空格、空行等。
                        var html = meta.html;

                        self.compile(files, function () {
                            self.toHtml();

                            //生成后的内容确实发生了变化
                            if (meta.html != html) {
                                emitter.fire('change');
                            }
                        });
                        
                    },

                });

            }

            watcher.set(patterns);
        },


        copy: function () {

        },


        /**
        * 绑定事件。
        */
        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);

            return this;
        },

    };



    return LessList;



});







/**
* 把 HTML 文本分裂成行的工具。
*/
define('Lines', function (require, module, exports) {

    var $ = require('$');

    /**
    * 查找指定字符串在行列表中所在的索引值(行号)。
    */
    function getIndex(list, s, startIndex) {
        var len = list.length;

        for (var i = startIndex || 0; i < len; i++) {
            var item = list[i];
            if (item.indexOf(s) >= 0) {
                return i;
            }
        }

        //这样写为了更容易发现 bug，以防万一。
        throw Error('无法找到所在 index!');

        //return -1;
    }


    //在某些操作系统下，换行符不一致时会出错。
    function get(content) {

        content = content.split('\r\n').join('\n');
        content = content.split('\r').join('\n');
        var lines = content.split('\n');

        return lines;
    }


    function join(lines) {
        return lines.join('\r\n');
    }


    //判断所在的行是否给注释掉了
    function commented(line, item) {
        return $.String.between(line, '<!--', '-->').indexOf(item) >= 0;
    }

    //统计指定内容中的行数和最大列数。
    function stat(content) {
        
        var lines = get(content);

        var x = 0;
        var y = 0;
        var no = 0;


        lines.forEach(function (line, index) {

            var s = line.trim();        //移除前后空格后。
            if (!s ||                   //没内容。
                s.startsWith('//') ||   //以 `//` 开始的注释，在单行注释里。
                s.startsWith('/*') ||   //以 `/*` 开始的注释，在多行注释里。
                s.startsWith('*')) {    //以 `*` 和 `*/` 开始的注释，在多行注释里。

                return;
            }


            y++;

            var len = line.length;
            if (len > x) {
                x = len;
                no = index;
            }
        });

        
        return {
            'x': x,             //最长的一行的长度。           
            'y': y,             //有效的行数，即去掉空行、注释行后的行数。
            'y0': lines.length, //原始行数。
            'no': no + 1,       //最最长的一行所在的行号，从 1 开始。
        };
    }
 

    return {
        get: get,
        join: join,
        getIndex: getIndex,
        commented: commented,
        seperator: '\r\n',
        'stat': stat,
    };



});






/**
* 母版页类。
*/
define('MasterPage', function (require, module, exports) {

    var path = require('path');

    var $ = require('$');
    var Mapper = $.require('Mapper');
    var Emitter = $.require('Emitter');
    var mapper = new Mapper();

    var MD5 = require('MD5');
    var File = require('File');
    var FileRefs = require('FileRefs');

    var Path = require('Path');
    var Defaults = require('Defaults');
    var Watcher = require('Watcher');
    var HtmlList = require('HtmlList');
    var HtmlLinks = require('HtmlLinks');
    var CssLinks = require('CssLinks');
    var JsList = require('JsList');
    var LessLinks = require('LessLinks');
    var LessList = require('LessList');
    var JsScripts = require('JsScripts');
    var Verifier = require('Verifier');



    function MasterPage(file, config) {

        Mapper.setGuid(this);
        config = Defaults.clone(module.id, config);

        var htdocsDir = config.htdocsDir;

        file = Path.join(htdocsDir, file);

        var dir = Path.dirname(file);           //如 '../htdocs/html/test/'
        var ext = path.extname(file);           //如 '.html'
        var name = path.basename(file, ext);    //如 'index.master'
        name = path.basename(name, path.extname(name)); //如 'index'

        var dest = dir + name + ext;
        FileRefs.add(file);


        //元数据提取
        var meta = {
            'dir': dir,     //母版页所在的目录。
            'master': '',   //母版页的原始内容。
            'file': file,   //母版页所在的完整路径
            'dest': dest,   //输出页面完整路径

            'emitter': new Emitter(this),
            'watcher': null, //监控器，首次用到时再创建
            'name$master': {}, //每个模块填充后的中间结果
            'minifyHtml': config.minifyHtml,

            //子模块实例
            'HtmlList': new HtmlList(dir),
            'HtmlLinks': new HtmlLinks(dir, {
                'base': config.base || name,    //二级目录
            }),

            'CssLinks': new CssLinks(dir),
            'JsScripts': new JsScripts(dir),
            'JsList': new JsList(dir, {
                'htdocsDir': htdocsDir,
            }),


            'LessLinks': new LessLinks(dir, {
                'htdocsDir': htdocsDir,
                'cssDir': htdocsDir + config.cssDir,
            }),

            'LessList': new LessList(dir, {
                'htdocsDir': htdocsDir,
                'cssDir': htdocsDir + config.cssDir,
            }),
           
        };

        mapper.set(this, meta);


    }

    //实例方法。
    MasterPage.prototype = {
        constructor: MasterPage,
        /**
        * 编译当前母版页。
        */
        compile: function (done) {
            var meta = mapper.get(this);

            var HtmlList = meta.HtmlList;
            var HtmlLinks = meta.HtmlLinks;
            var CssLinks = meta.CssLinks;
            var JsScripts = meta.JsScripts;
            var JsList = meta.JsList;
            var LessLinks = meta.LessLinks;
            var LessList = meta.LessList;

            var self = this;

            var name$master = meta.name$master;

            var master = File.read(meta.file);
            meta.master = master;

            //动态引用 html 
            HtmlList.reset();
            HtmlList.parse(master);
            HtmlList.get();
            HtmlList.toHtml();
            master = HtmlList.mix();
            name$master['HtmlList'] = master;

            //静态引用 html 
            HtmlLinks.reset();
            HtmlLinks.parse(master);
            master = HtmlLinks.mix();
            name$master['HtmlLinks'] = master;

            //静态引用 css 
            CssLinks.reset();
            CssLinks.parse(master);
            master = CssLinks.mix();
            name$master['CssLinks'] = master;

            //静态引用 js 
            JsScripts.reset();
            JsScripts.parse(master);
            master = JsScripts.mix();
            name$master['JsScripts'] = master;

            //动态引用 js 
            JsList.reset();
            JsList.parse(master);
            JsList.get();
            JsList.toHtml();
            master = JsList.mix();
            name$master['JsList'] = master;


            //静态引用 less
            LessLinks.reset();
            LessLinks.parse(master);
            LessLinks.get();
            LessLinks.compile(function () {
                master = LessLinks.mix();
                name$master['LessLinks'] = master;
               

                //动态引用 less 
                LessList.reset();
                LessList.parse(master);
                LessList.get();

                //检查重复引用或内容相同的文件。
                self.uniqueFiles();

                LessList.compile(function () {
                    LessList.toHtml();
                    master = LessList.mix();

                    //检查重复使用的 id。
                    self.uniqueIds(master);


                    File.write(meta.dest, master);

                    done && done();
                });

            });


            
        },

        /**
        * 根据当前各个资源引用模块生成的结果，混合成最终的 html。
        * 该方法主要给 watch() 使用。
        */
        mix: function (name) {

            var meta = mapper.get(this);
           
            var HtmlList = meta.HtmlList;
            var HtmlLinks = meta.HtmlLinks;
            var CssLinks = meta.CssLinks;
            var JsScripts = meta.JsScripts;
            var JsList = meta.JsList;
            var LessLinks = meta.LessLinks;
            var LessList = meta.LessList;

            var name$master = meta.name$master;


            //注意，下面的 switch 各分支里不能有 break 语句。
            var master = meta.master;
            
            switch (name) {

                case 'HtmlList':
                    master = HtmlList.mix(master);
                    name$master['HtmlList'] = master;

                case 'HtmlLinks':
                    master = name$master['HtmlList'];

                    //这级的重新解析不能放在上一个分支里。
                    HtmlLinks.reset();
                    HtmlLinks.parse(master);    //所在的行号可能发生了变化，要重新解析
                    HtmlLinks.watch();
                    master = HtmlLinks.mix();
                    name$master['HtmlLinks'] = master;

                    CssLinks.reset();
                    CssLinks.parse(master);     //所在的行号可能发生了变化，要重新解析

                case 'CssLinks':
                    master = name$master['HtmlLinks'];
                    master = CssLinks.mix();
                    name$master['CssLinks'] = master;

                    JsScripts.reset();
                    JsScripts.parse(master);    //所在的行号可能发生了变化，要重新解析

                case 'JsScripts':
                    master = name$master['CssLinks'];
                    master = JsScripts.mix();
                    name$master['JsScripts'] = master;

                case 'JsList':
                    master = name$master['JsScripts'];
                    master = JsList.mix(master);
                    name$master['JsList'] = master;

                    LessLinks.reset(true);      //保留之前的编译信息。
                    LessLinks.parse(master);    //所在的行号可能发生了变化，要重新解析
                    LessLinks.get();

                case 'LessLinks':
                    master = name$master['JsList'];
                    master = LessLinks.mix();
                    name$master['LessLinks'] = master;

                case 'LessList':
                    master = name$master['LessLinks'];
                    master = LessList.mix(master);
               
            }

            this.uniqueFiles();
            this.uniqueIds(master);

            File.write(meta.dest, master);
        },

        /**
        * 监控当前母版页及各个资源引用模块。
        */
        watch: function () {
            var meta = mapper.get(this);
            var watcher = meta.watcher;
            if (watcher) {
                return;
            }

            //首次创建
            var HtmlList = meta.HtmlList;
            var HtmlLinks = meta.HtmlLinks;
            var CssLinks = meta.CssLinks;
            var JsScripts = meta.JsScripts;
            var JsList = meta.JsList;
            var LessLinks = meta.LessLinks;
            var LessList = meta.LessList;

            var self = this;
            var file = meta.file;

            watcher = meta.watcher = new Watcher();
            watcher.set(file); //这里只需要添加一次
            watcher.on('changed', function () {
                self.compile();     //根节点发生变化，需要重新编译。
               
                HtmlList.watch();
                HtmlLinks.watch();
                CssLinks.watch();
                JsScripts.watch();
                JsList.watch();
                LessLinks.watch();
                LessList.watch();
            });
            
            HtmlList.watch();
            HtmlList.on('change', function () {
                self.mix('HtmlList');
            });

            HtmlLinks.watch();
            HtmlLinks.on('change', function () {
                self.mix('HtmlLinks');
            });

            CssLinks.watch();
            CssLinks.on('change', function () {
                self.mix('CssLinks');
            });

            JsScripts.watch();
            JsScripts.on('change', function () {
                self.mix('JsScripts');
            });

            JsList.watch();
            JsList.on('change', function () {
                self.mix('JsList');
            });

            LessLinks.watch();
            LessLinks.on('change', function () {
                self.mix('LessLinks');
            });


            LessList.watch();
            LessList.on('change', function () {
                self.mix('LessList');
            });

        },

        /**
        * 对 html 页面进行压缩。
        */
        minify: function (html, config) {
            //重载 minify(config)
            if (typeof html == 'object') {
                config = html;
                html = null;
            }


            var meta = mapper.get(this);
            html = html || meta.master;
            
            if (config === true) { //直接指定了为 true，则使用默认配置。
                config = meta.minifyHtml;
            }

            var Html = require('Html');
            html = Html.minify(html, config);

            return html;
        },

        /**
        * 构建当前页面。
        */
        build: function (options) {
            var done = null;
            if (typeof options == 'function') {
                done = options;
                options = null;
            }
            else {
                done = options ? options.done : null;
            }


            var self = this;
            var meta = mapper.get(this);

            var HtmlList = meta.HtmlList;
            var HtmlLinks = meta.HtmlLinks;
            var CssLinks = meta.CssLinks;
            var JsScripts = meta.JsScripts;
            var JsList = meta.JsList;
            var LessLinks = meta.LessLinks;
            var LessList = meta.LessList;

            var master = File.read(meta.file);

            //动态引用 html 
            HtmlList.reset();
            HtmlList.parse(master);
            HtmlList.get();
            HtmlList.toHtml();
            master = HtmlList.mix();

            //静态引用 html 
            HtmlLinks.reset();
            HtmlLinks.parse(master);
            master = HtmlLinks.mix(options.htmlLinks);


            //静态引用 css 
            CssLinks.reset();
            CssLinks.parse(master);
            CssLinks.minify(options.minifyCss, function () {

                master = CssLinks.mix();

                //静态引用 js 
                JsScripts.reset();
                JsScripts.parse(master);

                var minifyJs = options.minifyJs;
                if (minifyJs) {
                    JsScripts.minify(minifyJs);
                }
                

                master = JsScripts.mix();

                var inlines = options.inlines;
                if (inlines) {
                    master = JsScripts.inline(inlines);
                }

                //动态引用 js 
                JsList.reset();
                JsList.parse(master);
                JsList.get();

                var opt = options.jsList;
                if (opt && opt.concat) {
                    JsList.concat(opt.concat);

                    if (opt.minify) {
                        JsList.minify(opt.minify);
                    }

                    if (opt.inline) {
                        JsList.inline(opt.inline);
                    }
                }
                else {
                    JsList.toHtml();
                }

                master = JsList.mix();

                LessLinks.reset();
                LessLinks.parse(master);
                LessLinks.get();

                var opt = options.lessLinks;
                LessLinks.compile(opt.compile, function () {

                    master = LessLinks.mix();

                    //动态引用 less 
                    LessList.reset();
                    LessList.parse(master);
                    LessList.get();


                    //检查重复引用或内容相同的文件。
                    self.uniqueFiles();

                    var opt = options.lessList;
                    LessList.compile(opt.compile, function () {

                        if (opt.concat) {
                            LessList.concat(opt.concat);
                            LessList.minify(opt.minify, function () {
                                master = LessList.mix();
                                after();
                            });
                        }
                        else {
                            after();
                        }

                        function after() {

                            self.uniqueIds(master);

                            var minifyHtml = options.minifyHtml;
                            if (minifyHtml) {
                                master = self.minify(master, minifyHtml);
                            }

                            master = JsList.removeType(master);
                            File.write(meta.dest, master);
                            done && done();
                        }
                    });
                   
                });



            });

        },

        /**
        * 检查重复的引用或内容相同的 js 文件。
        * 必须在调用 
                CssLinks.parse();
                JsScripts.parse();
                JsList.get();
                LessLinks.get();
                LessList.get() ;
            后使用该方法。
        */
        uniqueFiles: function () {

            var meta = mapper.get(this);
            var JsScripts = meta.JsScripts;
            var JsList = meta.JsList;
            var CssLinks = meta.CssLinks;
            var LessLinks = meta.LessLinks;
            var LessList = meta.LessList;

            var stats = [
                JsList.md5(),
                CssLinks.md5(),
                JsScripts.md5(),
                LessLinks.md5(),
                LessList.md5(),
            ];

            var invalid = Verifier.files(stats);

            if (invalid) {
                console.log(('页面 ' + meta.file + ' 无法通过编译，请修正!').bgRed);
                throw new Error();
            }

        },

        /**
        * 检查重复使用的 id。
        */
        uniqueIds: function (master) {

            var meta = mapper.get(this);
            var invalid = Verifier.ids(master);

            if (invalid) {
                console.log(('页面 ' + meta.file + ' 无法通过编译，请修正!').bgRed);
                throw new Error();
            }
        },



        clean: function () {
            var meta = mapper.get(this);

            var HtmlList = meta.HtmlList;
            var HtmlLinks = meta.HtmlLinks;
            var CssLinks = meta.CssLinks;
            var JsScripts = meta.JsScripts;
            var JsList = meta.JsList;
            var LessList = meta.LessList;

       
            //HtmlLinks.delete();
            //CssLinks.delete(); 
            //JsScripts.delete(); 
            //JsList.delete();
            //LessList.delete();

            FileRefs.delete(meta.file);
        },

        /**
        * 绑定事件。
        */
        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);

            return this;
        },

        /**
        * 统计当前模板页的信息。
        */
        stat: function () {
            

        },

    };


    return MasterPage;


});






define('Tag', function (require, module, exports) {


    //自闭合标签，如 <link />
    var name$selfClosed = {
        'link': true,
        'meta': true,
    };




    /**
    * 从 html 中提取出指定名称的标签 html。
    */
    function get(html, name) {

        name = name.toLowerCase();
        

        var reg = name$selfClosed[name] ?
            '<' + name + '.*\\/>' :
            '<' + name + '[^>]*?>[\\s\\S]*?<\\/' + name + '>';

        reg = new RegExp(reg);


        var tags = html.match(reg);

        return tags || [];

    }


  


    return {
        get: get,
    };



});






define('Verifier', function (require, module, exports) {

    var $ = require('$');
    var File = require('File');
    var Lines = require('Lines');
    
    /**
    * 检查重复的文件引用。
    */
    function files(stats) {

        var file$stat = stats[0]; //总的 file$stat。

        //合并成一个 file$stat
        stats.slice(1).forEach(function (item) {

            $.Object.each(item, function (file, obj) {

                var stat = file$stat[file];
                if (stat) {
                    stat['count'] += obj['count'];
                }
                else {
                    file$stat[file] = obj;
                }
            });
        });


        var md5$files = {};

        $.Object.each(file$stat, function (file, stat) {
            var md5 = stat.md5;
            var files = md5$files[md5];

            if (!files) {
                files = md5$files[md5] = [];
            }

            files.push(file);

        });




        var file$count = {};    //重复引用同一个文件，根据文件路径识别。
        var md5$list = {};      //内容完全相同的文件，根据文件内容识别。

        $.Object.each(file$stat, function (file, stat) {
            var count = stat['count'];
            if (count > 1) {
                file$count[file] = count;
            }
        });


        $.Object.each(md5$files, function (md5, files) {
            if (files.length > 1) {
                md5$list[md5] = files;
            }
        });


        var invalid = false;

        if (Object.keys(file$count).length > 0) {
            invalid = true;
            console.log('重复引用同一个文件: '.bgRed);

            $.Object.each(file$count, function (file, count) {
                console.log('    ' + file.red + ':', count.toString().cyan, '次');
            });
        }

        if (Object.keys(md5$list).length > 0) {
            invalid = true;
            console.log('内容完全相同的文件: '.bgRed);

            $.Object.each(md5$list, function (md5, list) {
                console.log(md5.yellow, list.length.toString().cyan, '个:');
                console.log('    ' + list.join('\r\n    ').red);
            });
        }

        return invalid;
    }


    /**
    * 检查重复的 id。
    */
    function ids(html) {

        var ids = html.match(/\s+id\s*=\s*["'][\s\S]*?["']/ig);
        if (!ids) { //没有匹配到 id。
            return;
        }


        var id$stat = {};

        ids.forEach(function (item) {
            var a = item.split(/\s+id\s*=\s*/i);
            var id = a[1].slice(1, -1);

            //包含 `{` 和 `}`，可能是模板中的 id，忽略掉。
            if (id.indexOf('{') >= 0 && id.indexOf('}') > 0) {
                return;
            }

            var stat = id$stat[id];
            if (stat) {
                stat.count++;
                stat.items.push(item);

                return;
            }

            id$stat[id] = {
                'items': [item],
                'count': 1,
            };

        });


        id$stat = $.Object.grep(id$stat, function (id, stat) {
            return stat.count > 1;
        });


        if (Object.keys(id$stat).length == 0) {
            return;
        }


        console.log('使用重复的 id: '.bgRed);
        console.log('');

        var lines = Lines.get(html);


        $.Object.each(id$stat, function (id, stat) {
 
            console.log(id.red + ':', stat.count.toString().cyan, '次');

            //得到一个二维数组
            var htmls = $.Array.keep(stat.items, function (item) {

                return $.Array.grep(lines, function (line) {
                    return line.indexOf(item) >= 0;
                });
            });

            //降成一维
            htmls = $.Array.reduceDimension(htmls);

            //去重
            var obj = {};
            htmls.forEach(function (item) {
                obj[item] = true;
            });

            htmls = Object.keys(obj).map(function (item) {
                item = item.split(id).join(id.yellow);
                item = item.trim(); //为了方便显示，去掉首尾空格。

                return item;
            });

            console.log(htmls.join('\r\n'));
            console.log('');

        });
        

        return true;

    }


    return {
        'files': files,
        'ids': ids,
    };



});






/**
* 整个站点类。
*/
define('WebSite', function (require, module, exports) {

    var $ = require('$');
    var Path = require('Path');
    var File = require('File');
    var Directory = require('Directory');
    var Patterns = require('Patterns');
    
    var FileRefs = require('FileRefs');
    var MasterPage = require('MasterPage');
    var Defaults = require('Defaults');
    var Tasks = require('Tasks');

    var Watcher = require('Watcher');

    var Mapper = $.require('Mapper');
    var Emitter = $.require('Emitter');

    var Log = require('Log');
    var Url = module.require('Url');

    var mapper = new Mapper();

    var Masters = module.require('Masters');
    var Packages = module.require('Packages');

    
    function WebSite(config) {

        Mapper.setGuid(this);
        config = Defaults.clone(module.id, config);

        var meta = {
            'masters': config.masters,
            'packages': config.packages,
            'cssDir': config.cssDir,
            'htdocsDir': config.htdocsDir,
            'buildDir': config.buildDir,
            'packageDir': config.packageDir,
            'packageFile': config.packageFile,
            'url': config.url,
            'qr': config.qr,
        };

        mapper.set(this, meta);

    }



    WebSite.prototype = {

        constructor: WebSite,


        /**
        * 构建整个站点。
        */
        build: function (options, done) {
            var meta = mapper.get(this);

            var htdocsDir = meta.htdocsDir;
            var cssDir = meta.cssDir;
            var packageDir = meta.packageDir;
            var buildDir = meta.buildDir = options.dir || meta.buildDir;

            console.log('删除目录'.bgYellow, buildDir.yellow);
            Directory.delete(buildDir);

            console.log('复制目录'.bgMagenta, htdocsDir.green, '→', buildDir.cyan);
            Directory.copy
                (htdocsDir, buildDir);
          
            //先删除自动生成的目录，后续会再生成回来。
            Directory.delete(buildDir + cssDir);
            Directory.delete(buildDir + packageDir);

            var processMasters = Masters.build(meta, options.masters);
            var processPackages = meta.packages ? Packages.build(meta, options.packages) : null;


            //并行处理任务。
            Tasks.parallel({
                data: [ //任务列表。
                    processMasters,
                    processPackages,
                ],  

                each: function (task, index, done) {
                    if (task) {
                        task(done);
                    }
                    else {
                        done();
                    }
                },

                all: function () {
                    FileRefs.clean(); //删除已注册并且引用计数为 0 的物理文件。

                    //需要清理的文件或目录。
                    var clean = options.clean;
                    if (clean) {
                        var files = Patterns.getFiles(buildDir, clean);
                        File.delete(files);

                        Log.seperate();
                        console.log('清理'.bgMagenta, files.length.toString().cyan, '个文件:');
                        Log.logArray(files, 'gray');
                    }

                    //递归删除空目录
                    Directory.trim(buildDir);
                    Log.allDone('全部构建完成');
                    done && done();
                },

            });

        },




        /**
        * 编译整个站点，完成后开启监控。
        */
        watch: function (done) {

            var meta = mapper.get(this);
            var packageDir = meta.htdocsDir + meta.packageDir;

            console.log(packageDir);

            //先清空，避免使用者意外用到。
            Directory.delete(packageDir);
            
            //这里要先创建 package 目录，否则 watcher 会出错，暂未找到根本原因。
            Directory.create(packageDir);

            var processMasters = Masters.watch(meta);
            var processPackages = meta.packages ? Packages.watch(meta) : null;

            //并行处理任务。
            Tasks.parallel({
                data: [ //任务列表。
                    processMasters,
                    processPackages,
                ],

                each: function (task, index, done) {
                    if (task) {
                        task(done);
                    }
                    else {
                        done();
                    }
                },

                all: function () {
                    Log.allDone('全部编译完成');
                    Watcher.log();
                    done && done();
                },

            });
        },



        /**
        * 统计整个站点信息。
        */
        stat: function () {
            var meta = mapper.get(this);
            var htdocsDir = meta.htdocsDir;


            var all = {};
            var file$md5 = {};
            var md5$files = {};

            var MD5 = require('MD5');
            var Patterns = require('Patterns');

            var files = Directory.getFiles(htdocsDir);

            files.forEach(function (file) {
                
                var md5 = MD5.read(file);
                file$md5[file] = md5;

                var files = md5$files[md5];
                if (!files) {
                    files = md5$files[md5] = [];
                }

                files.push(file);
            });

    
            File.writeJSON('file$md5.json', file$md5);
            File.writeJSON('md5$files.json', md5$files);




            return;
            

            var patterns = Patterns.combine(htdocsDir, ['**/*.js']);
            var jsFiles = Patterns.match(patterns, files);

            //console.log(jsFiles);


            var patterns = Patterns.combine(htdocsDir, ['**/*.less']);
            var lessFiles = Patterns.match(patterns, files);
            console.log(lessFiles);


            var patterns = Patterns.combine(htdocsDir, ['**/*.master.html']);
            var masterFiles = Patterns.match(patterns, files);
            console.log(masterFiles);


        },

        /**
        * 打开站点页面。
        * @param
        */
        open: function (options) {
   
            var meta = mapper.get(this);

            options = $.Object.extend({}, options, {
                'tips': '打开页面',
                'sample': meta.url,
                'dir': options.dir || meta.htdocsDir,
            });

            Url.open(options);
        },


        openQR: function (options) {

            options = options || {};


            var meta = mapper.get(this);

            var url = Url.get({
                'sample': meta.url,
                'dir': options.dir || meta.htdocsDir,
                'query': options.query,
                'host': options.host,
            });

            var qr = meta.qr;

            options = $.Object.extend({}, options, {
                'sample': qr.url,
                'query': {
                    'w': options.width || qr.width,
                    'text': url,
                },
            });

            console.log('打开二维码'.bgGreen, url.cyan);

            Url.open(options);
        },

    };


    return WebSite;


});






/**
* 
*/
define('WebSite/Masters', function (require, module, exports) {

    var $ = require('$');
    var Path = require('Path');
    var File = require('File');
    var Patterns = require('Patterns');
    
    var MasterPage = require('MasterPage');
    var Tasks = require('Tasks');
    var JS = require('JS');
    var Log = require('Log');




    return {


        /**
        * 构建所有模板页。
        */
        build: function (meta, options) {

            //处理模板页。
            return function (done) {

                var masters = meta.masters;
                var cssDir = meta.cssDir;
                var buildDir = meta.buildDir;


                //从模式中获取真实的 master 文件列表。
                masters = Patterns.getFiles(buildDir, masters);
                console.log('匹配到'.bgGreen, masters.length.toString().cyan, '个模板页:');
                Log.logArray(masters);


                //单独处理需要替换的文件，如 config.js。
                var inlines = []; //记录需要内联的文件。
                var process = options.process || {};

                Object.keys(process).forEach(function (pattern) {

                    var item = process[pattern];

                    var files = Patterns.combine(buildDir, pattern);
                    files = Patterns.getFiles(files);

                    if (typeof item == 'function') {  //针对 item 为一个回调函数时。
                        files.forEach(function (file) {
                            var content = File.read(file);

                            var href = Path.relative(buildDir, file);
                            content = item(href, content, require);

                            if (content == null) {
                                File.delete(file);
                            }
                            else {
                                File.write(file, content, null);
                            }
                        });
                    }
                    else {  //针对 item 为一个对象时。
                        files.forEach(function (file) {
                            if (item.minify) {
                                var content = File.read(file);
                                JS.minify(content, {
                                    'dest': file,
                                });
                            }

                            var inline = item.inline;
                            if (inline == 'auto') { //当指定为 auto 时，则根据 master 页的个数决定是否内联。
                                inline = masters.length == 1;
                            }

                            var deleted = item.delete;
                            if (deleted == 'auto') { //当指定为 auto 时，则根据 inline 决定是否删除。
                                deleted = inline;
                            }

                            if (inline) {
                                inlines.push({
                                    'file': file,
                                    'delete': deleted,
                                });
                            }
                        });
                    }

                });



                //短路径补全
                var jsList = options.jsList;
                if (jsList) {
                    var opt = jsList.concat;

                    if (opt) {
                        var header = opt.header;
                        var footer = opt.footer;
                        var addPath = opt.addPath;

                        if (header) {
                            opt.header = Path.join(buildDir, header);
                        }
                        if (footer) {
                            opt.footer = Path.join(buildDir, footer);
                        }
                        if (addPath === true) {
                            opt.addPath = buildDir; //添加文件路径的注释所使用的相对路径。
                        }

                    }
                }


                Tasks.parallel({
                    data: masters,

                    each: function (file, index, done) {
                        Log.seperate();
                        console.log('>> 开始构建'.cyan, file);

                        var href = Path.relative(buildDir, file);

                        var master = new MasterPage(href, {
                            'htdocsDir': buildDir,
                            'cssDir': cssDir,
                        });

                        master.build({
                            'inlines': inlines,
                            'minifyHtml': options.minifyHtml,
                            'minifyCss': options.minifyCss,
                            'minifyJs': options.minifyJs,
                            'jsList': options.jsList,
                            'lessLinks': options.lessLinks,
                            'lessList': options.lessList,
                            'htmlLinks': options.htmlLinks,

                            'done': function () {
                                console.log('<< 完成构建'.green, file);
                                done(master);
                            },
                        });
                    },

                    all: function (masters) {
                        //console.log('>> 开始执行清理操作...'.yellow);
                        masters.forEach(function (master) {
                            master.clean();
                        });

                        done && done(); //完成当前任务。
                    },

                });

            };

        },



        /**
        * 编译所有模板页，完成后开启监控。
        */
        watch: function (meta) {

            //处理模板页。
            return function (done) {

                var masters = meta.masters;
                var htdocsDir = meta.htdocsDir;
                var cssDir = meta.cssDir;

                //从模式中获取真实的文件列表
                masters = Patterns.getFiles(htdocsDir, masters);
                console.log('匹配到'.bgGreen, masters.length.toString().cyan, '个模板页:');
                Log.logArray(masters);

                Tasks.parallel({
                    data: masters,
                    each: function (file, index, done) {

                        Log.seperate();
                        console.log('>> 开始编译'.cyan, file);

                        var href = Path.relative(htdocsDir, file);
                        var master = new MasterPage(href, {
                            'htdocsDir': htdocsDir,
                            'cssDir': cssDir,
                        });

                        master.compile(function () {
                            console.log('<< 完成编译'.green, file);
                            master.watch();
                            done();
                        });
                    },

                    all: function () {  //已全部完成
                        done && done();
                    },
                });
            };


        },



    };




});







define('WebSite/Packages', function (require, module, exports) {

    var $ = require('$');
    var Path = require('Path');
    var Patterns = require('Patterns');
    
    var Package = require('Package');
    var Tasks = require('Tasks');
    var Log = require('Log');



    return {

        /**
        * 构建所有的包文件
        */
        build: function (meta, options) {

            //处理打包。
            return function (done) {

                var packages = meta.packages;
                var cssDir = meta.cssDir;
                var packageDir = meta.packageDir;
                var packageFile = meta.packageFile;
                var buildDir = meta.buildDir;

                //从模式中获取真实的 package.json 文件列表。
                packages = Patterns.getFiles(buildDir, packages);

                var count = packages.length;
                if (count == 0) {
                    done && done();
                    return;
                }

                console.log('匹配到'.bgGreen, count.toString().cyan, '个包文件:');
                Log.logArray(packages, 'magenta');


                //短路径补全
                var opt = (options.compile || {}).js;
                if (opt) {
         
                    var header = opt.header;
                    var footer = opt.footer;
                    var addPath = opt.addPath;

                    if (header) {
                        opt.header = Path.join(buildDir, header);
                    }
                    if (footer) {
                        opt.footer = Path.join(buildDir, footer);
                    }
                    if (addPath === true) {
                        opt.addPath = buildDir; //添加文件路径的注释所使用的相对路径。
                    }
                }


                Tasks.parallel({
                    data: packages,

                    each: function (file, index, done) {
                        Log.seperate();
                        console.log('>> 开始打包'.cyan, file);

                        var href = Path.relative(buildDir, file);

                        var pkg = new Package(href, {
                            'htdocsDir': buildDir,
                            'cssDir': cssDir,
                            'packageDir': packageDir,
                        });

                        pkg.build(options, function () {
                            console.log('<< 完成打包'.green, file);
                            done(pkg);
                        });
                    },

                    all: function (pkgs) {

                        
                        //删除源分 package.json 文件。
                        var opt = (options.compile || {}).json;
                        if (opt.delete) {
                            pkgs.forEach(function (pkg) {
                                pkg.clean();
                            });
                        }


                        var opt = (options.minify || {}).json;
                        if (opt.write) {
                            var dest = Path.join(buildDir, packageFile);
                            Package.write(dest, pkgs, opt.minify);      //写入到总包

                            done && done();
                        }
                        
                    },
                });
            };

        },



        /**
        * 编译所有包文件，完成后开启监控。
        */
        watch: function (meta) {
            //处理打包。
            return function (done) {
                var packages = meta.packages;
                var cssDir = meta.cssDir;
                var packageDir = meta.packageDir;
                var packageFile = meta.packageFile;
                var htdocsDir = meta.htdocsDir;

                //从模式中获取真实的 package.json 文件列表。
                packages = Patterns.getFiles(htdocsDir, packages);
                var count = packages.length;
                if (count == 0) {
                    done && done();
                    return;
                }

                console.log('匹配到'.bgGreen, count.toString().cyan, '个包文件:');
                Log.logArray(packages, 'magenta');


                var dest = Path.join(htdocsDir, packageFile);

                function write(pkgs) {
                    if (!Array.isArray(pkgs)) {
                        pkgs = [pkgs];
                    }

                    Package.write(dest, pkgs); //写入到总包
                }


                Tasks.parallel({
                    data: packages,
                    each: function (file, index, done) {

                        Log.seperate();
                        console.log('>> 开始打包'.cyan, file);

                        var href = Path.relative(htdocsDir, file);

                        var pkg = new Package(href, {
                            'htdocsDir': htdocsDir,
                            'cssDir': cssDir,
                            'packageDir': packageDir,
                        });

                        //更新 md5 的 query 部分。
                        pkg.on('change', function () {
                            write(pkg);
                        });

                        pkg.parse();

                        pkg.compile(function () {
                            console.log('<< 完成打包'.green, file);
                            pkg.watch();
                            done(pkg);
                        });
                    },

                    all: function (pkgs) {  //已全部完成
                        write(pkgs);
                        done && done();
                    },
                    
                });
                
            };


        },


        /**
        *
        */

    };

});






define('WebSite/Url', function (require, module, exports) {

    var $ = require('$');
   

    function getHost() {

        var os = require('os');
        var name$list = os.networkInterfaces();
        var all = [];

        for (var name in name$list) {
            var list = name$list[name];
            all = all.concat(list);
        }

        var item = all.find(function (item, index) {
            return !item.internal &&
                item.family == 'IPv4' &&
                item.address !== '127.0.0.1'
        });

        return item ? item.address : '';

    }


    function getDir(dir) {
        var path = require('path');
        var cwd = process.cwd();

        dir = path.join(cwd, dir);
        dir = dir.split('\\').join('/');
        dir = dir.split(':/')[1];

        return dir;
    }

    function getQuery(query) {

        if (typeof query == 'object') {
            query = $.Object.toQueryString(query);
        }

        query = '?' + query;
        return query;
    }


    function getUrl(options) {

        var host = options.host;
        var dir = options.dir;
        var query = options.query;
        var sample = options.sample;

        var url = $.String.format(sample, {
            'host': host || getHost(),
            'dir': dir ? getDir(dir) : '',
            'query': query ? getQuery(query) : '',
        });


        return url;

    }


    function open(options) {

        var child = require('child_process')
        var url = getUrl(options);
        var tips = options.tips;

        if (tips) {
            console.log(tips.bgGreen, url.cyan);
        }

        url = url.split('&').join('^&'); //用于命令行中的 & 必须转义为 ^&
        child.exec('start ' + url);
    }



    return {
        'open': open,
        'get': getUrl,
    };

});






/**
* 
*/
define('HtmlPackage', function (require, module, exports) {

    var $ = require('$');
    var File = require('File');
    var FileRefs = require('FileRefs');
    var Path = require('Path');
    var Patterns = require('Patterns');
    var Watcher = require('Watcher');
    var Defaults = require('Defaults');
    var HtmlLinks = require('HtmlLinks');
    var MD5 = require('MD5');

    var Mapper = $.require('Mapper');
    var Emitter = $.require('Emitter');
    

    var mapper = new Mapper();



    function HtmlPackage(dir, config) {


        Mapper.setGuid(this);
        config = Defaults.clone(module.id, config);
        var emitter = new Emitter(this);


        var meta = {
            'dir': dir,                 //母版页所在的目录。
            'patterns': [],             //模式列表。
            'list': [],                 //真实 html 文件列表及其它信息。
            'html': '',                 //编译后的  html 内容。
            'minify': config.minify,    //
            'watcher': null,            //监控器，首次用到时再创建。
            'emitter': emitter,
        };

        mapper.set(this, meta);

    }



    HtmlPackage.prototype = {
        constructor: HtmlPackage,


        /**
        * 重置为初始状态，即创建时的状态。
        */
        reset: function () {

            var meta = mapper.get(this);

            //删除之前的文件引用计数
            meta.list.forEach(function (item) {
                FileRefs.delete(item.file);
                item.HtmlLinks.destroy();
            });

            $.Object.extend(meta, {
                'patterns': [],     //模式列表。
                'list': [],         //真实 html 文件列表及其它信息。
                'html': '',         //编译后的  html 内容。
            });

        },

        /**
        * 根据当前模式获取对应真实的 html 文件列表。
        */
        get: function (patterns) {
            var meta = mapper.get(this);
            var dir = meta.dir;

            patterns = meta.patterns = Patterns.combine(dir, patterns);

            var list = Patterns.getFiles(patterns);

            list = list.map(function (file, index) {

                file = Path.format(file);
                FileRefs.add(file);

                return {
                    'file': file,
                    'html': '',                         //编译后产生的 html 内容。
                    'HtmlLinks': new HtmlLinks(dir),    //对应的 HtmlLinks 实例。
                };

            });

            meta.list = list;

        },


        /**
        * 编译当前母版页。
        */
        compile: function (dest) {
            var meta = mapper.get(this);
            var list = meta.list;
            var htmls = [];

            list.forEach(function (item) {

                var html = item.html;

                if (!html) {
                    var file = item.file;
                    var HtmlLinks = item.HtmlLinks;

                    html = File.read(file);

                    HtmlLinks.reset();
                    HtmlLinks.parse(html);
                    html = HtmlLinks.mix();

                    item.html = html;
                }

                htmls.push(html);

            });

            var html = meta.html = htmls.join('');
            if (dest) {
                File.write(dest, html);
            }

            var md5 = MD5.get(html);
            return md5;

        },

        /**
        * 对 html 进行压缩。
        */
        minify: function (options, dest) {
            var Html = require('Html');

            var meta = mapper.get(this);
            var html = meta.html;

            html = Html.minify(html, options);
      
            if (typeof dest == 'object') {
                var name = dest.name;

                if (typeof name == 'number') {
                    name = MD5.get(html, name);
                    name += '.html';
                }

                dest = dest.dir + name;
            }

            File.write(dest, html);

            return dest;
        },

        /**
        * 删除引用列表中所对应的 html 物理文件。
        */
        delete: function () {
            var meta = mapper.get(this);
            var list = meta.list;

            list.forEach(function (item) {
                FileRefs.delete(item.file);
                item.HtmlLinks.delete(); //递归删除下级的
            });

        },



        /**
        * 监控当前模式下 html 文件的变化。
        */
        watch: function () {
            var meta = mapper.get(this);
            var patterns = meta.patterns;
            if (patterns.length == 0) { //列表为空，不需要监控
                return;
            }

            var emitter = meta.emitter;
            var watcher = meta.watcher;
       

            if (!watcher) { //首次创建

                watcher = meta.watcher = new Watcher();
                var self = this;

                function add(files) {

                    var dir = meta.dir;

                    //增加到列表
                    var list = files.map(function (file, index) {
                        file = Path.format(file);
                        FileRefs.add(file);

                        return {
                            'file': file,
                            'html': '',   //编译后产生的 html 内容。
                            'HtmlLinks': new HtmlLinks(dir), //对应的 HtmlLinks 实例。
                        };
                    });

                    meta.list = meta.list.concat(list);
                }


                watcher.on({
                    'added': function (files) {
                        add(files);
                        emitter.fire('change');
                    },

                    'deleted': function (files) {

                        //从列表中删除
                        var obj = {};
                        files.forEach(function (file) {
                            FileRefs.delete(file, true);
                            obj[file] = true;
                        });

                        meta.list = meta.list.filter(function (item) {
                            var file = item.file;
                            return !obj[file];
                        });

                        emitter.fire('change');
                    },

                    //重命名的，会先后触发 deleted 和 renamed
                    'renamed': function (files) {
                        add(files);
                        emitter.fire('change');
                    },

                    'changed': function (files) {
                        var obj = {};
                        files.forEach(function (file) {
                            obj[file] = true;
                        });

                        meta.list.forEach(function (item) {
                            var file = item.file;
                            if (obj[file]) {
                                item.html = '';
                            }

                        });

                        emitter.fire('change');
                    },

                });

                watcher.set(patterns);
            }

            //下级节点
            meta.list.forEach(function (item) {
                var HtmlLinks = item.HtmlLinks;
                HtmlLinks.watch();

                HtmlLinks.on('change', function () {
                    item.html = ''; //让之前编译的内容作废
                    emitter.fire('change');
                });

            });
        },

        /**
        * 取消监控。
        */
        unwatch: function () {
            var meta = mapper.get(this);
            var watcher = meta.watcher;
            if (watcher) {
                watcher.close();
            }
        },

        /**
        * 绑定事件。
        */
        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);

        },

    };



    return $.Object.extend(HtmlPackage, {

       
    });



});






/**
* 动态 JS 资源文件列表。
*/
define('JsPackage', function (require, module, exports) {

    var $ = require('$');
    var File = require('File');
    var FileRefs = require('FileRefs');
    var Path = require('Path');
    var Patterns = require('Patterns');
    var Watcher = require('Watcher');
    var Defaults = require('Defaults');
    var MD5 = require('MD5');

    var Mapper = $.require('Mapper');
    var Emitter = $.require('Emitter');
    


    var mapper = new Mapper();




    function JsPackage(dir, config) {


        Mapper.setGuid(this);
        config = Defaults.clone(module.id, config);

        var meta = {

            'dir': dir,
            'patterns': [],     //模式列表。
            'list': [],         //真实 js 文件列表及其它信息。
            'content': '',      //编译后的 js 内容。
            'emitter': new Emitter(this),
            'watcher': null,                //监控器，首次用到时再创建。



        };

        mapper.set(this, meta);

    }



    JsPackage.prototype = {
        constructor: JsPackage,

        /**
        * 重置为初始状态，即创建时的状态。
        */
        reset: function () {

            var meta = mapper.get(this);

            //删除之前的文件引用计数
            meta.list.forEach(function (item) {
                FileRefs.delete(item.file);         
            });


            $.Object.extend(meta, {
                'master': '',       //母版页的内容，在 parse() 中用到。
                'html': '',         //模式所生成的 html 块，即缓存 toHtml() 方法中的返回结果。
                'outer': '',        //包括开始标记和结束标记在内的原始的整一块 html。
                'patterns': [],     //模式列表。
                'list': [],         //真实 js 文件列表及其它信息。
                'content': '',      //编译后的 js 内容。
            });

        },

        /**
        * 根据当前模式获取对应真实的 js 文件列表。
        */
        get: function (patterns) {
            var meta = mapper.get(this);
            var dir = meta.dir;

            patterns = meta.patterns = Patterns.combine(dir, patterns);

            var list = Patterns.getFiles(patterns);

            list = list.map(function (file, index) {

                file = Path.format(file);
                FileRefs.add(file);

                return file;

            });

            meta.list = list;

        },


        /**
        * 合并对应的 js 文件列表。
        */
        concat: function (options) {

            var meta = mapper.get(this);
            var list = meta.list;
            if (list.length == 0) {
                meta.content = '';
                return;
            }

            //加上文件头部和尾部，形成闭包
            var header = options.header;
            if (header) {
                header = Path.format(header);
                FileRefs.add(header);
                list = [header].concat(list);
            }

            var footer = options.footer;
            if (footer) {
                footer = Path.format(footer);
                FileRefs.add(footer);
                list = list.concat(footer);
            }

            var JS = require('JS');
            var content = meta.content = JS.concat(list, options);
            var md5 = MD5.get(content);

            return md5;

        },

        /**
        * 压缩合并后的 js 文件。
        */
        minify: function (dest) {

            var meta = mapper.get(this);
            var content = meta.content;
            var JS = require('JS');

            //直接从内容压缩，不读取文件
            content = meta.content = JS.minify(content);

            if (typeof dest == 'object') {
                var name = dest.name;
                if (typeof name == 'number') {
                    name = MD5.get(content, name);
                    name += '.js';
                }

                dest = dest.dir + name;
                File.write(dest, content); //写入合并后的 js 文件
            }

            return dest;
        },



        /**
        * 监控当前模式下 js 文件的变化。
        */
        watch: function () {
            var meta = mapper.get(this);
            var patterns = meta.patterns;
            if (patterns.length == 0) { //列表为空，不需要监控
                return;
            }

            var watcher = meta.watcher;

            if (!watcher) { //首次创建
               
                watcher = meta.watcher = new Watcher();

                var self = this;
                var emitter = meta.emitter;

                function add(files) {

                    //增加到列表
                    var list = files.map(function (file, index) {
                        file = Path.format(file);
                        FileRefs.add(file);
                        return file;
                    });

                    meta.list = meta.list.concat(list);
                }



                watcher.on({
                    'added': function (files) {
                        add(files);
                        emitter.fire('change');
                    },

                    'deleted': function (files) {
                        //从列表中删除
                        var obj = {};
                        files.forEach(function (file) {
                            FileRefs.delete(file, true);
                            obj[file] = true;
                        });

                        meta.list = meta.list.filter(function (file) {
                            return !obj[file];
                        });

                        emitter.fire('change');
                    },

                    //重命名的，会先后触发 deleted 和 renamed
                    'renamed': function (files) {
                        add(files);
                        emitter.fire('change');
                    },

                    'changed': function (files) {
                        emitter.fire('change');
                    },

                });
                
            }


            watcher.set(patterns);

        },


        /**
        * 取消监控。
        */
        unwatch: function () {
            var meta = mapper.get(this);
            var watcher = meta.watcher;
            if (watcher) {
                watcher.close();
            }
        },


        /**
        * 删除模式列表中所对应的 js 物理文件。
        */
        delete: function () {
            var meta = mapper.get(this);

            meta.list.forEach(function (item) {
                FileRefs.delete(item.file);
            });
        },

        /**
        * 绑定事件。
        */
        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);
        },

       

    };


    return $.Object.extend(JsPackage, {

       
    });



});






/**
* 动态 Less 资源文件列表。
*/
define('LessPackage', function (require, module, exports) {

    var $ = require('$');
    var File = require('File');
    var FileRefs = require('FileRefs');
    var Watcher = require('Watcher');
    var MD5 = require('MD5');
    var Path = require('Path');
    var Patterns = require('Patterns');
    var Defaults = require('Defaults');
    var MD5 = require('MD5');

    var Mapper = $.require('Mapper');
    var Emitter = $.require('Emitter');

   

    var mapper = new Mapper();



    function LessPackage(dir, config) {


        Mapper.setGuid(this);
        config = Defaults.clone(module.id, config);


        var meta = {
            'dir': dir,         //母版页所在的目录。
            'patterns': [],     //模式列表。
            'list': [],         //真实 less 文件列表。
            'less$item': {},    //less 文件所对应的信息
            'content': '',      //合并后或压缩后的内容。

            'emitter': new Emitter(this),
            'watcher': null,    //监控器，首次用到时再创建

        };

        mapper.set(this, meta);

    }



    LessPackage.prototype = {
        constructor: LessPackage,

        /**
        * 重置为初始状态，即创建时的状态。
        */
        reset: function () {
            var meta = mapper.get(this);
            var less$item = meta.less$item;

            meta.list.forEach(function (less) {
                var item = less$item[less];
                FileRefs.delete(less);
            });


            $.Object.extend(meta, {
                'patterns': [],     //模式列表。
                'list': [],         //真实 less 文件列表。
                'less$item': {},    //less 文件所对应的信息
            });
        },


        /**
        * 根据当前模式获取对应真实的 less 文件列表和将要产生 css 文件列表。
        */
        get: function (patterns) {
            var meta = mapper.get(this);
            var less$item = meta.less$item;

            patterns = meta.patterns = Patterns.combine(meta.dir, patterns);

            var list = Patterns.getFiles(patterns);

            list.forEach(function (less) {
                //如 less = '../htdocs/html/test/style/less/index.less';

                if (less$item[less]) { //已处理过该项，针对 watch() 中的频繁调用。
                    return;
                }

                less$item[less] = {
                    'content': '',  //编译后的 css 内容。
                    'md5': '',      //编译后的 css 内容对应的 md5 值，需要用到时再去计算。
                };

                FileRefs.add(less);

            });

            meta.list = list;
        },


        /**
        * 编译 less 文件列表(异步模式)。
        * 如果指定了要编译的列表，则无条件进行编译。
        * 否则，从原有的列表中过滤出尚未编译过的文件进行编译。
        * 已重载:
            compile(list, fn);
            compile(list, options);
            compile(list);
            compile(fn);
            compile(options);
            compile(options, fn);
        * @param {Array} [list] 经编译的 less 文件列表。 
            如果指定了具体的 less 文件列表，则必须为当前文件引用模式下的子集。 
            如果不指定，则使用原来已经解析出来的文件列表。
            提供了参数 list，主要是在 watch() 中用到。
        */
        compile: function (list, options) {
            var fn = null;
            if (list instanceof Array) {
                if (typeof options == 'function') { //重载 compile(list, fn);
                    fn = options;
                    options = null;
                }
                else if (typeof options == 'object') { //重载 compile(list, options);
                    fn = options.done;
                }
                else { //重载 compile(list);
                    options = null;
                }
            }
            else if (typeof list == 'function') { //重载 compile(fn);
                fn = list;
                list = null;
            }
            else if (typeof list == 'object') { //重载 compile(options); 或 compile(options, fn)
                fn = options;
                options = list;
                list = null;
                fn = fn || options.done;
            }


            options = options || {  //这个默认值不能删除，供开发时 watch 使用。
                'delete': false,    //删除 less，仅提供给上层业务 build 时使用。
            };


            var Less = require('Less');
            var meta = mapper.get(this);
            var less$item = meta.less$item;

            var force = !!list;         //是否强制编译
            list = list || meta.list;

            if (list.length == 0) { //没有 less 文件
                fn && fn();
                return;
            }



            //并行地发起异步的 less 编译
            var Tasks = require('Tasks');
            Tasks.parallel({
                data: list,
                each: function (less, index, done) {
                    var item = less$item[less];

                    //没有指定强制编译，并且该文件已经编译过了，则跳过。
                    if (!force && item.content) {
                        done();
                        return;
                    }

                    Less.compile({
                        'src': less,
                        'delete': options.delete,
                        'compress': false,
                        'done': function (css) {
                            item.content = css;
                            done();
                        },
                    });

                },
                all: function () {
                    //已全部完成
                    fn && fn();
                },
            });
        },

        /**
        * 合并对应的 css 文件列表。
        */
        concat: function (dest) {

            var meta = mapper.get(this);
            var list = meta.list;
            if (list.length == 0) { //没有 less 文件
                return;
            }

            var less$item = meta.less$item;
            var contents = [];

            list.forEach(function (less) {
                var item = less$item[less];
                contents.push(item.content);
            });

            var content = meta.content = contents.join('');


            if (dest) {
                File.write(dest, content); //写入合并后的 css 文件
            }

            var md5 = MD5.get(content);

            return md5;
        },

        /**
        * 压缩合并后的 css 文件。
        */
        minify: function (dest, done) {

            var meta = mapper.get(this);
            var content = meta.content;
            var Less = require('Less');

            
            
            Less.minify(content, function (css) {

                if (typeof dest == 'object') {
                    var name = dest.name;

                    if (typeof name == 'number') {
                        name = MD5.get(css, name);
                        name += '.css';
                    }

                    dest = dest.dir + name;
                }

                File.write(dest, css);

                done && done(dest, css);
            });

        },

        /**
        * 监控当前模式下的所有 less 文件。
        */
        watch: function () {
            var meta = mapper.get(this);
            var patterns = meta.patterns;

            if (patterns.length == 0) { //列表为空，不需要监控
                return;
            }

            var watcher = meta.watcher;
            if (!watcher) { //首次创建
                
                watcher = meta.watcher = new Watcher();

                var self = this;
                var less$item = meta.less$item;
                var emitter = meta.emitter;


                watcher.on({
                    'added': function (files) {
                        self.get();
                        self.compile(files, function () {
                            emitter.fire('change');
                        });
                        
                    },

                    'deleted': function (files) {

                        //删除对应的记录
                        files.forEach(function (less) {
                            var item = less$item[less];
                            delete less$item[less];

                            FileRefs.delete(less, true);
                        });

                        self.get();

                        emitter.fire('change');
                    },

                    //重命名的，会分别触发：deleted 和 renamed
                    'renamed': function (files) {
                        self.get();
                        self.compile(files, function () {
                            emitter.fire('change');
                        });
                        
                    },

                    'changed': function (files) {

                        //让对应的记录作废
                        files.forEach(function (less) {
                            var item = less$item[less];
                            item.md5 = '';
                            item.content = '';
                        });

                        self.compile(files, function () {
                            emitter.fire('change');
                        });
                    },

                });
            }

            watcher.set(patterns);
        },


        /**
        * 取消监控。
        */
        unwatch: function () {
            var meta = mapper.get(this);
            var watcher = meta.watcher;
            if (watcher) {
                watcher.close();
            }
        },

        /**
        * 绑定事件。
        */
        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);
        },

        

    };



    return LessPackage;



});






/**
* 私有包。
*/
define('Package', function (require, module, exports) {

    var $ = require('$');
    var path = require('path');

    var File = require('File');
    var FileRefs = require('FileRefs');
    var Path = require('Path');
    var Watcher = require('Watcher');
    var Defaults = require('Defaults');
    var Lines = require('Lines');
    var Url = require('Url');
    var Patterns = require('Patterns');
    var Log = require('Log');

    var Mapper = $.require('Mapper');
    var Emitter = $.require('Emitter');
    
    var HtmlPackage = require('HtmlPackage');
    var JsPackage = require('JsPackage');
    var LessPackage = require('LessPackage');

    var mapper = new Mapper();
    var name$file = {};         //记录包的名称与文件名的对应关系，防止出现重名的包。



    function Package(file, config) {

        Mapper.setGuid(this);
        config = Defaults.clone(module.id, config);

        var htdocsDir = config.htdocsDir;
        file = Path.join(htdocsDir, file);

        var dir = Path.dirname(file); //分包 package.json 文件所在的目录

        var meta = {
            'dir': dir, 
            'file': file,

            'htdocsDir': htdocsDir,
            'packageDir': config.packageDir,
            'cssDir': config.cssDir,
            'compile': config.compile,
            'minify': config.minify,
            'md5': config.md5,


            'emitter': new Emitter(this),
            'watcher': null, //监控器，首次用到时再创建

            'old': {},      //用来存放旧的 HtmlPackage、JsPackage 和 LessPackage。

            'HtmlPackage': null,
            'JsPackage': null,
            'LessPackage': null,

            'css': '',
            'html': '',
            'js': '',
        };

        mapper.set(this, meta);
    }



    Package.prototype = {
        constructor: Package,

        /**
        * 重置上一次可能存在的结果。
        */
        reset: function () {
            var meta = mapper.get(this);
            var old = meta.old;

            //先备份。 old 中的一旦有值，将再也不会变为 null。
            old.HtmlPackage = meta.HtmlPackage;
            old.JsPackage = meta.JsPackage;
            old.LessPackage = meta.LessPackage;

            //再清空。
            $.Object.extend(meta, {
                'HtmlPackage': null,
                'JsPackage': null,
                'LessPackage': null,

                'css': '',
                'html': '',
                'js': '',
            });
        },

        /**
        * 
        */
        parse: function () {
            var meta = mapper.get(this);
            var file = meta.file;
            var dir = meta.dir;
            var htdocsDir = meta.htdocsDir;
 
            var json = File.readJSON(file);
            var name = json.name;

            //如果未指定 name，则以包文件所在的目录的第一个 js 文件名作为 name。
            if (!name) {
                var files = Patterns.getFiles(dir, '*.js');
                name = files[0];
                if (!name) {
                    console.log('包文件'.bgRed, file.yellow, '中未指定 name 字段，且未在其的所在目录找到任何 js 文件。'.bgRed);
                    throw new Error();
                }
                name = Path.relative(dir, name);
                name = name.slice(0, -3); //去掉 `.js` 后缀。
            }
            else if (name == '*') {
                name = Path.relative(htdocsDir, dir);
                name = name.split('/').join('.');
            }

            var oldFile = name$file[name];
            if (oldFile && oldFile != file) {
                console.log('存在同名'.bgRed, name.green, '的包文件:'.bgRed);
                Log.logArray([oldFile, file], 'yellow');
                throw new Error();
            }

            name$file[name] = file;
            meta.name = name;

            var old = meta.old;
            var packageDir = htdocsDir + meta.packageDir;

            if (json.html) {
                meta.HtmlPackage = old.HtmlPackage || new HtmlPackage(dir);
                meta.html = {
                    'src': json.html,
                    'dir': packageDir,
                    'dest': packageDir + name + '.html',
                    'md5': '',
                };
            }

            if (json.js) {
                meta.JsPackage = old.JsPackage || new JsPackage(dir);
                meta.js = {
                    'src': json.js,
                    'dir': packageDir,
                    'dest': packageDir + name + '.js',
                    'md5': '',
                };
            }

            if (json.css) {
                var cssDir = htdocsDir + meta.cssDir;
                meta.LessPackage = old.LessPackage || new LessPackage(dir);
                meta.css = {
                    'src': json.css,
                    'dir': cssDir,
                    'dest': cssDir + name + '.css',
                    'md5': '',
                };
            }

        },
        
        /**
        * 编译当前包文件。
        */
        compile: function (options, done) {

            //重载 compile(done)
            if (typeof options == 'function') {
                done = options;
                options = null;
            }

            var meta = mapper.get(this);
            var HtmlPackage = meta.HtmlPackage;
            var JsPackage = meta.JsPackage;
            var LessPackage = meta.LessPackage;


            options = options || meta.compile;

            if (HtmlPackage) {
                var file = options.html.write ? meta.html.dest : '';

                HtmlPackage.reset();
                HtmlPackage.get(meta.html.src);

                meta.html.md5 = HtmlPackage.compile(file);

                if (options.html.delete) {
                    HtmlPackage.delete();
                }
            }
           

            if (JsPackage) {
                var js = options.js;
                js.dest = js.write ? meta.js.dest : '';

                JsPackage.reset();
                JsPackage.get(meta.js.src);
                meta.js.md5 = JsPackage.concat(js);
            }
            

            if (LessPackage) {
                var less = options.less;
                var opt = { delete: less.delete };

                LessPackage.reset();
                LessPackage.get(meta.css.src);

                LessPackage.compile(opt, function () {

                    var css = less.write ? meta.css.dest : '';
                    meta.css.md5 = LessPackage.concat(css);

                    done && done();
                });
            }
            else {
                done && done();
            }
           
        },

        /**
        * 压缩。
        */
        minify: function (options, done) {
            //重载 minify(done)
            if (typeof options == 'function') {
                done = options;
                options = null;
            }

            var meta = mapper.get(this);
            var dest = meta.dest;
            var HtmlPackage = meta.HtmlPackage;
            var JsPackage = meta.JsPackage;
            var LessPackage = meta.LessPackage;


            options = options || meta.minify;

            if (HtmlPackage) {
                var opt = options.html;
                if (opt) {
                    if (opt === true) { //当指定为 true 时，则使用默认的压缩选项。
                        opt = meta.minify.html;
                    }

                    var html = meta.html;
                    html.dest = HtmlPackage.minify(opt, {
                        'dir': html.dir,
                        'name': 32,         //md5 的长度。
                    });

                    html.md5 = '';
                }
            }

            if (JsPackage) {
                var opt = options.js;
                if (opt && opt.write) {
                    var js = meta.js;
                    js.dest = JsPackage.minify({
                        'dir': js.dir,
                        'name': 32,
                    });

                    js.md5 = '';
                }
            }
            
            if (LessPackage) {
                var opt = options.less;
                if (opt && opt.write) {
                    var css = meta.css;
                    var dest = {
                        'dir': css.dir,
                        'name': 32,         //md5 的长度。
                    };

                    LessPackage.minify(dest, function (dest, content) {
                        css.dest = dest;
                        css.md5 = '';

                        done && done();
                    });
                }
                else {
                    done && done();
                }
            }
            else {
                done && done();
            }
           
           
        },

        /**
        * 监控当前包文件及各个资源引用模块。
        */
        watch: function () {
            var meta = mapper.get(this);
            var HtmlPackage = meta.HtmlPackage;
            var JsPackage = meta.JsPackage;
            var LessPackage = meta.LessPackage;
            var emitter = meta.emitter;
            var old = meta.old;

            if (HtmlPackage) {
                HtmlPackage.watch();
                if (!old.HtmlPackage) {
                    HtmlPackage.on('change', function () {
                        var html = meta.html;
                        html.md5 = HtmlPackage.compile(html.dest);
                        emitter.fire('change');
                    });
                }
            }
            else if(old.HtmlPackage) {
                old.HtmlPackage.unwatch();
            }


            if (JsPackage) {
                JsPackage.watch();
                if (!old.JsPackage) {
                    JsPackage.on('change', function () {
                        var js = meta.js;
                        js.md5 = JsPackage.concat({ 'dest': js.dest, });
                        emitter.fire('change');
                    });
                }
            }
            else if (old.JsPackage) {
                old.JsPackage.unwatch();
            }

            if (LessPackage) {
                LessPackage.watch();
                if (!old.LessPackage) {
                    LessPackage.on('change', function () {
                        var css = meta.css;
                        css.md5 = LessPackage.concat(css.dest);
                        emitter.fire('change');
                    });
                }
            }
            else if (old.LessPackage) {
                old.LessPackage.unwatch();
            }

       
            var watcher = meta.watcher;
            if (!watcher) {

                var self = this;

                watcher = meta.watcher = new Watcher();
                watcher.set(meta.file);      //这里只需要添加一次

                watcher.on('changed', function () {
                    self.reset();
                    self.parse();       //json 文件发生变化，重新解析。
                    self.compile();     //根节点发生变化，需要重新编译。
                    self.watch();

                    emitter.fire('change');

                });
            }


        },

        /**
        * 构建。
        */
        build: function (options, done) {

            var pkg = this;
            pkg.parse();

            pkg.compile(options.compile, function () {

                pkg.minify(options.minify, function () {
           
                    done && done();

                });
            });

        },

        /**
        * 绑定事件。
        */
        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);

            return this;
        },

        clean: function () {
            var meta = mapper.get(this);
            FileRefs.delete(meta.file);
        },

        /**
        * 获取输出目标包的信息。
        * 该方法由静态方法 write 调用。
        */
        get: function () {
            var meta = mapper.get(this);
            var name = meta.name;
            var htdocsDir = meta.htdocsDir;

            var data = {};

            ['js', 'html', 'css'].forEach(function (type) {

                var item = meta[type];
                if (!item) {
                    return;
                }

                var href = Path.relative(htdocsDir, item.dest);
                var md5 = item.md5.slice(0, meta.md5);

                if (md5) {
                    href = href + '?' + md5;
                }

                data[type] = href;

            });

            var obj = {};
            obj[name] = data;

            return obj;
        },


    };


    //静态方法。
    return $.Object.extend(Package, {

        /**
        * 写入到指定的总包。
        */
        write: function (dest, pkgs, minify) {

            var json = File.readJSON(dest) || {};

            pkgs.forEach(function (pkg) {

                var obj = pkg.get();

                $.Object.extend(json, obj);
            });
      
            File.writeJSON(dest, json, minify);
        },
    });



});






/**
* 对第三方库 html 的封装。
*/
define('Html', function (require, module, exports) {

    var $ = require('$');
    var Defaults = require('Defaults');

    //https://github.com/kangax/html-minifier
    var Minifier = require('html-minifier');


    var defaults = Defaults.clone(module.id);



    

    return {
   
        /**
        * 对 html 进行压缩。
        */
        minify: function (html, config) {

            config = $.Object.extendDeeply({}, defaults.minify, config);

            html = Minifier.minify(html, config);

            return html;
        },
    };

});






/**
* JS 文件工具类。
*/
define('JS', function (require, module, exports) {

    var $ = require('$');
    var path = require('path');

    var File = require('File');
    var FileRefs = require('FileRefs');
    var Path = require('Path');
    var MD5 = require('MD5');





    return {
        

        /**
        * 合并 js 文件列表。
        */
        concat: function (list, options) {

            if (list.length == 0) {
                return '';
            }

            var contents = [];
            
            list.forEach(function (src, index) {

                var file = src;

                //添加文件路径的注释
                var addPath = options.addPath;
                if (addPath) { 
                    //如果传入的是字符串，则使用相对于它的地址。
                    if (typeof addPath == 'string') {
                        file = Path.relative(addPath, src);
                    }

                    contents.push('\r\n// ' + file + '\r\n');
                }
                

                var s = File.read(src);
                contents.push(s);

                //删除源分 js 文件
                if (options.delete) {
                    FileRefs.delete(src);
                }

            });

            console.log('合并'.bgGreen, list.length.toString().cyan, '个文件:');
            console.log('    ' + list.join('\r\n    ').gray);


            var content = contents.join('');
            var dest = options.dest;
 
            if (dest) {
                if (typeof dest == 'object') {
                    var name = dest.name;

                    if (typeof name == 'number') {
                        name = MD5.get(content, name);
                        name += '.js';
                    }

                    dest = dest.dir + name;
                }

                File.write(dest, content); //写入合并后的 js 文件
            }

        

            return content;

        },



        /**
        * 压缩 js 内容。
        */
        minify: function (content, options) {

            options = options || {};

            //https://github.com/mishoo/UglifyJS2
            var UglifyJS = require('uglify-js');

            //直接从内容压缩，不读取文件
            var result = UglifyJS.minify(content, { fromString: true, });
            content = result.code;

            var dest = options.dest;
            if (dest) {

                if (typeof dest == 'object') {
                    var name = dest.name;
                    if (typeof name == 'number') {
                        name = MD5.get(content, name);
                        name += '.js';
                    }

                    dest = dest.dir + name;
                }

                File.write(dest, content); //写入合并后的 js 文件

            }

            return content;
        },

    };


   



});






/**
* 对第三方库 less 的封装。
*/
define('Less', function (require, module, exports) {

    var $ = require('$');
    var path = require('path');

    //https://github.com/Marak/colors.js
    var colors = require('colors');

    var File = require('File');
    var FileRefs = require('FileRefs');
    var MD5 = require('MD5');
    var Less = require('less');

    var md5$debug = {}; //记录 debug 版的信息
    var md5$min = {};   //记录 min 版的信息


    function compile(options) {

        //内部的共用方法，执行最后的操作。
        function done(css, dest) {

            if (options.delete) {
                FileRefs.delete(src);
            }

            if (dest) {    //写入 css 文件
                if (overwrite || !existed) {
                    File.write(dest, css);
                }
            }

            var done = options.done;
            done && done(css);
        }




        var src = options.src;
        var dest = options.dest;
        var compress = options.compress;
        var overwrite = options.overwrite;
       
        if (overwrite === undefined) { 
            overwrite = true;  //修正一下。 当未指定时，则默认为覆盖写入。
        }

        var existed = dest ? File.exists(dest) : false;
        var md5$item = compress ? md5$min : md5$debug;


        var less = File.read(src);
        var md5 = MD5.get(less);
        var item = md5$item[md5];

        if (!item) {
            item = md5$item[md5] = {
                css: '',
                md5: '',
            };
        }


        //指定了要写入目标 css 文件，并且已经存在该目标文件。
        if (dest && existed) {

            var css = File.read(dest);
            var md5css = MD5.get(css);

            if (item.md5 == md5css) { //要编译生成的 css 与之前存在的一致
                console.log('已编译过'.yellow, dest.gray);
                return done(css);
            }
        }

        
        var css = item.css;
        if (css) {
            console.log('已编译过'.yellow, src.gray);
            return done(css, dest);
        }



        //首次编译。

        //详见: http://lesscss.org/usage/#programmatic-usage

        Less.render(less, {
            paths: ['.'],           // Specify search paths for @import directives
            filename: src,          // Specify a filename, for better error messages
            compress: compress,     // Minify CSS output

        }, function (error, output) {

            if (error) {
                console.log('less 编译错误:'.bgRed, error.message.bgRed);
                console.log('所在文件: '.bgMagenta, src.bgMagenta);

                console.log(error);
                throw error;
            }

            var css = output.css;

            //less 输出的 css 是两个空格缩进的，此处用这种方式换成4个空格缩进，不知是否安全。
            if (!compress) {
                css = css.split('\n  ').join('\r\n    ');
            }
            

            item.css = css;
            item.md5 = MD5.get(css);

            console.log('编译'.green, src.cyan);

            done(css, dest);
        });
    }


    
    /**
    * 压缩合并后的 css 文件。
    */
    function minify (content, fn) {
         
        if (!content) {
            fn && fn('');
            return;
        }

        Less.render(content, {
            compress: true,

        }, function (error, output) {

            if (error) {
                console.log('less 压缩错误:'.bgRed, error.message.bgRed);
                console.log(error);
                throw error;
            }

            var css = output.css;

            fn && fn(css);

        });

    }



    return {
        'compile': compile,
        'minify': minify,
    };

});






/**
* 文件监控器类。
* @class
* @name Watcher
*/
define('Watcher', function (require, module, exports) {

    var Path = require('Path');
    var Defaults = require('Defaults');
    var MD5 = require('MD5');

    var $ = require('$');
    

    var Emitter = $.require('Emitter');
    var Mapper = $.require('Mapper');
    var mapper = new Mapper();

    //https://github.com/shama/gaze
    var Gaze = require('gaze').Gaze;



    function Watcher(config) {


        Mapper.setGuid(this);

        config = Defaults.clone(module.id, config);


        var emitter = new Emitter(this);
        var files = config.files || [];
        var event$desc = config.events;

        var watcher = new Gaze(files, {
            debounceDelay: 0,
            maxListeners: 9999,
        });

        var events = {};        //记录需要绑定的事件类型。
        var file$md5 = {};      //记录文件名与对应的内容的 md5 值。

        var meta = {
            'emitter': emitter,
            'watcher': watcher,
            'events': events,
        };

        mapper.set(this, meta);


       Object.keys(event$desc).forEach(function (event) {

            (function (event) {

                var tid = null;
                var files = {};


                watcher.on(event, function (file) {

                    //没有绑定该类型的事件。
                    if (!events[event]) {
                        return;
                    }

                    file = Path.relative('./', file);

                    //在某些编辑器里，内容没发生变化也可以保存(只会刷新修改时间)，从而触发 changed 事件。
                    if (event == 'changed') {
                        var md5 = MD5.read(file);
                        if (md5 == file$md5[file]) {
                            return;
                        }

                        file$md5[file] = md5;
                    }

                    clearTimeout(tid);
                    files[file] = ''; //增加一条记录

                    var desc = event$desc[event];
                    console.log(desc.cyan, file);

                    tid = setTimeout(function () {

                        var list = Object.keys(files);

                        emitter.fire(event, [list]);
                        Watcher.log();

                    }, 500);
                });

            })(event);


        });

    }




    Watcher.prototype = {
        constructor: Watcher,

        /**
        * 设置新的监控文件列表。
        * 该方法会重新设置新的要监控的文件列表，之前的列表则不再监控。
        */
        set: function (dir, filters) {

            var meta = mapper.get(this);
            var watcher = meta.watcher;

            //先清空之前的
            var dir$files = watcher.relative();
            Object.keys(dir$files).forEach(function (dir) {

                var files = dir$files[dir];

                files.forEach(function (file) {
                    file = Path.join(dir, file);
                    watcher.remove(file);
                });
            });
           

            var Patterns = require('Patterns');

            var files = Patterns.combine(dir, filters);
            files = $.Array.unique(files);

            watcher.add(files);
           
        },

        /**
        * 添加新的监控文件列表。
        * 该方法会在原来的列表基础上添加新的要监控的文件列表。
        */
        add: function (dir, filters) {

            var meta = mapper.get(this);
            var watcher = meta.watcher;

            var Patterns = require('Patterns');
            var files = Patterns.combine(dir, filters);
            
            watcher.add(files);

        },

        /**
        * Unwatch all files and reset the watch instance.
        */
        close: function () {
            var meta = mapper.get(this);
            var watcher = meta.watcher;
            watcher.close();
        },


        on: function (name, fn) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;

            var args = [].slice.call(arguments, 0);
            emitter.on.apply(emitter, args);

            //记录绑定的事件类型。
            var events = meta.events;
            if (typeof name == 'object') {
                Object.keys(name).forEach(function (name) {
                    events[name] = true;
                });
            }
            else {
                events[name] = true;
            }

            return this;
        },

        destroy: function () {

            var meta = mapper.get(this);

            meta.watcher.close();


            var emitter = meta.emitter;
            emitter.destroy();

            mapper.remove(this);

        },


    };

   


    var tid = null;

    return $.Object.extend(Watcher, {
        log: function () {
            clearTimeout(tid);
            tid = setTimeout(function () {
                console.log('>>'.cyan + ' Watching...');
            }, 500);
        },
    });


});





/**
* Module 模块的默认配置
* @name Module.defaults
*/
define('Module.defaults', /**@lends Module.defaults*/ {
    seperator: '/',     //私有模块的分隔符
    crossover: false,   //不允许跨级调用
    repeated: false,    //不允许重复定义同名的模块
});


/**
* Url 模块的默认配置。
* 字符串中的 {~} 表示站头的根地址；{@} 表示使用的文件版本 debug 或 min。
* @name Url.defaults
*/
define('Url.defaults', /**@lends Url.defaults*/ {

    root: '',

    replacer: {
        root: '~',
        edition: '@'
    },

});


/**
* CssLinks 模块的默认配置
* @name CssLinks.defaults
*/
define('CssLinks.defaults', /**@lends CssLinks.defaults*/ {
    
    md5: 4, //填充模板所使用的 md5 的长度。
    exts: { //优先识别的后缀名
        debug: '.debug.css',
        min: '.min.css',
    },

    //用来提取出 css 标签的正则表达式。
    regexp: /<link\s+.*rel\s*=\s*["\']stylesheet["\'].*\/>/ig,

    minify: {
        '.debug.css': {
            ext: '.min.css',    //生成的扩展名。
            overwrite: false,    //是否覆盖目标文件。
            write: true,        //写入压缩后的 css。
            delete: true,       //删除源 css 文件。
            outer: true,        //当引用的文件是外部地址时，是否替换成 min 的引用。
        },
    },
});


/**
* HtmlLinks 模块的默认配置
* @name HtmlLinks.defaults
*/
define('HtmlLinks.defaults', /**@lends HtmlLinks.defaults*/ {

    regexp: /<link\s+.*rel\s*=\s*["\']grunt["\'].*\/>/ig,

});


/**
* HtmlList 模块的默认配置
* @name HtmlList.defaults
*/
define('HtmlList.defaults', /**@lends HtmlList.defaults*/ {
    
  
    sample: '<link rel="grunt" href="{href}" />', //使用的模板

    tags: {
        begin: '<!--grunt.html.begin-->',
        end: '<!--grunt.html.end-->',
    },

    extraPatterns: [],      //额外附加的模式。

});


/**
* JsList 模块的默认配置
* @name JsList.defaults
*/
define('JsList.defaults', /**@lends JsList.defaults*/ {
    
    htdocsDir: '../htdocs/',

    md5: 4,           //填充模板所使用的 md5 的长度。
    sample: '<script src="{href}"></script>',   //使用的模板。


    tags: {
        begin: '<!--grunt.js.begin-->',
        end: '<!--grunt.js.end-->',
    },

    extraPatterns: [],      //额外附加的模式。

    max: {
        x: 110,     //每行最大的长度。
        y: 250,     //最多的行数。
        excludes: null,
    },

    //用来提取出静态 script 标签的正则表达式。
    regexp: /<script\s+.*src\s*=\s*[^>]*?>[\s\S]*?<\/script>/gi,

    concat: {
        'header': 'partial/begin.js',
        'footer': 'partial/end.js',
        'write': true,      //写入合并后的 js
        'delete': true,     //删除合并前的源 js 文件。
        'addPath': true,    //添加文件路径的注释

        //输出的合并文件的文件名。
        //为数字时表示以文件内容的 md5 值的指定位数;
        //为字符串时表示固定名称。
        //不指定时，相当于数字 32。
        'name': 32,        
    },

    minify: {
        'write': true,      //写入压缩后的 js
        'delete': true,     //删除压缩前的源 js 文件。
    },

    inline: {
        'delete': true,     //删除内联前的源 js 文件
    },

});


/**
* JsScripts 模块的默认配置
* @name JsScripts.defaults
*/
define('JsScripts.defaults', /**@lends JsScripts.defaults*/ {
    
    md5: 4, //填充模板所使用的 md5 的长度。
    exts: { //优先识别的后缀名
        debug: '.debug.js',
        min: '.min.js',
    },

    //用来提取出 script 标签的正则表达式。
    regexp: /<script\s+.*src\s*=\s*[^>]*?>[\s\S]*?<\/script>/gi,

    minify: {
        '.debug.js': {
            ext: '.min.js',
            overwrite: false,    //是否覆盖目标文件。
            write: true,        //写入压缩后的 js。
            delete: true,       //删除源 js 文件。
            outer: true,        //当引用的文件是外部地址时，是否替换成 min 的引用。
        },
    },
});


/**
* LessLinks 模块的默认配置
* @name LessLinks.defaults
*/
define('LessLinks.defaults', /**@lends LessLinks.defaults*/ {
    
    htdocsDir: '../htdocs/',
    cssDir: '../htdocs/style/css/',

    md5: 4, //填充模板所使用的 md5 的长度。

    //用来提取出 css 标签的正则表达式。
    regexp: /<link\s+.*rel\s*=\s*["\']less["\'].*\/>/ig,


    sample: '<link href="{href}" rel="stylesheet" />',   //使用的模板

    minify: {
        'delete': true,     //删除压缩前的源 css 文件。
    },

});


/**
* LessList 模块的默认配置
* @name LessList.defaults
*/
define('LessList.defaults', /**@lends LessList.defaults*/ {
    
    htdocsDir: '../htdocs/',
    cssDir: '../htdocs/style/css/',


    md5: 4,           //填充模板所使用的 md5 的长度
    sample: '<link href="{href}" rel="stylesheet" />',   //使用的模板


    tags: {
        begin: '<!--grunt.css.begin-->',
        end: '<!--grunt.css.end-->',
    },

    extraPatterns: [],      //额外附加的模式。

    concat: {
        'write': true,      //写入合并后的 css 文件。
        'delete': true,     //删除合并前的源分 css 文件

        //输出的合并文件的文件名。
        //为数字时表示以文件内容的 md5 值的指定位数;
        //为字符串时表示固定名称。
        //不指定时，相当于数字 32。
        'name': 32,
    },

    minify: {
        'delete': true,     //删除压缩前的源 css 文件。
    },
});


/**
* MasterPage 模块的默认配置
* @name MasterPage.defaults
*/
define('MasterPage.defaults', /**@lends MasterPage.defaults*/ {


    htdocsDir: '../htdocs/',
    cssDir: 'style/css/',

    minifyHtml: {
        //removeAttributeQuotes: true, //引号不能去掉，否则可能会出错。
        collapseWhitespace: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeRedundantAttributes: true,
        minifyJS: false,
        minifyCSS: false,
        minifyURLs: true,
        keepClosingSlash: true,
    },

});


/**
* WebSite 模块的默认配置
* @name WebSite.defaults
*/
define('WebSite.defaults', /**@lends WebSite.defaults*/ {

    cssDir: 'style/css/',
    htdocsDir: '../htdocs/',
    buildDir: '../build/htdocs/',
    files: '**/*.master.html',
    url: 'http://{host}/{dir}index.html{query}',
    qr: {
        width: 380,
        url: 'http://qr.topscan.com/api.php{query}',
    },
});


/**
* Package 模块的默认配置
* @name Package.defaults
*/
define('Package.defaults', /**@lends Package.defaults*/ {

    htdocsDir: '../htdocs/',
    cssDir: 'style/css/',
    md5: 4,                     //输出到总包的路径中所使用的 md5 的长度。

    compile: {
        'html': {
            write: true,        //写入编译后的 html 文件。
            delete: false,      //删除编译前的源 html 文件。
        },
        'js': {
            write: true,        //写入合并后的 js。
            delete: false,      //删除合并前的源 js 文件。
            addPath: true,      //添加文件路径的注释。
        },
        'less': {
            write: true,        //写入编译后的 css 文件。
            delete: false,      //删除编译前的源 less 文件。
        },
    },

    minify: {
        html: {
            collapseWhitespace: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            removeRedundantAttributes: true,
            minifyJS: false,
            minifyCSS: false,
            minifyURLs: true,
            keepClosingSlash: true,
        },
        js: {
            'write': true,      //写入压缩后的 js。
        },
        less: {
            'write': true,     //写入压缩后的 css 文件。
        },
    },

});


/**
* Html 模块的默认配置
* @name Html.defaults
*/
define('Html.defaults', /**@lends Html.defaults*/ {
    
    'minify': {
        //removeAttributeQuotes: true, //引号不能去掉，否则可能会出错。
        collapseWhitespace: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeRedundantAttributes: true,
        minifyJS: false,
        minifyCSS: false,
        minifyURLs: true,
        keepClosingSlash: true,
    },
});


/**
* Watcher 模块的默认配置
* @name Watcher.defaults
*/
define('Watcher.defaults', /**@lends Watcher.defaults*/ {
    
    events: {
        added: '创建新文件',
        deleted: '文件被删除',
        changed: '文件被修改',
        renamed: '文件重命名',
    },
});




//设置对外暴露的模块
Module.expose({

    ////core
    //'Weber': true,

    ////excore

    ////crypto
    //'MD5': true,


    ////fs
    //'Directory': true,
    //'Path': true,

    //'Watcher': true,

    ////html
    //'Attribute': true,
    //'CssLinks': true,
    'HtmlLinks': true,
    //'HtmlList': true,
    //'JsList': true,
    //'JsScripts': true,
    //'LessList': true,
    //'MasterPage': true,
    //'Tag': true,

    'JsPackage': true,
    'Package': true,

    'File': true,
    'Patterns': true,
    'WebSite': true,
   
});




//对 Node 暴露的导出对象。
module.exports = Module.require('Weber');



})(
    global, // 在 Node 中，全局对象是 global；其他环境是 this
    module,
    require, // node 原生 require

    console,
    setTimeout,
    setInterval,

    Array, 
    Boolean,
    Date,
    Error,
    Function,
    Math,
    Number,
    Object,
    RegExp,
    String,

    JSON,

    require('../miniquery')

    /*, undefined */
);
