

define('/Houses', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');



    var panel = KISP.create('Panel', '#div-panel-houses');


    panel.on('init', function () {

        $('#ul-houses-list>li').each(function (index) {
            var li = this;

            $(li).on('click', function () {
                panel.fire('click', [index]);
            });
        });

    });


    panel.on('render', function () {

    });



    return panel.wrap();


});