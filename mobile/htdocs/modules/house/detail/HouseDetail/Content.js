

define('/HouseDetail/Content', function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Url = MiniQuery.require('Url');


    var panel = KISP.create('Panel', '#div-house-detail-content');

    panel.on('init', function () {

        

    });


    panel.on('render', function (data) {

        var url = KISP.data('demo').map;
        url = Url.addQueryString(url, data.map);


        data = $.Object.extend({}, data, {
            'news.text': data.news.text,
            'news.url': data.news.url,

            'content': decodeURIComponent(data.content),

            'iframe': url,

        });

        panel.fill(data);


    });



    return panel.wrap();


});