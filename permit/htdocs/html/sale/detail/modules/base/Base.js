
define('/Base', function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    
    var API = module.require('API');
    var Form = module.require('Form');

    var panel = KISP.create('Panel', '#div-panel-base');

    panel.on('init', function () {

        API.on('success', {

            'get': function (data) {
         
                Form.render(data);
            },

        });

    });


    panel.on('render', function (id) {
        API.get(id);
    });

   


    return panel.wrap();

});
