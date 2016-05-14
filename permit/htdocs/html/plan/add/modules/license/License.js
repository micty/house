

define('/License', function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');

    var API = module.require('API');
    var Dialog = module.require('Dialog');
    var Header = module.require('Header');
    var List = module.require('List');


    var current = null;
    var panel = KISP.create('Panel', '#div-panel-license');

    panel.on('init', function () {


        Header.on('add', function () {
            Dialog.render(current);
        });


        API.on('success', {

            'get': function (data) {
                List.render(data);
            },

            'remove': function (data) {
                List.render(data);
                panel.fire('change');
            },
            'post': function (data) {
                List.render(data);
                panel.fire('change');
            },
        });

        List.on({

            'detail': function (item, index) {
            },

            'remove': function (item, index) {
                API.remove(item.id);
            },

            'edit': function (item, index) {
                Dialog.render(item);
            },
        });

        Dialog.on('submit', function (data) {
            API.post(data);
        });

    });

    panel.on('render', function (planId) {

        current = {
            'planId': planId,
        };

        API.get(planId);
        Header.render();
    });


    return panel.wrap();


    
});
