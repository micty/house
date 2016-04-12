

define('/Policy', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');

  

    var panel = KISP.create('Panel', '#div-panel-policy');

    panel.on('init', function () {

        panel.$.on('click', '[data-cmd="list"]', function () {
            panel.fire('list');
        });
       
    });


    panel.on('render', function () {

      
    });



    return panel.wrap();


});