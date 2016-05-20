
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
         
            Todo.render(data.todo);
            Done.render(data.done);
        },

        'remove': function () {
            API.get();
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
            Bridge.open(['sale', 'add'], {
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
                name: '预售许可详情',
                url: 'html/sale/detail/index.html?id=' + item.id,
            });
        },

        'remove': function (item, index) {
            API.remove(item.id);
        },

        'edit': function (item, index) {
 
            Bridge.open(['sale', 'add'], {
                'id': item.id,
            });
        },
    });
   

    API.get();
    
});
