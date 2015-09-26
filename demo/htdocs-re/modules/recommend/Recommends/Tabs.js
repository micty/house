

define('/Recommends/Tabs', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');

    var panel = KISP.create('Panel');



    panel.on('init', function () {

        var tabs = KISP.create('Tabs', {
            container: '#ul-to-goods-list-tabs',
            activedClass: 'on',
            repeated: true, //允许重复激活相同的项，否则再次进来时会无反应

            list: [
                { type: 0, text: '待审核', },
                { type: 1, text: '已审核', },
                { type: -1, text: '已作废', },
            ],

            change: function (item, index) {
                panel.fire('change', [item.type]);
            },
        });

        tabs.active(0);

    });


    panel.on('render', function (list) {


    });



    return panel.wrap();



});