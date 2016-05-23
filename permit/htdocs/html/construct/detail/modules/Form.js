

define('/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Size = require('Size');
    var NumberField = require('NumberField');

    var $Object = require('$Object');


    var panel = KISP.create('Panel', '#div-form');
    var current = null;






    panel.on('fill', function () {

    });


    panel.on('render', function (data) {


        current = data;

        data.license = Size.format(data.license);
        data = $Object.linear(data);

        panel.fill(data);


    });


    return panel.wrap();


});