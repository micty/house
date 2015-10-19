

define('/Recommend/Tabs', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel');
    var tabs = null;
    var list = [];

    panel.on('init', function () {

        var ul = document.getElementById('ul-recommend-tabs');

        tabs = KISP.create('Tabs', {
            container: ul,
            activedClass: 'on',
            repeated: true, //允许重复激活相同的项，否则再次进来时会无反应

            change: function (item, index) {
                panel.fire('change', [item]);

                var left = 430 - index * 78;
                
                $(ul).animate({
                    'padding-left': left,
                });
            },
        });



    });


    panel.on('render', function (groups) {

        list = groups;

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



    return panel.wrap({

        active: function (item) {

            var index = $.Array.findIndex(list, function (obj, index) {
                return obj.name == item.name;
            });

            if (index < 0) { //安全起见
                index = 0;
            }

            tabs.active(index);
        },
    });



});