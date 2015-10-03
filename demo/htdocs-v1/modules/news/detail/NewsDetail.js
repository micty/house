

define('/NewsDetail', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');
    var Template = KISP.require('Template');

    var API = module.require('API');
    var Main = module.require('Main');
    var Header = module.require('Header');

    var Sidebar = require('Sidebar');


    var view = KISP.create('Panel', '#div-view-news-detail');


    view.on('init', function () {

        API.on({

            'success': function (data) {

                Template.fill('#div-news-detail-body', {
                    'title': data.title,
                    'datetime': data.datetime,
                    'content': data.content,
                });
               
            },
        });

    });


    view.on('render', function (type, id) {

       
        API.get(type, id);
        Sidebar.render();
    });



    return view.wrap();


});