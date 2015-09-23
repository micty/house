

define('/ProductList/Main/Cart', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    

    var Template = KISP.require('Template');

    var API = module.require('API');
    var API = module.require('API');



    var panel = KISP.create('Panel', '#div-product-list-cart');

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