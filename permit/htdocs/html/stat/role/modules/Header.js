

define('/Header', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-header');
   


    panel.on('init', function () {

      
    });



    panel.on('render', function (data) {
        panel.fill(data);
    });



    return panel.wrap();

});





