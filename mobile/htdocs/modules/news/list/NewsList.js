define('/NewsList', function (require, module, exports) {
    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Scroller = require('Scroller');

    var API = module.require('API');
    var Ads = module.require('Ads');
    var List = module.require('List');


    var view = KISP.create('View', '#div-view-news-list');
    var scroller = null;



    view.on('init', function () {

        scroller = new Scroller('#div-news-list-main', {
            top: '0.35rem',
        });


        Ads.on({
            'detail': function (data) {
                view.fire('detail', [data]);
            },

            'url': function (url) {
                view.fire('url', [url]);
            },
        });
        

        API.on('success', function(data){
        
            Ads.render(data.ads);
            List.render(data.list);

            scroller.refresh(200);

        });


        List.on('item', function (item) {
            view.fire('detail', [item]);
        });


    });

    view.on('render', function () {


        API.get();

    });

    view.on('show', function (byRender) {
        if (!byRender) { //说明是后退导致的
            scroller.refresh(200);
        }
    });
    

    return view.wrap();


});


