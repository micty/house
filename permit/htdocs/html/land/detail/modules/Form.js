

define('/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Size = require('Size');
    var NumberField = require('NumberField');

   
    var panel = KISP.create('Panel', '#div-form');





    panel.on('init', function () {

      
    });



    panel.on('render', function (data) {


        data = Size.format(data);

        data.size = Size.text(data, 'size');
        data.price = NumberField.money(data.price);

        panel.fill(data);

       

    });


    return panel.wrap();


});