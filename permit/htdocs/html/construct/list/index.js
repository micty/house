﻿
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

        'license.detail': function (item, index) {
            Bridge.open({
                name: '规划许可证详情',
                url: 'html/plan/license/detail/index.html?id=' + item.license.id,
            });
        },

        'edit': function (item, index) {
            Bridge.open(['construct', 'add'], {
                'licenseId': item.license.id,
            });
        },
    });


    Done.on({

        'land.detail': function (item, index) {
            Bridge.open({
                name: '土地出让详情',
                url: 'html/land/detail/index.html?id=' + item.landId,
            });
        },

        'plan.detail': function (item, index) {
            Bridge.open({
                name: '规划许可详情',
                url: 'html/plan/detail/index.html?id=' + item.plan.id,
            });
        },

        'construct.detail': function (item, index) {
           
            Bridge.open(['construct', 'add'], {
                'id': item.construct.id,
            });
        },

        'remove': function (item, index) {
            API.remove(item.id);
        },

        'edit': function (item, index) {
            Bridge.open(['construct', 'add'], {
                'id': item.construct.id,
            });
        },
    });
   

    API.get();
    
});
