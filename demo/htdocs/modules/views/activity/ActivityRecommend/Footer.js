

define('/ActivityRecommend/Footer', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-activity-recommend-footer');


    panel.on('init', function () {

        var ActivitySignup = require('ActivitySignup');

        panel.$.on('click', 'button', function () {

            ActivitySignup.show();

        });

    });



    panel.on('render', function () {


    });



    return panel.wrap();



});