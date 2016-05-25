

define('/License/Prepare/Header', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');
    var SessionStorage = require('SessionStorage');
    var user = SessionStorage.get('user');

    
    var panel = KISP.create('Panel', '#div-license-prepare-header');
    
    panel.on('init', function () {

        panel.$.on('click', 'button', function () {

            panel.fire('add');
        });
 

    });



    panel.on('render', function (showOperate) {

        panel.$.toggleClass('noop', !showOperate);


    });


    return panel.wrap();



});