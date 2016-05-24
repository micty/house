

define('/Base/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Size = require('Size');
    var $Object = require('$Object');

    var panel = KISP.create('Panel', '#div-base-form');
    var current = null;



    panel.on('init', function () {

    });


    panel.on('render', function (data) {

        current = data;

        data.license = Size.format(data.license);

        data.sale = data.sale || { //针对新增的情况。
            project: '',
            location: '',
        };

        data = $Object.linear(data);

        panel.fill(data);

  

    });


    return panel.wrap();


});