

define('/Header', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var User = require('User');

   
    var panel = KISP.create('Panel', '#div-header');





    panel.on('init', function () {

        panel.$.on('click', 'button', function () {

            panel.fire('submit');


        });

    });



    panel.on('render', function () {
        panel.$.toggleClass('noop', !User.is('plan'));

    });


    return panel.wrap();


});