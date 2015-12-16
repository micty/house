﻿

define('/Houses', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var List = module.require('List');


    var panel = KISP.create('Panel', '#div-panel-houses');


    panel.on('init', function () {

        List.on({
            'click': function (item, index) {
                panel.fire('item', [item, index]);
            },
        });

        panel.$.on('click', '[data-cmd="activity"]', function (event) {
            panel.fire('activity');
        });
    });



    panel.on('render', function () {

        List.render();

    });



    return panel.wrap();


});