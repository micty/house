

define('/Tabs', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel');
    var tabs = null;

    panel.on('init', function () {

        var ul = document.getElementById('ul-tabs');

        tabs = KISP.create('Tabs', {
            container: ul,
            activedClass: 'on',
            eventName: 'click',

            change: function (item, index) {
                panel.fire('change', [item]);

               
            },
        });


    });


    panel.on('render', function (list) {


        tabs.render(list, function (item, index) {
            return {
                'index': index,
                'name': item.name,
            };
        });

        if (list.length > 0) {
            tabs.active(0);
        }

    });



    return panel.wrap();



});