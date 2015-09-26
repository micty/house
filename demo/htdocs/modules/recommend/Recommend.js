

define('/Recommend', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');

    var API = module.require('API');
    var List = module.require('List');
    var Tabs = module.require('Tabs');


    var panel = KISP.create('Panel', '#div-panel-recommend');


    panel.on('init', function () {

        API.on({

            'success': function (list) {
                Tabs.render(list);
               
            },
        });

        Tabs.on({
            'change': function (item) {
                List.render(item.items);
            },
        });


    });


    panel.on('render', function () {

       
        API.get();
    });



    return panel.wrap();


});