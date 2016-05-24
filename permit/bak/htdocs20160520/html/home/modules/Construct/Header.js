

define('/Construct/Header', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');
    var SessionStorage = require('SessionStorage');
    var user = SessionStorage.get('user');

    var Bridge = require('Bridge');
    
    var panel = KISP.create('Panel', '#div-construct-header');
    
    panel.on('init', function () {

        panel.$.on('click', 'a', function () {

            //panel.fire('more');

            Bridge.open(['construct', 'list']);
        });
 

    });



    panel.on('render', function () {

       

    });



    return panel.wrap();



});