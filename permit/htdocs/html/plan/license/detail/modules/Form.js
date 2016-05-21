

define('/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Size = require('Size');
    var NumberField = require('NumberField');

   
    var panel = KISP.create('Panel', '#div-form');



    panel.on('render', function (data) {



        data = Size.format(data);

        panel.fill(data);




    });


    return panel.wrap();

});