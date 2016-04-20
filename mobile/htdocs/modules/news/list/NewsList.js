define('/NewsList', function (require, module, exports) {
    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Scroller = require('Scroller');

    var API = module.require('API');
    var Header = module.require('Header');
    var List = module.require('List');


    var view = KISP.create('View', '#div-view-news-list');
    var scroller = null;



    view.on('init', function () {

        scroller = new Scroller('#div-news-list-main', {
            top: '0.35rem',
        });
        

        API.on('success', function(data){
        
            Header.render(data.ads);
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

    

    return view.wrap();


});


