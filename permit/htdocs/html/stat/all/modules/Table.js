
define('/Table', function (require, module) {
    var $ = require('$');
    var KISP = require('KISP');
    var SessionStorage = require('SessionStorage');
    var NumberField = require('NumberField');

    var panel = KISP.create('Panel', '#div-table');


    panel.on('init', function () {


        function toText(value) {
            value = value / 10000;

            value = NumberField.text(value, {
                decimalCount: 1,        //小数的位数
            }) || '';

            value = value.split(',').join('<span class="sep">,</span>');

            return value;
        }


        panel.template(['row', 'col'], function (data, index) {

            return {
                data: {
                    'total0': toText(data.total0),
                    'total1': toText(data.total1),

                    'total2': toText(data.total2),
                    'total3': toText(data.total3),

                    'total4': toText(data.total4),
                    'total5': toText(data.total5),
                },

                list: data.rows,

                fn: function (item, index) {

                    return {
                        data: {},
                        list: item,

                        fn: function (item, index) {

                            var value = toText(item.value);
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