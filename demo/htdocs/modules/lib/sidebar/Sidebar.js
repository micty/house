

define('Sidebar', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');



    var panel = KISP.create('Panel', '#div-panel-sidebar');


    panel.on('init', function () {

        panel.$.on('click', '[data-cmd]', function (event) {

            var cmd = this.getAttribute('data-cmd');
            panel.fire(cmd);
        });
    });




    panel.on('render', function () {


    });



    return panel.wrap();


});