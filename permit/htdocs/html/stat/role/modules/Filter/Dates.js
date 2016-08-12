define('/Filter/Dates', function (require, module) {

    var $ = require('$');
    var KISP = require('KISP');
    var Template = KISP.require('Template');
    var DateTimePicker = require('DateTimePicker');


    var panel = KISP.create('Panel', '#li-filter-dates');
    var span = panel.$.find('span').get(0);

    var name$value = {};
    var toast = null;

    var role$title = {
        land: '土地竞得时间',
        plan: '规划许可时间',
        construct: '施工许可时间',
        sale: '已售记录提交时间',
    };

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





    panel.on('render', function (data) {
        var title = role$title[data.key];

     

        Template.fill(span, {
            'title': title,

        });

    });





    return panel.wrap();

});