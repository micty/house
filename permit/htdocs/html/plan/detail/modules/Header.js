

define('/Header', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var SessionStorage = require('SessionStorage');
    var user = SessionStorage.get('user');
   
    var panel = KISP.create('Panel', '#div-header');





    panel.on('init', function () {

        panel.$.on('click', 'button', function () {

            panel.fire('submit');


        });

    });



    panel.on('render', function () {
        panel.$.find('button').toggle(user.role == 'land');

    });


    return panel.wrap();


});