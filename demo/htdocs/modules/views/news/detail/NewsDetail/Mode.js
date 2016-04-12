

define('/NewsDetail/Mode', function (require, module) {


    var $ = require('$');

    var mode$config = {
        'default': {
            sidebar: true,
            head: true,
            title: true,
            sub: true,
        },

        //全部隐藏
        0: {
            sidebar: false,
            head: false,
            title: false,
            sub: false,
        },

        //只显示标题
        1: {
            sidebar: false,
            head: false,
            title: true,
            sub: false,
        },
    };



    function get(mode) {

        var type = typeof mode;
        var defaults = mode$config['default'];

        if (type == 'string' || type == 'number') {
            return mode$config[mode] || defaults;
        }

        //type == 'object'

        var keys = Object.keys(defaults);

        $.Array.each(keys, function (key, index) {
              
            var value = mode[key];
            if (value == '0' || value == 'false') {
                mode[key] = false;
            }
            else {
                mode[key] = true;
            }
        });

        return $.Object.extend({}, defaults, mode);


    }



    return {
        get: get,
    };



});