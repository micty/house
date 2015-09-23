

define('/ClientList', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    

    var Header = module.require('Header');
    var Main = module.require('Main');


    var view = KISP.create('Panel', '#div-view-client-list');



    view.on('init', function () {

        Header.on({

            'search': function (skey) {
                Main.render(skey);
            },

            'clear': function () {

            },
        });


        Main.on({
            'render': function (list) {
                
            },

            'select': function (item) {
                console.dir(item);
                view.fire('select', [item]);
            },
        });

       
        
    });




    view.on('show', function () {
       
    });


    view.on('hide', function () {

    });







    view.on('render', function () {

        if (view.rendered()) {
            Main.show();
            return;
        }

        Main.render();
        Header.render();

    });

   

    return view.wrap();

});