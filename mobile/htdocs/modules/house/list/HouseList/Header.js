
define('/HouseList/Header', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var panel = KISP.create('Panel', '#div-house-list-header');


    panel.on('init', function () {

     
    });

    panel.on('render', function (data) {

        panel.fill(data);

    });


    return panel.wrap();


});


