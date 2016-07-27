

define('/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var API = require('API');

    var Emitter = MiniQuery.require('Emitter');

    var emitter = new Emitter();
    var loading = null;
    var toast = null;

    //获取数据
    function get(id) {
        var api = new API('PlanLicense.get');

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
                top.KISP.alert('获取数据失败: {0} ({1})', msg, code);
            },

            'error': function (code, msg, json, xhr) {
                top.KISP.alert('获取数据错误: 网络繁忙，请稍候再试');
            },
        });

        api.get({
            'id': id,
        });

    }


    function post(data) {

        var name = data.id ? 'update' : 'add';
        var api = new API('PlanLicense.' + name);

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
                top.KISP.alert('提交失败: {0}({1})', msg, code);
            },

            'error': function () {
                top.KISP.alert('提交错误: 网络繁忙，请稍候再试');
            },
        });


        api.post(data);


    }


    function remove(id) {

        var api = new API('PlanLicense.remove');

        api.on({
            'request': function () {
                loading = loading || top.KISP.create('Loading');
                loading.show('删除中...');
            },

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {
                var list = data;
                emitter.fire('success', 'remove', [list]);
            },

            'fail': function (code, msg, json, xhr) {
                top.KISP.alert('删除数据失败: {0} ({1})', msg, code);
            },
            'error': function (code, msg, json, xhr) {
                top.KISP.alert('删除数据错误: 网络繁忙，请稍候再试');
            },
        });

        api.get({
            'id': id,
        });

    }



    return {
        'get': get,
        'post': post,
        'remove': remove,
        'on': emitter.on.bind(emitter),
    };


});