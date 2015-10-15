

define('/Happy', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var API = module.require('API');
    var Photos = module.require('Photos');

    var panel = KISP.create('Panel', '#div-panel-happy');


    panel.on('init', function () {

     

        API.on('success', function (data) {

            Photos.render(data);
        });


    

    });



    panel.on('render', function () {
       

        API.get();
        
    });



    return panel.wrap();



});