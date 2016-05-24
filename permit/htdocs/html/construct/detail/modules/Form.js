

define('/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Size = require('Size');
    var NumberField = require('NumberField');

    var $Object = require('$Object');


    var panel = KISP.create('Panel', '#div-form');







    panel.on('fill', function () {

    });


    panel.on('render', function (data) {


        var license = data.license;

        license = $.Object.extend({}, license, {
            'totalSize0': Size.totalText(license, 0),
            'totalSize1': Size.totalText(license, 1),
            'totalSize': Size.totalText(license),
        });

        data.license = Size.format(license);


        data = $Object.linear(data);
        panel.fill(data);


    });


    return panel.wrap();


});