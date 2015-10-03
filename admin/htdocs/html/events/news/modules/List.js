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
                                'index': index,
                                'title': item.title,
                                'id': item.id,
                                'url': item.url,
                                'priority': item.priority,
                            },
                        };
                    },
                };
            }
        });




        panel.$.on('click', '[data-cmd]', function (event) {

            var btn = this;
            var index = btn.getAttribute('data-index');
            var cmd = btn.getAttribute('data-cmd');
            var item = list[index];
     
            panel.fire(cmd, [item, index]);

        });

    });


    panel.on('render', function (data) {

        
        data = data.sort(function (a, b) {

            a = a.priority || 0;
            b = b.priority || 0;
            return a - b;
        });

        list = data;

        //二级模板填充所需要的数据格式
        template.fill([
            {
                items: list,
            },
        ]);

        panel.$.toggleClass('nodata', list.length == 0);

    });



    return panel.wrap({

        remove: function (index) {
            panel.$.find('tr[data-index="' + index + '"]').slideUp(function () {

                list.splice(index, 1);
                panel.render(list);

            });
        },
    });


});