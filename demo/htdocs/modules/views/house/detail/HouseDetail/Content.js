

define('/HouseDetail/Content', function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var panel = KISP.create('Panel', '#div-house-detail-content');

    panel.on('init', function () {

        

    });


    panel.on('render', function (data) {


        data = $.Object.extend({}, data, {
            'news.text': data.news.text,
            'news.url': data.news.url,

            'content': decodeURIComponent(data.content),

            'map': $.Object.toQueryString(data.map),

        });

        panel.fill(data);


    });



    return panel.wrap();


});