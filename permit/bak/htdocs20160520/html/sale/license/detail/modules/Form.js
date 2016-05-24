

define('/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var NumberField = require('NumberField');

   
    var panel = KISP.create('Panel', '#div-form');



    panel.on('render', function (data) {

        var totalSize = 0;

        $.Array.each([
            'commerceSize',
            'residenceSize',
            'officeSize',
            'otherSize',

        ], function (item) {

            totalSize += Number(data[item]);
        });

        data.totalSize = totalSize;


        var totalCell = 0;

        $.Array.each([
            'commerceCell',
            'residenceCell',
            'officeCell',
            'otherCell',

        ], function (item) {

            totalCell += Number(data[item]);
        });

        data.totalCell = totalCell;

        panel.fill(data);

        new NumberField('[data-type="number"]');
    



    });


    return panel.wrap();

});