/**
*
*/
define('/ProductList/Main', function (require, module, exports) {
    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');


    var API = module.require('API');
    var List = module.require('List');
    var Loading = module.require('Loading');
    var Scroller = module.require('Scroller');


    var div = document.getElementById('div-product-list-main');
    var panel = KISP.create('Panel', div);

    var pageNo = 1;
    var pageCount = 0;
    var nodata = null;


    panel.on('init', function () {

        nodata = KISP.create('NoData', {
            container: div,
            append: true, //用 append 的方式，而不是 prepend
            top: 49,
            bottom: 0,
            'z-index': 999, //要比日期控件的小
        });


        API.on({
            'response': function () {
                Loading.hide();
            },

            'success': function (list, page) {
                pageCount = page.count;

                List.render(list);
                Scroller.setLastPage(pageNo >= pageCount);
                Scroller.toggleEnable(list);

                //可以直接传入一个数组，数组有数据时则隐藏，否则显示
                nodata.toggle(list);
            },
        });


        List.on({
            'render': function () {
                Scroller.refresh(200);
                List.toggle(panel.visible());
            },

            'hide': function () {
                Scroller.refresh();
            },

            'detail': function (item, index) {
                panel.fire('detail', [item, index]);
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
                nodata.hide();
            },

        });
    });


    panel.on('before-render', function () {
        
    });


    panel.on('render', function (data) {

        List.hide(); //好像不起作用，jQuery 的问题？
        nodata.hide();

        Scroller.render(div);

        
        Loading.show( panel.rendered() );

        data = $.Object.extend({}, data, {
            'pageNo': 1,
        });

        API.post(data);


    });


    panel.on('show', function () {
        List.show(); 
    });

    panel.on('hide', function () {
        Loading.hide();
        List.hide();
    });


    panel.on('refresh', function () {
        List.hide();
        Loading.show(true); //显示有背景的 loading
        API.post(1);
    });



    return panel.wrap();
    

});