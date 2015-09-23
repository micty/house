

define('/ProductList/Header/Title', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    


    var panel = KISP.create('Panel', '#p-product-list-title');


    panel.on('init', function () {

        
       


    });




    panel.on('render', function (name) {

        panel.fill({
            'name': name,
        });
       
    });

    


    return panel.wrap();


    
   


});