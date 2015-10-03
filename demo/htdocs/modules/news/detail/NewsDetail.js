

define('/NewsDetail', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');
    var Template = KISP.require('Template');

    var API = module.require('API');
    var Main = module.require('Main');
    var Header = module.require('Header');



    var view = KISP.create('Panel', '#div-view-news-detail');


    view.on('init', function () {

        API.on({

            'success': function (data) {

                Template.fill('#div-news-detail-body', {
                    'title': data.title,
                    'datetime': data.datetime,
                    'content': data.content,
                });

                scrollTo(0, 520);
               
            },
        });

    });


    view.on('render', function (type, id) {

        Header.render(type);
        API.get(type, id);
    });



    return view.wrap();


});