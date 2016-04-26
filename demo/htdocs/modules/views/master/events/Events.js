

define('/Events', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var API = module.require('API');
    var News = module.require('News');
    var Notice = module.require('Notice');
    var Photos = module.require('Photos');

    var panel = KISP.create('Panel');


    panel.on('init', function () {

 


    });




    panel.on('render', function () {
        News.render();
        Photos.render();
        Notice.render();
       
    });



    return panel.wrap();


});