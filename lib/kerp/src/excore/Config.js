

/**
* 配置工具类。
*/
define('Config', function (require, exports, module) {


    var $ = require('$');
    var Url = require('Url');


    //递归扫描并转换 url 成真实的地址
    function convert(config) {

        return $.Object.map(config, function (key, value) {

            if (typeof value == 'string') {
                return Url.format(value);
            }

            if (value instanceof Array) {
                return $.Array.keep(value, function (item, index) {

                    if (typeof item == 'string') {
                        return Url.format(item);
                    }

                    if (typeof item == 'object') {
                        return convert(item); //递归
                    }

                    return item;

                }, true);
            }

            return value;

        }, true); //深层次来扫描

    }

    function set(name$config) {

        var obj = name$config['Url'];
        if (obj) { //先单独设置好站头的根地址，后面的模块要用到
            Url.config(obj);
        }

        $.Object.each(name$config, function (name, config) {

            if (name == 'Url') {
                return;
            }

            var module = require(name);
            if (!module || !module.config) { //不存在该模块或该模块不存在 config 方法
                return;
            }

            config = convert(config);
            module.config(config);

        });
    }


    return {
        set: set,
    };

});

