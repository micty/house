

define('/Header', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-panel-header');


    panel.on('init', function () {


        panel.$.on('click', '[data-cmd]', function (event) {

            var cmd = this.getAttribute('data-cmd');
            panel.fire(cmd);
        });
    });




    panel.on('render', function () {

       
    });

    panel.on('after-render', function () {

        panel.fire('render');
    });



    return panel.wrap();


});