

define('/SaleTabs', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#ul-sale-tabs');
    var tabs = null;
    var currentIndex = 0;

    var list = [
        { key: '', name: '已办预售许可', },
        { key: '', name: '预售已售面积', },
        { key: '', name: '已办现售备案', },
        { key: '', name: '现售已售面积', },
    ];


    panel.on('init', function () {

        tabs = KISP.create('Tabs', {
            container: panel.$.get(0),
            activedClass: 'on',
            eventName: 'click',
            repeated: true,
        });

        tabs.on('change', function (item, index) {
            currentIndex = index;
            item = list[index];
            panel.fire('change', [item, index]);
        });
    });



    panel.on('render', function (index) {
        tabs.render(list, function (item, index) {
            return {
                'index': index,
                'name': item.name,
            };
        });

        if (index === undefined) {
            index = currentIndex;
        }

        tabs.active(index);
    });



    return panel.wrap();

});





