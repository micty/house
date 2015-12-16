﻿

define('ActivitySignup/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');
    var emitter = new Emitter();


    var loading2 = null;
    var toast2 = null;

    function post(data) {

        loading2 = KISP.create('Loading', {
            text: '提交中...',
            mask: 0.35,
        });

        loading2.show();


        var api = KISP.create('API', 'ActivitySignup.add', {
            //proxy: 'api/GetRecommedList.js',
        });


        api.on({
            'response': function () {
                loading2.hide();
            },

            'success': function (data, json, xhr) {

                toast2 = toast2 || KISP.create('Toast', {
                    text: '提交成功',
                    duration: 1500,
                    mask: 0.35,
                });

                toast2.show();

                emitter.fire('success', 'post', [data]);

            },

            'fail': function (code, msg, json, xhr) {
                KISP.alert('提交数据失败: {0} ({1})', msg, code);
            },

            'error': function (code, msg, json, xhr) {
                if (!json) { // http 协议连接错误
                    msg = '提交数据错误: 网络繁忙，请稍候再试';
                }

                KISP.alert(msg);
            },
        });

        api.post(data);


    }



    return {
        post: post,
        on: emitter.on.bind(emitter),
    };


});