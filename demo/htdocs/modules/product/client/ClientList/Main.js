/**
*
*/
define('/ClientList/Main', function (require, module, exports) {
    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');


    var API = module.require('API');
    var List = module.require('List');
    var Loading = module.require('Loading');
    var NoData = module.require('NoData');
    var Scroller = module.require('Scroller');


    var div = document.getElementById('div-client-list-main');
    var panel = KISP.create('Panel', div);
   
    var pageNo = 1;
    var pageCount = 0;


    panel.on('init', function () {


        API.on({
            'response': function () {
                Loading.hide();
            },

            'success': function (list, page) {
                pageCount = page.count;

                Scroller.setLastPage(pageNo >= pageCount);
                List.render(list);
                NoData.render(list);

            },
        });

        List.on({
            'render': function (list) {
                Scroller.refresh(200);
            },

            'hide': function () {
                Scroller.refresh();
            },


            'select': function (item) {
                panel.fire('select', [item]);
            },

           
        });


        Scroller.on({

            'reload': function (fn) {
                pageNo = 1;
                pageCount = 0;

                API.post(pageNo, fn);
            },

            'load-more': function (fn) {

                if (pageNo >= pageCount) {
                    Scroller.setLastPage(true);
                    return;
                }

                API.post(++pageNo, fn);
            },

            'pulldown': function () {
                NoData.hide();
            },

        });
    });



   


    panel.on('render', function (skey) {

        List.hide();
        Scroller.render(div);
        Loading.show();

        pageNo = 1;
        pageCount = 0;
        NoData.hide();

        API.post(skey);

    });


    panel.on('show', function () {
        List.show(); 
    });

    panel.on('hide', function () {
        List.hide();
    });





    return panel.wrap();
    

});