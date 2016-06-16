﻿
KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');

    var API = module.require('API');
    var Header = module.require('Header');
    var Dialog = module.require('Dialog');
    var Todo = module.require('Todo');
    var Done = module.require('Done');
    var Tabs = module.require('Tabs');


    var lists = []; //列表的数组。


    Header.on('import', function () {
        Dialog.render();
    });


    Dialog.on('submit', function (type, items) {
        lists[type] = items;
        Tabs.active(type);
    });


    Tabs.on('change', {
        0: function () {
            Done.hide();
            Todo.render(lists[0]);
        },
        1: function () {
            Todo.hide();
            Done.render(lists[1]);
        },
    });

    Todo.on({
        'detail': function (item) {
            API.get(item.land);
        },
        'submit': function (list) {
            API.post(0, list);
        },
    });

    Done.on({
        'detail': function (item) {
            API.get(item.land);
        },
        'submit': function (list) {
            API.post(1, list);
        },
    });

    API.on('success', {
        'get': function (item) {
            Bridge.open({
                name: '土地出让详情',
                url: 'html/land/detail/index.html?id=' + item.id,
            });
        },
        'post': function (type) {
            lists[type] = [];
            Tabs.active(type);

            Bridge.refresh(['sale', 'list']);
        },
    });


    Header.render();
    Tabs.render();
 


});
