

define('/ProductList/Main/Cart/Colors', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    

    var Tabs = KISP.require('Tabs');


    var panel = KISP.create('Panel', '#ul-product-list-colors');

    panel.on('init', function () {

        var $ = KISP.require('jquery-plugin/touch');


        panel.$.touch({

            '[data-cmd="cart"]': function (event) {
               

            },
        });



    });




    panel.on('render', function (data) {

       

    });


    panel.on('after-render', function () {
      
      

    });


    panel.on('hide', function () {
        
    });



    return panel.wrap();
   


});