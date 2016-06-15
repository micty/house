
KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');

    var API = module.require('API');
    var Todo = module.require('Todo');
    var Done = module.require('Done');
    var Tabs = module.require('Tabs');


    var current = null;


    Tabs.on('change', {
        'todo': function () {
            Done.hide();
            Todo.render(current.todo);
        },
        'done': function () {
            Todo.hide();
            Done.render(current.done);
        },
    });

    API.on('success', {
        'get': function (data) {

            current = data;
            Tabs.render(0);
            
        },

        'remove': function () {
            API.get();
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

        'land.detail': function (item, index) {
            Bridge.open({
                name: '土地出让详情',
                url: 'html/land/detail/index.html?id=' + item.landId,
            });
        },

        'detail': function (item, index) {
            Bridge.open({
                name: '规划许可详情',
                url: 'html/plan/detail/index.html?id=' + item.id,
            });
        },

        'remove': function (item, index) {
            API.remove(item.id);
        },

        'edit': function (item, index) {
 
            Bridge.open(['plan', 'add'], {
                'id': item.id,
            });
        },
    });
   




    API.get();
    
});
