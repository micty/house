
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

            debugger;

            //针对各个 iframe 页面单独使用的 emitter。
            var emitter = mapper.get(win); 
            if (!emitter) {
                emitter = new Emitter();
                emitter.id = $.String.random();

                mapper.set(win, emitter);
            }

            emitter.on.apply(emitter, args);
        },



        'fire': function (name, item) {
            var iframes = $('iframe').toArray();

            var iframe = $.Array.findItem(iframes, function (iframe, index) {
                var sn = iframe.getAttribute('data-sn');
                return sn == item.id;
            });

            if (!iframe) {
                return;
            }

            var win = iframe.contentWindow;
            var emitter = mapper.get(win);

            debugger;


            emitter.fire(name, []);
        },

        'open': function (cmd, query, data) {
            emitter.fire('open', [cmd, query, data]);
        },

        'on': emitter.on.bind(emitter),
    };





});
