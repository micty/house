

define('/License', function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');

    var API = module.require('API');
    var List = module.require('List');

    var panel = KISP.create('Panel', '#div-panel-license');

    panel.on('init', function () {


        API.on('success', {
            'get': function (data) {
                List.render(data);
            },
        });

        List.on({

            'detail': function (item, index) {
                panel.fire('detail', [item.id]);
            },

        });


    });

    panel.on('render', function (planId) {

        API.get(planId);
    });


    return panel.wrap();


    
});
