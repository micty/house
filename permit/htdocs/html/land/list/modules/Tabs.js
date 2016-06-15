

define('/Tabs', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#ul-tabs');
    var tabs = null;

    var list = [
        { key: '', name: '全部', },
        { key: '南庄', name: '南庄镇', },
        { key: '石湾', name: '石湾镇街道', },
        { key: '张槎', name: '张槎街道', },
        { key: '祖庙', name: '祖庙街道', },
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





