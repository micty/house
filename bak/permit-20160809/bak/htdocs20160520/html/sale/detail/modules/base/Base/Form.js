

define('/Base/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var NumberField = require('NumberField');

    var panel = KISP.create('Panel', '#div-base-form');
    var current = null;


    panel.on('init', function () {


    });






    panel.on('render', function (data) {


        current = data;

        var land = data.land;
        var sale = data.sale;


        var obj = $.Object.extend({}, sale, {
            'land.number': land.number,
            'land.town': land.town,
        });



        var totalSize = 0;

        $.Array.each([
            'commerceSize',
            'residenceSize',
            'officeSize',
            'otherSize',

        ], function (key) {

            var value = sale[key];
            value = Number(value);
            
            obj[key] = NumberField.get(value);

            totalSize += value;

        });


        obj.totalSize = NumberField.get(totalSize);


        var totalCell = 0;

        $.Array.each([
            'commerceCell',
            'residenceCell',
            'officeCell',
            'otherCell',

        ], function (key) {

            var value = sale[key];
            value = Number(value);

            obj[key] = NumberField.get(value);

            totalCell += value;

        });


        obj.totalCell = NumberField.get(totalCell);

    

        panel.fill(obj);

      

    });


    return panel.wrap();


});