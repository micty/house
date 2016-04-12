

define('/Keypoint/Photos', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var Main = module.require('Main');
    var Tabs = module.require('Tabs');


    var panel = KISP.create('Panel', '#div-keypoint-photos');


    panel.on('init', function () {

     
        Tabs.on('change', function (item) {
            Main.render(item);
        });



        panel.$.on({
            'mouseover': function () {
                Tabs.stop();
            },
            'mouseout': function () {
                Tabs.start();
            },
        });


    });



    panel.on('render', function (data) {
       
        Tabs.render(data);
        
    });



    return panel.wrap();



});