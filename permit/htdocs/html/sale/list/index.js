
KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');

    var API = module.require('API');
    var Todo = module.require('Todo');
    var Done = module.require('Done');


    API.on('success', {
        'get': function (data) {
            Todo.render(data.todos);
            Done.render(data.dones);
        },

        'remove': function () {
            API.get();
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
       
        'edit': function (item, index) {
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

        'remove': function (item, index) {
            API.remove(item.sale.id);
        },

        'edit': function (item, index) {
            Bridge.open(['sale', 'add'], {
                'id': item.sale.id,
            });
        },
    });


    API.get();

});
