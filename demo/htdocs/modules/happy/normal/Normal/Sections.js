

define('/Normal/Sections', function (require, module) {

    var $ = require('$');
    var KISP = require('KISP');


    var Content = module.require('Content');
    var Tabs = module.require('Tabs');


    var panel = KISP.create('Panel', '#div-panel-normal');


    panel.on('init', function () {
        
        Tabs.on({
            'change': function (item) {
                Content.render(item);
            },
        });

    });


    panel.on('render', function (list) {

        Tabs.render(list);
        
    });



    return panel.wrap();


});