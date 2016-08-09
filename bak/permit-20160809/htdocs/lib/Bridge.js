
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

            'close': function () {
                Bridge.close(window);
            },

            'refresh': function (cmd) {
                Bridge.refresh(cmd);
            },

            'data': function (key, value) {
                var args = [].slice.call(arguments, 0);
                return Bridge.data.apply(null, args);
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

    var data = {};  //跨页传输数据。

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



        'fire': function (name, item, args) {


            var id = typeof item == 'object' ? item.id : item;

            //根据菜单 item 找到对应的 iframe。
            var iframes = $('iframe').toArray();

            var iframe = $.Array.findItem(iframes, function (iframe, index) {
                var sn = iframe.getAttribute('data-sn');
                return sn == id;
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

            args = args || [];
            var values = emitter.fire(name, args);
            var len = values.length;
            if (len > 0) {
                return values[len - 1]; //只取最后一个值。
            }

        },

        'open': function (cmd, query, data) {
            emitter.fire('open', [cmd, query, data]);
        },

        'refresh': function (cmd) {
            emitter.fire('refresh', [cmd]);
        },

        'close': function (win) {
            //根据 iframe 的 window 对象找到对应的 iframe。
            var iframes = $('iframe').toArray();

            var iframe = $.Array.findItem(iframes, function (iframe, index) {
                return iframe.contentWindow === win;
            });

            if (!iframe) {
                return;
            }

            var sn = iframe.getAttribute('data-sn'); //这个就是对应的菜单项的 id。

            emitter.fire('close', [sn]);
        },

        'data': function (key, value) {

            //通过把 value 在 json 字符串中转换可以深度拷贝该对象。

            //get
            if (arguments.length == 1) {
                value = data[key];
                value = JSON.parse(value);
                return value;
            }

            //set
            if (value === null) {
                delete data[key];
                return;
            }

            value = JSON.stringify(value);

            data[key] = value;
            return value;
        },

        'on': emitter.on.bind(emitter),
    };





});
