

define('/List', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#ul-items');
    var list = [];
    var template = null;
 


    panel.on('init', function () {



        template = KISP.create('Template', '#ul-items', {
            names: ['field'],
            
            fn: function (item, index) {

                return {
                    data: {
                        'index': index,
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




        panel.$.on('click', '[data-cmd]', function (event) {

            var btn = this;
            var index = btn.getAttribute('data-index');
            var cmd = btn.getAttribute('data-cmd');
            var item = list[index];
            panel.fire(cmd, [item, index]);

        });

    });


    panel.on('render', function (data) {

        list = data;
        list = list.sort(function (a, b) {

            a = a.priority || 0;
            b = b.priority || 0;
            return a - b;
        });

  
        template.fill(list);


        if (list.length == 0) {
            panel.$.addClass('nodata');
            panel.$.html('<li>暂无数据</li>');
        }
        else {
            panel.$.removeClass('nodata');
        }

    });



    return panel.wrap();


});