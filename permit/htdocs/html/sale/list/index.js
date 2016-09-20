
KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');


    var Header = module.require('Header');
    var Todo = module.require('Todo');
    var Done = module.require('Done');
    var Tabs = module.require('Tabs');


    var current = null;


    Header.on('import', function (cmd) {
        Bridge.open(['sale', 'import', cmd]);
    });



    Tabs.on('change', {
        'todo': function () {
            Done.hide();
            Todo.render();
            current = Todo;
        },
        'done': function () {
            Todo.hide();
            Done.render();
            current = Done;
        },
    });


    Todo.on({
        'land.detail': function (item, index) {
            Bridge.open({
                name: '土地出让详情',
                url: 'html/land/detail/index.html?id=' + item.land.id,
            });
        },

        'plan.detail': function (item, index) {
            Bridge.open({
                name: '规划许可详情',
                url: 'html/plan/detail/index.html?id=' + item.plan.id,
            });
        },
       
        'edit': function (item) {
            Bridge.open(['sale', 'add'], {
                'planId': item.plan.id,
            });
        },
    });


    Done.on({

        'land.detail': function (item, index) {
            Bridge.open({
                name: '土地出让详情',
                url: 'html/land/detail/index.html?id=' + item.land.id,
            });
        },

        'plan.detail': function (item, index) {
            Bridge.open({
                name: '规划许可详情',
                url: 'html/plan/detail/index.html?id=' + item.plan.id,
            });
        },

        'detail': function (item, index) {
            Bridge.open({
                name: '销售许可详情',
                url: 'html/sale/detail/index.html?id=' + item.sale.id,
            });
        },


        'edit': function (item) {
            Bridge.open(['sale', 'add'], {
                'id': item.sale.id,
            });
        },
    });


    Bridge.on({
        'search': function (keyword) {
            current.render(keyword);
        },
    });

    Header.render();


    var qs = Url.getQueryString(window) || {};
    var tab = Number(qs.tab) || 0;
    Tabs.render(tab);


});
