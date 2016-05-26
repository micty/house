

define('/Base/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Size = require('Size');
    var $Object = require('$Object');

    var panel = KISP.create('Panel', '#div-base-form');


    panel.on('init', function () {

    });


    panel.on('render', function (data) {

        data = $Object.linear(data);
        panel.fill(data);

    });


    return panel.wrap();


});