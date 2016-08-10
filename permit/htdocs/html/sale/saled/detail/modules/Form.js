

define('/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Size = require('Size');
    var Cell = require('Cell');
    var $Object = require('$Object');
    var NumberField = require('NumberField');

   
    var panel = KISP.create('Panel', '#div-form');



    panel.on('render', function (data) {

        var license = data.license;
        var saled = data.saled;

        data = $Object.linear(data);

        data = $.Object.extend({}, data, {
            'typeName': license.type == 0 ? '预售许可证号' : '现售备案证号',
            'totalSize0': Size.totalText(saled, 0),
            'totalSize1': Size.totalText(saled, 1),
            'totalSize': Size.totalText(saled),
            'totalCell': Cell.totalText(saled),
        });


        data = Size.format(data);



        panel.fill(data);




    });


    return panel.wrap();

});