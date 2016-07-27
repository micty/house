

define('/Done/Header', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    
    var panel = KISP.create('Panel', '#div-done-header', {
        showAfterRender: false,
    });
    
    panel.on('init', function () {

        panel.$.on('click', 'button', function () {

            panel.fire('submit');
        });
 

    });



    panel.on('render', function (show) {

        panel.toggle(show);
    });



    return panel.wrap();



});