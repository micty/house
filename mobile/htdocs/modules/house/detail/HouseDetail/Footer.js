

define('/HouseDetail/Footer', function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#footer-house-detail');

    panel.on('init', function () {

        panel.$.touch({
            'button': function () {
                var Signup = require('Signup');
                Signup.show();

            },
        });

    });


    panel.on('render', function (data) {


    });



    return panel.wrap();


});