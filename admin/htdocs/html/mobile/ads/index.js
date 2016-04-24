
KISP.launch(function (require, module) {
    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');

    var API = module.require('API');
    var Header = module.require('Header');
    var Dialog = module.require('Dialog');
    var List = module.require('List');

    var mask = null;


    Header.on({
        'add': function () {
            Dialog.render();
        },
    });


    API.on('success', {
        'get': function (list) {
            Header.render();
            List.render(list);
        },
        'post': function (list) {
            List.render(list);
        },
        'remove': function (list) {
            List.render(list);
        },
    });

    List.on({
        'edit': function (item, index) {
            Dialog.render(item);
        },
        'remove': function (item) {
            API.remove(item.id);
        },
    });

    Dialog.on({
        'submit': function (data) {
            API.post(data);
        },

    });



    API.get();


});
