

define('/Events', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var News = module.require('News');
    var Photos = module.require('Photos');

    var panel = KISP.create('Panel');


    panel.on('init', function () {

 


    });




    panel.on('render', function () {
        News.render();
        Photos.render();
       
    });



    return panel.wrap();


});