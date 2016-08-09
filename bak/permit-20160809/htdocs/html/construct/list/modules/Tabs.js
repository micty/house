

define('/Tabs', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#ul-tabs');
    var tabs = null;
    var currentIndex;

    var list = [
        { key: 'todo', name: '待办任务', },
        { key: 'done', name: '已办列表', },
    ];


    panel.on('init', function () {

        tabs = KISP.create('Tabs', {
            container: panel.$.get(0),
            activedClass: 'on',
            eventName: 'click',
        });

        tabs.on('change', function (item, index) {
            currentIndex = index;
            item = list[index];
            
            panel.fire('change', item.key, []);
        });
    });



    panel.on('render', function (index) {
        if (index === undefined) {
            index = currentIndex;
        }
        index = index || 0;

        tabs.render(list, function (item, index) {
            return {
                'index': index,
                'name': item.name,
            };
        });


        tabs.active(index);
    });



    return panel.wrap();

});





