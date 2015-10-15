

define('/NewsList/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');


    var emitter = new Emitter();



    //获取数据
    function get(type) {


        var api = KISP.create('API', 'Paper.list', {
            //proxy: 'api/GetNewsList.js',
        });


        api.on({

            'response': function () {
                emitter.fire('response');
            },

            'success': function (data, json, xhr) {

                var list = $.Array.keep(data, function (item, index) {

                    return $.Object.extend({}, item, {
                        'type': type,
                        'title': decodeURIComponent(item.title),
                        'date': item.datetime.split(' ')[0],
                    });

                });

                emitter.fire('success', [list]);

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
        });


    }



    return {
        get: get,
        on: emitter.on.bind(emitter),
    };


});