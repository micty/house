

define('/Recommend/Footer', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-recommend-footer');


    panel.on('init', function () {

        var Signup = require('Signup');

        panel.$.on('click', 'button', function () {

            Signup.show();

        });

    });



    panel.on('render', function () {


    });



    return panel.wrap();



});