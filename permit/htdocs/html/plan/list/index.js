
KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');

    var API = module.require('API');
    var Header = module.require('Header');
    var Todo = module.require('Todo');
    var Done = module.require('Done');

    var currentIndex = -1;

    Header.on('add', function () {
        Bridge.open(['plan', 'add']);
    });


    API.on('success', {
        'get': function (data) {
            Todo.render(data.todo);
            Done.render(data.done);
        },

        'remove': function () {
            Done.remove(currentIndex);
        },
    });


    Todo.on({
        'detail': function (item, index) {
            Bridge.open({
                name: '土地出让详情',
                url: 'html/land/detail/index.html?id=' + item.id,
            });
        },
        'edit': function (item, index) {
            Bridge.open(['plan', 'add'], {
                'landId': item.id,
            });
        },
    });


    Done.on({

        'detail': function (item, index) {
            Bridge.open({
                name: '规划许可详情',
                url: 'html/plan/detail/index.html?id=' + item.id,
            });
        },

        'remove': function (item, index) {
            currentIndex = index;
            API.remove(item.id);
        },

        'edit': function (item, index) {
 
            Bridge.open(['plan', 'add'], {
                'id': item.id,
            });
        },
    });
    

   
    Header.render();
    API.get();
    
});
