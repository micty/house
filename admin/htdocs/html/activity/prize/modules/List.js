

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
                                'index': index,
                                'no': index + 1,
                                'name': item.name,
                                'phone': item.phone,
                                'intent': item.intent,
                                'datetime': item.datetime,
                                'prize': item.prize,

                            },
                        };
                    },
                };
            }
        });

    });


    panel.on('render', function (data) {


        list = data;

        //二级模板填充所需要的数据格式
        template.fill([
            {
                items: list,
            },
        ]);

        panel.$.toggleClass('nodata', list.length == 0);

    });



    return panel.wrap();


});