
define('/Table', function (require, module) {
    var $ = require('$');
    var KISP = require('KISP');
    var SessionStorage = require('SessionStorage');
    var NumberField = require('NumberField');

    var panel = KISP.create('Panel', '#div-table');
    var list = [];


    panel.on('init', function () {

        panel.template(['row', 'col'], function (data, index) {

            return {
                data: {

                },

                list: data.rows,

                fn: function (item, index) {

                    return {
                        data: {},
                        list: item,

                        fn: function (item, index) {

                            var value = NumberField.get(item.value);
                            value = value.split(',').join('<span class="sep">,</span>');

                            return {
                                data: {
                                    'text': item.text,
                                    'value': value,
                                    'group-class': item.group ? 'group' : '',
                                    'sub-group-class': item.subGroup ? 'sub-group' : '',
                                },
                            };
                        },
                    };
                },
            };
        });






    });


    panel.on('render', function (data) {


        list = data;

        //二级模板填充所需要的数据格式
        panel.fill({
            'rows': list,
        });


    });



    return panel.wrap();


});