

define('/NewsDetail/Header', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-news-detail-header');

    var type$name = {
        'news': '新闻资讯',
        'policy': '政策法规',
        'house': '楼盘房源',
    };

    panel.on('init', function () {

        



    });



    panel.on('render', function (type) {


        var name = type$name[type];

        panel.fill({
            'type': name,
        });
       
    });



    return panel.wrap();



});