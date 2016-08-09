
define('/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');

    var emitter = new Emitter();
    var loading = null;
    var toast = null;

    function get(id) {

        var api = KISP.create('API', 'Land.get');

        api.on({

            'request': function () {

                loading = loading || KISP.create('Loading', {
                    mask: 0,
                });

                loading.show('读取中...');

            },

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {

                emitter.fire('success', 'get', [data]);

            },


            'fail': function (code, msg, json) {
                alert('读取失败: {0}({1})', msg, code);
            },

            'error': function () {
                alert('读取错误: 网络繁忙，请稍候再试');
            },
        });


        api.get({
            'id': id, 
        });

    }



    return {
        get: get,
        on: emitter.on.bind(emitter),
    };


});