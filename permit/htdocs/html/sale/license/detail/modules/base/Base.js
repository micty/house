
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
                panel.fire('render', [data]);
            },
        });



    });


    panel.on('render', function (data) {
        
        if (typeof data == 'object') { //说明是导入生成的预览
            Form.render(data);
            panel.$.addClass('temp');
        }
        else { //传进来的是一个 id
            API.get(data);
            panel.$.removeClass('temp');
        }
    });

   


    return panel.wrap();

});
