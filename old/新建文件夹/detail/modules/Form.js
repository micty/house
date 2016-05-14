

define('/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var NumberField = require('NumberField');

   
    var panel = KISP.create('Panel', '#div-form');



    panel.on('render', function (data) {

        
        var license = data.license;
        var land = data.land;
        var construct = data.construct;

        var totalSize = 0;

        $.Array.each([
            'commerceSize',
            'residenceSize',
            'officeSize',
            'otherSize',

        ], function (item) {

            totalSize += Number(license[item]);
        });


        data = $.Object.extend({}, license, {
            'land.number': land.number,
            'land.town': land.town,
            'construct.project': construct.project,
            'totalSize': totalSize,

        });

        panel.fill(data);

        new NumberField('[data-type="number"]');



    });


    return panel.wrap();

});