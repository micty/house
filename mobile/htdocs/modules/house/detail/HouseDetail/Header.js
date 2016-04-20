

define('/HouseDetail/Header', function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-house-detail-header');

    panel.on('init', function () {

        

    });


    panel.on('render', function (data) {


        data = $.Object.extend({}, data, {

            'cover': (function(){
            
                var albums = data.albums;
                var album = albums[0];

                var cover = data.cover;

                if (!album) {
                    return cover;
                }

                var item = album.list[0];
                if (!item) {
                    return cover;
                }

                return item.url;

            })(),
        });

        panel.fill(data);

    });



    return panel.wrap();


});