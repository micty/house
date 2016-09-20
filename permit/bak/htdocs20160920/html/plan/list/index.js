﻿
KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');

    var Tabs = module.require('Tabs');
    var Todo = module.require('Todo');
    var Done = module.require('Done');

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
        'detail': function (item) {
            Bridge.open({
                name: '土地出让详情',
                url: 'html/land/detail/index.html?id=' + item.id,
            });
        },
        'edit': function (item) {
            Bridge.open(['plan', 'add'], {
                'landId': item.id,
            });
        },
    });


    Done.on({

        'land.detail': function (item) {
            Bridge.open({
                name: '土地出让详情',
                url: 'html/land/detail/index.html?id=' + item.landId,
            });
        },

        'detail': function (item) {
            Bridge.open({
                name: '规划许可详情',
                url: 'html/plan/detail/index.html?id=' + item.id,
            });
        },

        'edit': function (item) {
 
            Bridge.open(['plan', 'add'], {
                'id': item.id,
            });
        },
    });
   

    Bridge.on({
        'search': function (keyword) {
            current.render(keyword);
        },
    });


    var qs = Url.getQueryString(window) || {};
    var tab = Number(qs.tab) || 0;
    Tabs.render(tab);
    
});
