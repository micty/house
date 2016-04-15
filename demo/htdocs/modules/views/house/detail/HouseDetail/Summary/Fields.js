

define('/HouseDetail/Summary/Fields', function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-house-detail-summary-fields');

    panel.on('init', function () {

       

    });


    panel.on('render', function (data) {


        panel.fill(data);

    });



    return panel.wrap();


});