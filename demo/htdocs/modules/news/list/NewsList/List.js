

define('/NewsList/List', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#ul-news-list');
    var list = [];


    panel.on('init', function () {



    });


    panel.on('render', function (data) {

        
        list = data;

        panel.fill(list, function (item, index) {

            return {
                'index': index,
                'type': item.type,
                'title': item.title,
                'id': item.id,
                'date': item.date,
            };
        });

    });



    return panel.wrap();


});