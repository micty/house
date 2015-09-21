

/**
* 当前页面的 Url 工具类
*/
define('Url', function (require, exports, module) {

    var $ = require('$');


    var host$url = {};
    var host = location.host;


    /**
    * 获取当前 Web 站点的根地址。
    */
    function root() {
        return host$url[host] || host$url['default'];
    }


    function config(data) {

        if (data) { //set
            $.Object.extend(host$url, data);
        }
        else { //get
            return $.Object.extend({}, host$url);
        }
    }

    /**
    * 检查给定的 url 是否以 'http://' 或 'https://' 开头。
    */
    function check(url) {
        if (typeof url != 'string') {
            return false;
        }

        return url.indexOf('http://') == 0 || url.indexOf('https://') == 0;
    }


    function format(url, data) {


        var Debug = require('Debug');


        if (typeof data != 'object') {
            var args = [].slice.call(arguments, 1);
            data = $.Array.toObject(args);
            delete data['length'];
        }

        data = $.Object.extend({
            '~': root(),
            '@': Debug.get()

        }, data);

        return $.String.format(url, data);
    }



    return $.Object.extend({}, $.Url.Current, {

        root: root,
        config: config,
        check: check,
        format: format

    });

});
