﻿

define('/NewsDetail/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');


    var emitter = new Emitter();



    //获取数据
    function get(type, id) {


        var api = KISP.create('API', 'Paper.get', {
            //proxy: 'api/GetNewsDetail.js',
        });


        api.on({

            'response': function () {
                
            },

            'success': function (data, json, xhr) {


                emitter.fire('success', [{
                    'datetime': data.datetime,
                    'title': decodeURIComponent(data.title),
                    'content': decodeURIComponent(data.content),
                }]);

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
            'id': id,
        });


    }



    return {
        get: get,
        on: emitter.on.bind(emitter),
    };


});