

define('/Events/News', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#ul-events-news');

    var list = [];
    var api = null;
    var type = 'news';
    var loading = null;
    var maxCount = 9; //最多显示条数


    panel.on('init', function () {

      
        loading = KISP.create('Loading', {
            text:'新闻列表加载中...',
        });



        api = KISP.create('API', 'EventsNews.list');

        api.on({
            'response': function () {
                loading.hide();
            },

            'fail': function (code, msg, json, xhr) {

                KISP.alert('新闻列表加载失败: {0} ({1})', msg, code);

            },

            'error': function (code, msg, json, xhr) {
                if (!json) { // http 协议连接错误
                    msg = '新闻列表加载错误: 网络繁忙，请稍候再试';
                }

                KISP.alert(msg);
            },

            'success': function (data) {

                data.sort(function (a, b) {
                    a = a.priority || 0;
                    b = b.priority || 0;
                    return a - b;
                });

                list = data.slice(0, maxCount);
      
                panel.fill(list, function (item, index) {

                    return {
                        'title': item.title,
                        'url': item.url,
                    };
                });
            },
        });



    });


    panel.on('render', function () {
       
        loading.show();


        api.get();
        
    });



    return panel.wrap();



});