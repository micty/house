
define('/Table', function (require, module) {
    var $ = require('$');
    var KISP = require('KISP');
    var NumberField = require('NumberField');

    var panel = KISP.create('Panel', '#div-table');


    panel.on('init', function () {

        panel.template(['row'], function (data, index) {

            var list = data.list.concat(data.stat);
            var maxIndex = list.length - 1;

            return {
                data: {},

                list: list,

                fn: function (item, index) {

                    //最后一行是总计。
                    var isStat = index == maxIndex;

                    var data = {
                        'row-class': isStat ? 'stat' : '',
                        'order': isStat ? '总计' : index + 1,
                    };

                    $.Object.each(item, function (key, value) {
                        if (typeof value == 'number') {
                            var isMinus = value < 0;

                            value = NumberField.text(value) || '';
                            value = value.split(',').join('<span class="sep">,</span>');

                            if (isMinus) {
                                value = '<span class="minus">' + value +  '</span>';
                            }
                        }

                        data[key] = value;
                    });


                    return {
                        'data': data,
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