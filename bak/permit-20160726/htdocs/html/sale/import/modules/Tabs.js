

define('/Tabs', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#ul-tabs');
    var tabs = null;

    var list = [
        { name: '预售许可证', },
        { name: '现售备案', },
    ];


    panel.on('init', function () {

        tabs = KISP.create('Tabs', {
            container: panel.$.get(0),
            activedClass: 'on',
            eventName: 'click',
            repeated: true,
        });

        tabs.on('change', function (item, index) {
            item = list[index];
            panel.fire('change', index, []);
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



    return panel.wrap({
        'active': function (index) {

            index = Number(index) || 0;
            tabs.active(index);
        },
    });

});





