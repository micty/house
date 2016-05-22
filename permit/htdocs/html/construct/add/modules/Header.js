

define('/Header', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');
    var SessionStorage = require('SessionStorage');
    var user = SessionStorage.get('user');

    
    var panel = KISP.create('Panel', '#div-header');
    
    panel.on('init', function () {

        panel.$.on('click', 'button', function () {
            panel.fire('save');
        });
 
    });



    panel.on('render', function () {



    });



    return panel.wrap();



});