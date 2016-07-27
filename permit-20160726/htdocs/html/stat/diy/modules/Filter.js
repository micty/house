
define('/Filter', function (require, module) {

    var $ = require('$');
    var KISP = require('KISP');

    var Dates = module.require('Dates');

    var panel = KISP.create('Panel', '#ul-filter');


    panel.on('init', function () {



        Dates.on('change', function (begin, end) {
            panel.fire('dates', [begin, end]);
        });

    });





    panel.on('render', function () {
        Dates.render();
    });





    return panel.wrap({
        set: function (className, sw) {
            panel.$.toggleClass(className, sw);
        },
    });

});