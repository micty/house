

define('/Tabs', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#ul-tabs');
    var tabs = null;


    var list = [
        { key: 'residenceSize', name: '住宅', },
        { key: 'commerceSize', name: '商业', },
        { key: 'officeSize', name: '办公', },
        { key: 'otherSize', name: '计容面积其它', },
        { key: 'parkSize', name: '地下车库', },
        { key: 'otherSize1', name: '不计容面积其它', },

        { key: 'diy', name: '自建房', },
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





