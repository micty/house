

define('ActivitySignup/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var SessionStorage = MiniQuery.require('SessionStorage');
    var Emitter = MiniQuery.require('Emitter');
    var emitter = new Emitter();


    var loading = null;
    var toast = null;
    var dialog = null;

    function post(data) {

        loading = KISP.create('Loading', {
            text: '提交中...',
            mask: 0.35,
        });

        loading.show();


        var api = KISP.create('API', 'ActivitySignup.add', {
            //proxy: 'api/GetRecommedList.js',
        });


        api.on({
            'response': function () {
                loading.hide();
            },

            'success': function (obj, json, xhr) {

                var html = $('#div-dialog-acitivity-signup-success').html();
                html = $.String.between(html, '<!--', '-->');

                dialog = dialog || KISP.create('Dialog', {
                    text: html,
                    height: 320,
                    width: 340,
                    buttons: [
                        {
                            text: '立即前往抽奖',
                            fn: function () {
                                var key = $.String.random(64);
                                var data = dialog.data('data');

                                SessionStorage.set(key, data);

                                var url = 'html/egg/index.html?key=' + key;
                                window.open(url);
                            },
                        },
                    ],
                   
                });

                dialog.data('data', data);
                dialog.show();

                

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