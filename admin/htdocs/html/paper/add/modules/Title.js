

define('/Title', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

   
    var panel = KISP.create('Panel', '#txt-title');


   




    panel.on('render', function (type, value) {


        panel.$.attr('placeholder', type + '标题');

        if (value) {
            panel.$.val(value);
        }

    });


    return panel.wrap({

        get: function () {
            return panel.$.val();
        },

        clear: function () {
            panel.$.val('');
        },
    });


});