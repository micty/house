

define('/Aside', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');

   


    var panel = KISP.create('Panel', '#div-panel-aside');


    panel.on('init', function () {

     
        panel.$.on('click', '[data-cmd="recommend"]', function () {

            panel.fire('recommend');

        });

    });


    panel.on('render', function () {

       
       
    });



    return panel.wrap();


});