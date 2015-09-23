/*
* 
*/
define('/Message', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    

    var panel = KISP.create('Panel');

    panel.on('render', function () {

        var p = Url.getQueryString(window) || {};
        if ('menu' in p) {
            p.msg = p.menu;
            delete p.menu;
        }

        // 要兼容两种格式 data={msg: '1000', '...': '...', ...} , msg=100&...
        if (p.data) { 
            var extendData = decodeURIComponent(decodeURIComponent(p.data)); // 编码2次，解码2次
            $.extend(p, JSON.parse(extendData)); // 将data={msg:''}格式转换为p.msg的格式
        }

        var msg = p.msg = +p.msg || 0; // 注意msg=0 为false
        msg = String(msg);
        panel.fire(msg, [p]);

    });


    return panel.wrap();





});



