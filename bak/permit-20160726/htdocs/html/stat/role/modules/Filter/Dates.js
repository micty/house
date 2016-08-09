define('/Filter/Dates', function (require, module) {

    var $ = require('$');
    var KISP = require('KISP');
    var DateTimePicker = require('DateTimePicker');


    var panel = KISP.create('Panel', '#li-filter-dates');


    var name$value = {};
    var toast = null;

    panel.on('init', function () {


        DateTimePicker.create('[data-type="date"]', {
            pickerPosition: 'bottom-right',

        });


        panel.$.on('change', '[data-type="date"]', function () {

            var name = this.name;
            var value = this.value;

            name$value[name] = value;

            var begin = name$value['begin'];
            var end = name$value['end'];

            //如果都指定了，则比较大小。
            if (begin && end) {
                begin = $.Date.parse(begin);
                end = $.Date.parse(end);

                if (begin > end) {
                    toast = toast || KISP.create('Toast', {
                        icon: 'times',
                        duration: 1500,
                    });

                    toast.show('开始日期不能比结束日期大');
                    return;
                }
            }


            //取回字符串形式。
            begin = name$value['begin'] || '';
            end = name$value['end'] || '';

            panel.fire('change', [begin, end]);


        });

    });





    panel.on('render', function () {


    });





    return panel.wrap();

});