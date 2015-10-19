

define('/Normal/Sections/Tabs', function (require, module) {

    var $ = require('$');
    var KISP = require('KISP');


    
    var panel = KISP.create('Panel', '#ul-normal-sections-list');
    var tabs = null;


    panel.on('init', function () {


        tabs = KISP.create('Tabs', {
            container: '#ul-normal-sections-list',
            activedClass: 'on',
            repeated: true, //允许重复激活相同的项，否则再次进来时会无反应
        });


        tabs.on('change', function (item) {
            panel.fire('change', [item]);
        });


    });



    panel.on('render', function (list) {


        tabs.render(list, function (item, index) {

            return {
                'index': index,
            };
        });

        tabs.active(0);

    });



    return panel.wrap();


});