

define('/NewsList/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Url = MiniQuery.require('Url');
    var Emitter = MiniQuery.require('Emitter');
    var emitter = new Emitter();
    var loading = null;


    //获取数据
    function get() {


        var api = KISP.create('API', 'Mobile.News.list', {
            //proxy: 'NewsList.js',
        });


        api.on({

            'request': function () {
                loading = loading || KISP.create('Loading', {
                    text: '加载中...',
                    container: '#div-view-news-list',
                });
                loading.show();
            },

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {


                var list = $.Array.keep(data, function (item) {

                    var url = item.url;
                    var qs = Url.getQueryString(url) || {};
                    var type = qs.type;
                    var id = qs.id;

                    if (type && id) {
                        delete item.url;
                        item.type = type;
                        item.id = id;
                    }
                    
                    return item;

                });
                

                emitter.fire('success', [{
                    'ads': list.slice(0, 2),
                    'list': list.slice(2),
                }]);
            },

            'fail': function (code, msg, json, xhr) {
                KISP.alert('获取数据失败: {0} ({1})', msg, code);
            },

            'error': function (code, msg, json, xhr) {
                KISP.alert('网络繁忙，请稍候再试');
            },
        });

        api.get();


    }



    return {
        get: get,
        on: emitter.on.bind(emitter),
    };


});