

define('/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');

    var emitter = new Emitter();
    var loading = null;
    var toast = null;


    function post(type, list) {

        var api = KISP.create('API', 'Sale.import');

        api.on({

            'request': function () {

                loading = loading || top.KISP.create('Loading', {
                    mask: 0,
                });

                loading.show('提交中...');
            },

            'response': function () {
                loading.hide();
            },

            'fail': function (code, msg, json, xhr) {
                top.KISP.alert('提交数据失败: {0} ({1})', msg, code);
            },

            'error': function (code, msg, json, xhr) {
                top.KISP.alert('提交数据错误: 网络繁忙，请稍候再试');
            },
        });


        api.on('success', function (data, json, xhr) {


            toast = toast || top.KISP.create('Toast', {
                text: '提交成功',
                duration: 1500,
                mask: 0,
            });

            toast.show();

            setTimeout(function () {
                emitter.fire('success', 'post', [type]);

            }, 1500);

        });

        api.post({
            'type': type,
            'list': list,
        });


    }




    return {
        post: post,
        on: emitter.on.bind(emitter),
    };


});