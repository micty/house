﻿

define('/Title', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-title');
   


    panel.on('init', function () {

      
    });



    panel.on('render', function (data) {
        panel.fill(data);
    });



    return panel.wrap();

});





