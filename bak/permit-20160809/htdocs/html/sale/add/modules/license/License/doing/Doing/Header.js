﻿

define('/License/Doing/Header', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');

    
    var panel = KISP.create('Panel', '#div-license-doing-header');
    
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