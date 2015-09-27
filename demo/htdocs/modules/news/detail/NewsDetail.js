

define('/NewsDetail', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');

    //var API = module.require('API');
    //var Main = module.require('Main');
    //var Header = module.require('Header');

    var Sidebar = require('Sidebar');

    var view = KISP.create('Panel', '#div-view-news-detail');


    view.on('init', function () {

        //API.on({

        //    'success': function (data) {
        //        Main.render(data);
               
        //    },
        //});



    });


    view.on('render', function () {

       
        //API.get();
        Sidebar.render();
    });



    return view.wrap();


});