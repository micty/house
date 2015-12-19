

define('/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');


    var emitter = new Emitter();


  
    var loading = null;


    //获取数据
    function get() {

        loading = loading || KISP.create('Loading', {
            background: 'none',
            color: '#000',
            text: '加载中...',
            top: 10,
            height: 22,
            cssClass: 'same-line',
        });

        loading.show();



        var api = KISP.create('API', 'ActivitySignup.list', {
            //proxy: 'api/GetSignupList.js',
        });


        api.on({

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
                    msg = '获取数据错误: 网络繁忙，请稍候再试';
                }

                KISP.alert(msg);
            },
        });

        api.get();


    }



    return {
        get: get,
        on: emitter.on.bind(emitter),
    };


});