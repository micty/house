/**
* 
*/
define('/Search', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');


    var user = null;
    var panel = KISP.create('Panel', '#div-search');


    panel.on('init', function () {

        panel.$.on('keyup', 'input', function (event) {

            if (event.keyCode == 13) {
                var txt = this;
                var value = txt.value;

                panel.fire('submit', [value]);
            }

          
        });


    });


    panel.on('render', function () {

       
    });






    return panel.wrap();

});




