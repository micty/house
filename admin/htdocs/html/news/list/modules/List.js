﻿

define('/List', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-list');
    var list = [];
    var template = null;


    panel.on('init', function () {


        template = KISP.create('Template', '#div-list', {
       
            names: ['row'],

            fn: function (item, index) {

                return {
                    data: {},

                    list: item.items,

                    fn: function (item, index) {
                        return {
                            data: {
                                'no': index + 1,
                                'title': item.title,
                                'datetime': item.datetime,

                            },
                        };
                    },
                };
            }
        });

    });


    panel.on('render', function (data) {

        
        list = data;
        template.fill(list);

    });



    return panel.wrap();


});