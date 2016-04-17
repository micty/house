
KISP.launch(function (require, module) {
    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');


    var Bridge = require('Bridge');

    var API = module.require('API');
    var List = module.require('List');
    var Tabs = module.require('Tabs');
    var Header = module.require('Header');

    var mask = null;

    Header.on({
        'add': function () {
            Bridge.open(['add', 'house2']);
        },
    });


    Tabs.on({
        'change': function (group) {
            List.render(group.items);
        },
    });


    API.on('success', {

        'get': function (list) {
            if (list.length == 0) {
                List.render(list);
            }

            Tabs.render(list);
        },

        'remove': function (list) {
            Tabs.render(list);
        },

        'post': function (list) {
            Tabs.render(list);
        },
    });

    List.on({
        'remove': function (item, index) {
            mask = mask || top.KISP.create('Mask');
            mask.show();

            var ok = confirm('【' + item.name + '】\n\n 确认要删除吗？');
            mask.hide();

            if (!ok) {
                return;
            }

            API.remove(item.id);
        },

        'edit': function (item, index) {
            Bridge.open(['add', 'house2'], {
                'id': item.id,
            });
        },
    });



    Header.render();
    API.get();


});
