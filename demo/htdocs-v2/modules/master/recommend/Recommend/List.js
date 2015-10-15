

define('/Recommend/List', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel');

    var list = [];
    var template = null;

    panel.on('init', function () {

      
        template = KISP.create('Template', '#ul-recommend-items', {
            //container: '#ul-recommend-items',
            names: ['field'],

            fn: function (item, index) {

                return {
                    data: {
                        'name': item.name,
                        'src': item.src,
                        'href': item.href || 'javascript:',
                    },

                    list: item.fields,

                    fn: function (field, k) {
                        return {
                            data: {
                                'name': field.name,
                                'value': field.value,
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