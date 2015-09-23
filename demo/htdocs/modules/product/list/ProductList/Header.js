

define('/ProductList/Header', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    

    var Search = module.require('Search');
    var Title = module.require('Title');
    var Types = module.require('Types');



    var panel = KISP.create('Panel', '#div-product-list-header');


    panel.on('init', function () {

        Types.on({
            'change': function (item) {
                panel.fire('type', [item]);
            },
        });

        Search.on({

            'hide': function () {
                panel.$.removeClass('search');
            },

            'submit': function (skey) {
                panel.fire('search', [skey]);
            },

        });


        panel.$.touch({

            '[data-cmd="client"]': function () {
                panel.fire('client');
            },
            
            '[data-cmd="search"]': function () {
                panel.$.addClass('search');
                Search.render();
                
            },
        });

    });




    panel.on('render', function (data) {

        

        if (data) {
            Title.render(data.name);
        }
        else {
            Types.render();
            Title.render('');

        }

    });





    return panel.wrap();
   


});