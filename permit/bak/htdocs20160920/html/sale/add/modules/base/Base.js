
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

            'update': function (data) {
                panel.fire('update', [data]);
            },


            'add': function (data) {
                panel.fire('add', [data]);
            },

            'post': function (data) {
                panel.fire('change');
            },

            'get': function (data) {
                Header.render();
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


        Form.on('detail', function (cmd, data) {
            panel.fire('detail', cmd, [data]);
        });
    });


    panel.on('render', function (data) {
        API.get(data);
    });

   


    return panel.wrap();

});
