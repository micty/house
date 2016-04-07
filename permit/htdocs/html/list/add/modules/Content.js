

define('/Content', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');


    var panel = KISP.create('Panel');
    var ue = null;

    panel.on('init', function () {

        ue = UE.getEditor('editor');
       

    });



    panel.on('render', function (data) {

        

        ue.ready(function () {

            if (data) {
                ue.setContent(data);
                
            }


        });


    });


    return panel.wrap({

        get: function () {

            return ue ? ue.getContent() : '';
        },

        clear: function () {
            ue.setContent('');
        },
    });

});