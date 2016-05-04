define('/Master', function (require, module, exports) {
    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Scroller = require('Scroller');

    var API = module.require('API');
    var Ads = module.require('Ads');
    var Houses = module.require('Houses');
    var Menus = module.require('Menus');


    var view = KISP.create('View', '#div-view-master');
    var scroller = null;

    view.on('init', function () {

        scroller = new Scroller(view.$.get(0));
        

        Menus.on({
            'cmd': function (cmd, data) {

                var args = cmd.slice(0);
                args.push([data]);

                view.fire.apply(view, args);
            },

            'url': function (url) {
                view.fire('url', [url]);
            },
        });

        Ads.on({
            'detail': function (data) {
                view.fire('news', 'detail', [data]);
            },

            'url': function (url) {
                view.fire('url', [url]);
            },
        });


        Houses.on({
            'item': function (item) {
                view.fire('houses', [item]);
            },
        });

   



        API.on('success', function (data) {
           
            Menus.render(data.menus);
            Ads.render(data.ads);
            Houses.render(data.houses);



            //解析 innerHTML 需要时间，这里需要延迟一下
            scroller.refresh(200);

            //要重新绑定 img，因为 img 是动态创建的，
            //并且加载后滚动区高度发生了变化，要刷新滚动器
            view.$.find('img').on('load', function () {
                scroller.refresh(200);
            });

        });
        
    });


    view.on('render', function (index) {

        API.get();


    });

    view.on('before-render', function () {

        view.$.find('img').off('load');
    });


    //view.on('show', function (byRender) {
    //    if (!byRender) { //说明是后退导致的
    //        scroller.refresh(200);
    //    }
    //});

    return view.wrap();


});


