

define('/NewsList/Header', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-news-list-header');

    var type$name = {
        'news': '新闻',
        'policy': '政策',
        'house': '楼盘',
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