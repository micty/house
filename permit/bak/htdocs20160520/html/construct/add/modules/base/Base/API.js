/// <reference path="API.js" />


define('/Base/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');

    var emitter = new Emitter();
    var loading = null;
    var toast = null;




    function post(data) {

        var id = data.id;
        var name = id ? 'Construct.update' : 'Construct.add';
        var api = KISP.create('API', name);

        api.on({

            'request': function () {

                loading = loading || KISP.create('Loading', {
                    mask: 0,

                });

                loading.show('提交中...');

            },

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {

                toast = toast || KISP.create('Toast', {
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




    function get(id, isLand) {


        var name = isLand ? 'Land.get' : 'Construct.get';
        var api = KISP.create('API', name);

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
        post: post,
        on: emitter.on.bind(emitter),
    };


});