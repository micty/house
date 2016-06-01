

define('/Tabs', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#ul-tabs');
    var tabs = null;

    var list = [
        { key: 'land', name: '土地', },
        { key: 'plan', name: '规划', },
        { key: 'construct', name: '建设', },
        { key: 'sale', name: '销售', },
    ];


    panel.on('init', function () {

        tabs = KISP.create('Tabs', {
            container: panel.$.get(0),
            activedClass: 'on',
            eventName: 'click',
        });

        tabs.on('change', function (item, index) {
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

        index = index || 0;

        tabs.active(index);
    });



    return panel.wrap();

});





