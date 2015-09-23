

define('/ProductList', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var CloudHome = KISP.require('CloudHome');


    var Header = module.require('Header');
    var Main = module.require('Main');

    var view = KISP.create('Panel', '#div-panel-product-list');


    view.on('init', function () {


        Header.on({

            'client': function () {
                view.fire('client');
            },

            'type': function (item) {
                Main.render({ 'type': item.id });
            },

            'search': function (skey) {
                Main.render({ 'skey': skey });
            },

        });



      
        Main.on('detail', function (item, index) {
            view.fire('detail', [item, index]);
        });

       


    });




    view.on('show', function () {
        Main.show();
        CloudHome.setTitle('商品列表');
    });


    view.on('hide', function () {
        Main.hide();
        CloudHome.setTitle();
    });


    view.on('refresh', function () {

    });


    view.on('render', function (data) {


        if (data) { //说明是选了客户进来的
            Header.render(data);
            Main.render({ 'client': data.id });
            return;
        }


        if (view.rendered()) {
            return;
        }


        //注意，这里不再需要调用 Main.render()，
        //因为 Header.render() 会触发 tabs 事件
        Header.render();


    });

    view.on('refresh', function () {
        Main.refresh();
    });



    return view.wrap();

});