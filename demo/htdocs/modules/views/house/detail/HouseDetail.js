

define('/HouseDetail', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');

    var API = module.require('API');
    var Header = module.require('Header');
    var Summary = module.require('Summary');
    var Photo = module.require('Photo');
    var Content = module.require('Content');

    var view = KISP.create('Panel', '#div-view-house-detail');
    var current = null; //当前楼盘的数据。

    view.on('init', function () {

       
        API.on({
            'success': function (data) {
                current = data;
                Header.render(data);
                Summary.render(data);
                Content.render(data);
            },
        });

        Summary.on({
            'change': function (album) {
                Photo.render(album, current);
            },
        });

    });




    view.on('render', function (id) {

        API.get(id);


  
    });



    return view.wrap();


});