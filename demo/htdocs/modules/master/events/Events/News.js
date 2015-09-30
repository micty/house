

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



        api = KISP.create('API', 'Paper.list');

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

                data = data.slice(0, maxCount);

                list = $.Array.keep(data, function (item, index) {
                    item.title = decodeURIComponent(item.title);
                    return item;
                });

                panel.fill(list, function (item, index) {

                    return {
                        'type': type,
                        'id': item.id,
                        'title': item.title,
                    };
                });
            },
        });



    });


    panel.on('render', function () {
       
        loading.show();


        api.get({
            'type': type,
          
        });
        
    });



    return panel.wrap();



});