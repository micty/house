
define('/Table', function (require, module) {
    var $ = require('$');
    var KISP = require('KISP');
    var SessionStorage = require('SessionStorage');
    var NumberField = require('NumberField');

    var panel = KISP.create('Panel', '#div-table');


    panel.on('init', function () {

        panel.template(['row', 'col'], function (data, index) {

            return {
                data: {
                    'total0': NumberField.text(data.total0),
                    'total1': NumberField.text(data.total1),

                    'total2': NumberField.text(data.total2),
                    'total3': NumberField.text(data.total3),

                    'total4': NumberField.text(data.total4),
                    'total5': NumberField.text(data.total5),
                },

                list: data.rows,

                fn: function (item, index) {

                    return {
                        data: {},
                        list: item,

                        fn: function (item, index) {

                            var value = NumberField.text(item.value) || '';
                            value = value.split(',').join('<span class="sep">,</span>');

                            var hidden = item.hidden;

                            return {
                                data: {
                                    'name': hidden ? '' : item.name,
                                    'value': hidden ? '' : value,
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