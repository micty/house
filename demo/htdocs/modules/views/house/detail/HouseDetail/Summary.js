

define('/HouseDetail/Summary', function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Albums = module.require('Albums');
    var Fields = module.require('Fields');

    var panel = KISP.create('Panel', '#div-house-detail-summary');

    panel.on('init', function () {

        Albums.on({
            'change': function (album, index) {

                panel.fire('change', [album]);
            },
        });

    });




    panel.on('render', function (data) {

        Albums.render(data);
        Fields.render(data);

    });





    return panel.wrap();


});