

define('/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');

    var emitter = new Emitter();
    var loading = null;
    var toast = null;


    //获取数据
    function get(id) {

        var api = KISP.create('API', 'SaleLicense.get');

        api.on({

            'request': function () {

                loading = loading || top.KISP.create('Loading', {
                    mask: 0,
                });

                loading.show('加载中...');
            },

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {
                emitter.fire('success', 'get', [data]);
            },

            'fail': function (code, msg, json, xhr) {
                KISP.alert('获取数据失败: {0} ({1})', msg, code);
            },

            'error': function (code, msg, json, xhr) {
                KISP.alert('获取数据错误: 网络繁忙，请稍候再试');
            },
        });

        api.get({
            'id': id,
        });


    }





    function post(data) {

        var id = data.id;
        var name = id ? 'update' : 'add';
        var api = KISP.create('API', 'SaleLicense.' + name);

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

            'success': function (data, json, xhr) {

                toast = toast || top.KISP.create('Toast', {
                    text: '提交成功',
                    duration: 1500,
                    mask: 0,
                });

                toast.show();

                setTimeout(function () {
                    emitter.fire('success', 'post', [data]);

                }, 1500);

            },


            'fail': function (code, msg, json) {
                KISP.alert('提交失败: {0}({1})', msg, code);
            },

            'error': function () {
                KISP.alert('提交错误: 网络繁忙，请稍候再试');
            },
        });


        api.post(data);


    }




    return {
        get: get,
        post: post,
        on: emitter.on.bind(emitter),
    };


});