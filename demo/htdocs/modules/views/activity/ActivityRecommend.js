

define('/ActivityRecommend', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');

    var API = module.require('API');
    var Footer = module.require('Footer');
    var List = module.require('List');
    var Tabs = module.require('Tabs');


    var panel = KISP.create('Panel', '#div-view-activity-recommend');

    panel.on('init', function () {

        API.on('success', {
            'get': function (list) {
                Tabs.render(list);
                Footer.render();
                scrollTo(0, 415);
            },
        });

        Tabs.on({
            'change': function (item) {
                List.render(item.items);
            },
        });


       
    });


    panel.on('render', function () {

        if (panel.rendered()) {
            return;
        }
       
        API.get();
    });



    return panel.wrap({
        active: function (item) {
            Tabs.active(item);
        },
    });


});