
define('Bridge', function (require, module) {

    //针对 iframe 页面。
    if (window !== top) {
        var Bridge = top.require(module.id);

        return {
            'on': function (name, fn) {
                var args = [].slice.call(arguments, 0);
                Bridge.bind(window, args);
            },

            'open': function (cmd, query, data) {
                Bridge.open(cmd, query, data);
            },

        };
    }



    //针对 top 页面。

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var Emitter = MiniQuery.require('Emitter');
    var Mapper = MiniQuery.require('Mapper');
    var mapper = new Mapper();
    var emitter = new Emitter(); // top 页面自己使用的 emitter。


    return {

        'bind': function (win, args) {

            //针对各个 iframe 页面单独使用的 emitter。
            var emitter = mapper.get(win); 
            if (!emitter) {
                emitter = new Emitter();
                mapper.set(win, emitter);
            }

            emitter.on.apply(emitter, args);
        },



        'fire': function (name, item) {

            //根据菜单 item 找到对应的 iframe。
            var iframes = $('iframe').toArray();

            var iframe = $.Array.findItem(iframes, function (iframe, index) {
                var sn = iframe.getAttribute('data-sn');
                return sn == item.id;
            });

            if (!iframe) {
                return;
            }

            //根据 iframe 的 window 取出对应的 emitter。
            var win = iframe.contentWindow;
            var emitter = mapper.get(win);

            if (!emitter) { //该 iframe 尚未绑定过事件，所在不存在 emitter。
                return;
            }

            var values = emitter.fire(name, []);
            var len = values.length;
            if (len > 0) {
                return values[len - 1]; //只取最后一个值。
            }

        },

        'open': function (cmd, query, data) {
            emitter.fire('open', [cmd, query, data]);
        },

        'on': emitter.on.bind(emitter),
    };





});
