

define('/HouseDetail/Header', function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-house-detail-header');
    var template = null;

    panel.on('init', function () {

        var container = panel.$.get(0);

        template = KISP.create('Template', container, {

            names: ['tag'], //子级标记列表

            fn: function (data, index) {

                return {
                    data: {
                        'name': data.name,
                        'area': data.area,
                        'ads': data.ads,
                    },

                    list: data.tags,

                    fn: function (item, index) {
                        return {
                            data: {
                                'index': index,
                                'tag': item,
                            },
                        };
                    },
                };
            }
        });

    });


    panel.on('render', function (data) {


        template.fill(data);


    });



    return panel.wrap();


});