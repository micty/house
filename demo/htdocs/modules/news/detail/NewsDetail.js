

define('/NewsDetail', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');
    var Template = KISP.require('Template');

    var API = module.require('API');
    var Header = module.require('Header');
    var Main = module.require('Main');
    var Mode = module.require('Mode');



    var view = KISP.create('Panel', '#div-view-news-detail');


    view.on('init', function () {

        API.on({

            'success': function (data) {

                Template.fill('#div-news-detail-body', {
                    'title': data.title,
                    'datetime': data.datetime,
                    'content': data.content,
                });

                scrollTo(0, 369);

               
            },
        });

    });


    view.on('render', function (type, id, options) {

        Header.render(type);
        API.get(type, id);
        
        showParts(options);
       

    });


    //显示/隐藏指定的部分
    function showParts(options) {

        var mode = options.mode;
        options = Mode.get(mode === undefined ?  options : mode);

        view.$.toggleClass('no-sidebar', !options.sidebar);
        view.$.toggleClass('no-head', !options.head);
        view.$.toggleClass('no-title', !options.title);
        view.$.toggleClass('no-sub', !options.sub);
    }



    return view.wrap();


});