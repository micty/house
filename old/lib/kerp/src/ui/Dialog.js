



/**
* 动态加载弹出对话框类。
* @author micty
*/
define('Dialog', function (require, exports, module) {

    if (window !== top) {
        return top.KERP.require('Dialog');
    }


    var $ = require('$');
    var Seajs = require('Seajs');


    var defaults = {};
    var randomPrefix = 'dialog-' + $.String.random() + '-'; //运行时确定的随机串

    var type$name = {
        'dialog': 'dialog',
        'data': 'data',
    };


    function use(fn) {
        Seajs.use('dialog', fn);
    }

    function config(obj) {

        //get
        if (arguments.length == 0) {
            return defaults;
        }

        //set
        $.Object.extend(defaults, obj);
    }

   

    

    /**
    * 根据给定的 sn 获取一个运行时确定的用于存储数据的 key。
    * 仅供 art-dialog 和 Iframe 模块中使用
    */
    function getKey(sn, type) {

        var name = type$name[type];
        if (!name) {
            return;
        }

        return randomPrefix + sn + '-' + name;
    }



    return {
        use: use,
        config: config,
        getKey: getKey,
    };

});

