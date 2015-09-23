

/**
* 缓存数据到 top 页面的工具类。
*/
define('Cache', function (require, exports, module) {



    if (window !== top) {
        return top.KERP.require('Cache');
    }


    var key$value = {};


    function get(key, defaultValue) {
        if (key in key$value) {
            return key$value[key];
        }
        else {
            key$value[key] = defaultValue;
            return defaultValue;
        }
    }

    function set(key, value) {
        key$value[key] = value;
    }

    function remove(key) {
        delete key$value[key];
    }

    function has(key) {
        return key in key$value;
    }


    return {
        get: get,
        set: set,
        remove: remove,
        has: has
    };

});

