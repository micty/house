define('/NewsDetail', function (require, module, exports) {
    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Scroller = require('Scroller');


    var API = module.require('API');


    var view = KISP.create('View', '#div-view-news-detail');
    var scroller = null;

    view.on('init', function () {

        scroller = new Scroller(view.$.get(0));

        
        API.on('success', function (data) {

            var Template = KISP.require('Template');


            Template.fill('#div-news-detail-body', {
                'title': data.title,
                'datetime': data.datetime,
                'content': data.content,
            });

            scroller.refresh(200);
            scroller.refresh(500);
            scroller.refresh(1000);

        });

    });

    view.on('render', function (item) {


        API.get('86A01B842E00');


    });

  

    return view.wrap();


});


