
define('/Table', function (require, module) {
    var $ = require('$');
    var KISP = require('KISP');
    var NumberField = require('NumberField');

    var panel = KISP.create('Panel', '#div-table');


    panel.on('init', function () {

        panel.template(['row', 'col'], function (data, index) {

            return {
                data: {
                    'total0': NumberField.text(data.total0),
                    'total1': NumberField.text(data.total1),
                },

                list: data.rows,

                fn: function (item, index) {

                    return {
                        data: {},
                        list: item,

                        fn: function (item, index) {

                            var value = NumberField.text(item.value) || '';
                            value = value.split(',').join('<span class="sep">,</span>');

                            return {
                                data: {
                                    'name': item.name,
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


        panel.fill(data);


    });



    return panel.wrap();


});