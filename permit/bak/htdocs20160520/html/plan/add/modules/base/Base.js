
define('/Base', function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    
    var API = module.require('API');
    var Form = module.require('Form');
    var Header = module.require('Header');


    var panel = KISP.create('Panel', '#div-panel-base');

    panel.on('init', function () {

        API.on('success', {

            'post': function (data, json) {
                panel.fire('save', [data]);
                panel.fire('change');
            },

            'get': function (data) {
                Form.render(data);
            },

        });

        Header.on('save', function () {

            var data = Form.get();
            if (!data) {
                return;
            }

     
            API.post(data);
        });

    });


    panel.on('render', function (id, isLand) {
        Header.render();
        API.get(id, isLand);
    });

   


    return panel.wrap();

});
