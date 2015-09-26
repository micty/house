



/**
* 动态加载模块类。
* 对 seajs 的进一步封装，以适合本项目的使用。
*/

define('Seajs', function (require, exports, module) {

    var $ = require('$');
    var Url = require('Url');
    var Debug = require('Debug');


    var defaults = {};
    var seajs = window['seajs'];

    function ready(fn) {

        if (seajs) {
            fn && fn(seajs);
            return;
        }


        //先加载 seajs 库
        var url = Url.format('{~}f/seajs/seajs.mod.{@}.js');

        $.require('Script').load({
            url: url,
            id: 'seajsnode', //提供 id，提高性能。 详见 https://github.com/seajs/seajs/issues/260

            onload: function () {
                seajs = window['seajs'];
                seajs.config(defaults);

                fn && fn(seajs);
            }
        });

    }

    function use() {

        var args = [].slice.call(arguments, 0);

        ready(function (seajs) {
            seajs.use.apply(seajs, args);
        });

    }

    function config(obj) {

        $.Object.extend(defaults, obj);

        if (seajs) {
            seajs.config(defaults);
        }
    }


    return {
        ready: ready,
        use: use,
        config: config
    };

});

