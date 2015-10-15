

define('/Sidebar', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');



    //这里不能用 id，因为它是共用的，会产生多个。
    var panel = KISP.create('Panel', '[data-id="panel-sidebar"]');


    panel.on('init', function () {

        panel.$.on('click', '[data-cmd]', function (event) {

            var cmd = this.getAttribute('data-cmd');
            panel.fire(cmd);
        });
    });




    panel.on('render', function () {


    });



    return panel.wrap();


});