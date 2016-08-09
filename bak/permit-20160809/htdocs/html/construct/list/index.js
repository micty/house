
KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');

    var Todo = module.require('Todo');
    var Done = module.require('Done');
    var Tabs = module.require('Tabs');


    var current = null;


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
        'land.detail': function (item) {
            Bridge.open({
                name: '土地出让详情',
                url: 'html/land/detail/index.html?id=' + item.land.id,
            });
        },

        'plan.detail': function (item) {
            Bridge.open({
                name: '规划许可详情',
                url: 'html/plan/detail/index.html?id=' + item.plan.id,
            });
        },

        'license.detail': function (item) {
            Bridge.open({
                name: '规划许可证详情',
                url: 'html/plan/license/detail/index.html?id=' + item.license.id,
            });
        },

        'edit': function (item) {
            Bridge.open(['construct', 'add'], {
                'licenseId': item.license.id,
            });
        },
    });


    Done.on({

        'land.detail': function (item) {
            Bridge.open({
                name: '土地出让详情',
                url: 'html/land/detail/index.html?id=' + item.land.id,
            });
        },

        'plan.detail': function (item) {
            Bridge.open({
                name: '规划许可详情',
                url: 'html/plan/detail/index.html?id=' + item.plan.id,
            });
        },
        'license.detail': function (item) {
            Bridge.open({
                name: '规划许可证详情',
                url: 'html/plan/license/detail/index.html?id=' + item.license.id,
            });
        },

        'detail': function (item) {
            Bridge.open({
                name: '施工许可证详情',
                url: 'html/construct/detail/index.html?id=' + item.construct.id,
            });
        },


        'edit': function (item) {
            Bridge.open(['construct', 'add'], {
                'id': item.construct.id,
            });
        },
    });
   
    Bridge.on({
        'search': function (keyword) {
            current.render(keyword);
        },
    });


    Tabs.render();

   
    
});
