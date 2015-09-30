

define('/Keypoint', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var API = module.require('API');
    var Tabs = module.require('Tabs');


    var panel = KISP.create('Panel', '#div-keypoint-photos');

    var list = [];
  
    var maxCount = 9; //最多显示条数


    panel.on('init', function () {

        var img = panel.$.find('img');
     
        Tabs.on('change', function (item) {
            img.attr('src', item.url);
        });


        API.on('success', function (data) {

            Tabs.render(data);
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



    panel.on('render', function () {
       

        API.get();
        
    });



    return panel.wrap();



});