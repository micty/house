

define('/NewsDetail/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');

    var emitter = new Emitter();
    var loading = null;


    //获取数据
    function get(type, id) {


        var api = KISP.create('API', 'Paper.get', {
            //proxy: 'api/GetNewsDetail.js',
        });


        api.on({

            'request': function () {
                loading = loading || KISP.create('Loading', {
                    text: '加载中...',
                    container: '#div-view-news-detail',
                });
                loading.show();
            },


            'response': function () {
                loading.hide();
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
                KISP.alert('网络繁忙，请稍候再试');
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