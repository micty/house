

/**
* 当 Debug 工具类
*/
define('Debug', function (require, exports, module) {

    var $ = require('$');


    var isDebuged = true;

    var type$ext = {
        debug: 'debug',
        min: 'min'
    };


    function set(debuged) {
        isDebuged = !!debuged;
    }

    function get() {
        var key = isDebuged ? 'debug' : 'min';
        return type$ext[key];
    }

    function check() {
        return isDebuged;
    }


    function config(obj) {
        $.Object.extend(type$ext, obj);
    }


    return {
        set: set,
        get: get,
        check: check,
        config: config
    };
});

