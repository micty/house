

define('/ProductList/Header/Types/SmallTabs', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    


    var panel = KISP.create('Panel');
    var list = [];
    var tabs = null;

    panel.on('init', function () {

        tabs = KISP.create('Tabs', {
            container: '#ul-product-list-tabs-1',
            activedClass: 'on',
            repeated: true, //允许重复激活相同的项，否则再次进来时会无反应

            change: function (item, index) {
                panel.fire('change', [item]);
            },
        });

    });




    panel.on('render', function (data) {

        list = data;
        tabs.render(list);
        tabs.active(0);

    });

    


    return panel.wrap();


    
   


});