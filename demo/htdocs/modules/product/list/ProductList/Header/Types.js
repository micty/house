

define('/ProductList/Header/Types', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    
    var API = module.require('API');

    var LargeTabs = module.require('LargeTabs');
    var SmallTabs = module.require('SmallTabs');


    var panel = KISP.create('Panel');


    panel.on('init', function () {

        
        API.on('success', function (list) {

            LargeTabs.render(list);

        });


        LargeTabs.on('change', function (item) {

            SmallTabs.render(item.items);

        });


        SmallTabs.on('change', function (item) {

            panel.fire('change', [item]);

            console.dir(item);
        });



    });




    panel.on('render', function () {

        API.post();

    });

    


    return panel.wrap();


    
   


});