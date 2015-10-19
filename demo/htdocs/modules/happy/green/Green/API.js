

define('/Green/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');
    var emitter = new Emitter();

    var loading = null;

    //获取数据
    function get(type) {


        var api = KISP.create('API', 'Happy.get', {
            proxy: 'api/' + type + '.js',
        });


        api.on({

            'request': function () {
                loading = loading || KISP.create('Loading', {
                    text: '加载中...',
                });
                loading.show();
            },

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {
                emitter.fire('success', [data]);
            },



            'fail': function (code, msg, json, xhr) {

                KISP.alert('获取数据失败: {0} ({1})', msg, code);

            },

            'error': function (code, msg, json, xhr) {
                if (!json) { // http 协议连接错误
                    msg = '网络繁忙，请稍候再试';
                }

                KISP.alert(msg);
            },
        });

        api.get({
            'type': type,
        });


    }



    return {
        get: get,
        on: emitter.on.bind(emitter),
    };


});