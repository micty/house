﻿

define('/Header', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');
    var User = require('User');

    
    var panel = KISP.create('Panel', '#div-header');
    
    panel.on('init', function () {

        panel.$.on('click', 'button', function () {
            panel.fire('edit');
        });
 
    });



    panel.on('render', function () {

        panel.$.toggleClass('noop', !User.is('construct'));


    });


    return panel.wrap();



});