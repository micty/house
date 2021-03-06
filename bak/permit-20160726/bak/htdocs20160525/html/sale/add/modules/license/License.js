﻿

define('/License', function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');

    var API = module.require('API');
    var Prepare = module.require('Prepare');
    var Doing = module.require('Doing');
 


    var current = null;
    var panel = KISP.create('Panel', '#div-panel-license');

    panel.on('init', function () {



        API.on('success', {
            'get': function (a, b) {
                Prepare.render(a);
                Doing.render(b);
            },

            'remove': function () {
                API.get(current.saleId);
            },
        });

        Prepare.on({
            'add': function () {
                panel.fire('add', [0, current.saleId]);
            },
            'detail': function (item) {
                panel.fire('detail', [item]);
            },

            'edit': function (item) {
                panel.fire('edit', [item]);
            },

            'remove': function (item) {
                API.remove(item.id);
            },
        });


        Doing.on({
            'add': function () {
                panel.fire('add', [1, current.saleId]);
            },
            'detail': function (item) {
                panel.fire('detail', [item]);
            },

            'edit': function (item) {
                panel.fire('edit', [item]);
            },

            'remove': function (item) {
                API.remove(item.id);
            },
        });
      

    });



    panel.on('render', function (saleId) {


        current = { 'saleId': saleId, };

        API.get(saleId);

    });




    return panel.wrap();


    
});
