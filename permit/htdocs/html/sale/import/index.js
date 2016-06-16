
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


    var lists = [
        window['__list__'],
        window['__list__'],
    ];



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
        'submit': function (list) {
            API.post(0, list);
        },
    });

    Done.on({
        'submit': function (list) {
            API.post(1, list);
        },
    });

    API.on('success', {
        'post': function (type) {
            lists[type] = [];
            Tabs.active(type);
        },
    });


    Header.render();
    Tabs.render();
 


});
