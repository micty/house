﻿

define('/Happy/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');


    var emitter = new Emitter();



    //获取数据
    function get() {


        api = KISP.create('API', 'Happy.list', {
            proxy: 'api/happy.js'
        });

        api.on({
            'response': function () {
                
            },

            'fail': function (code, msg, json, xhr) {

                KISP.alert('幸福图片加载失败: {0} ({1})', msg, code);
            },

            'error': function () {
                KISP.alert('幸福图片加载错误: 网络繁忙，请稍候再试');
            },

            'success': function (data) {

                emitter.fire('success', [data]);
         
            },
        });


        api.get();
    }



    return {
        get: get,
        on: emitter.on.bind(emitter),
    };


});