
define('/Construct', function (require, module) {

    var $ = require('$');
    var KISP = require('KISP');


    var Bridge = require('Bridge');

    var API = module.require('API');
    var Header = module.require('Header');
    var List = module.require('List');





    var panel = KISP.create('Panel', '#div-panel-construct');
    panel.on('init', function () {
        API.on('success', {

            'get': function (data) {
                List.render(data);
            },


        });

        
    });



    panel.on('render', function () {
        API.get();
        Header.render();
    });


    return panel.wrap();



});