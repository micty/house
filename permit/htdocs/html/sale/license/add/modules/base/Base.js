
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

        Form.on('render', function (data) {
            panel.fire('render', [data]);
        });

    });


    panel.on('render', function (data) {

        
        if (typeof data == 'string') { //传进来是一个 id
            API.get(data);
        }
        else {
            Form.render(data);
        }

    });

   


    return panel.wrap();

});
