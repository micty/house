

define('/HouseDetail', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');

    var Scroller = require('Scroller');


    var API = module.require('API');
    var Header = module.require('Header');
    //var Summary = module.require('Summary');
    //var Photo = module.require('Photo');
    var Content = module.require('Content');

    var view = KISP.create('View', '#div-view-house-detail');
    var current = null; //当前楼盘的数据。
    var scroller = null;


    view.on('init', function () {

        scroller = new Scroller(view.$.get(0));

       
        API.on({
            'success': function (data) {
                current = data;

                Header.render(data);
                //Summary.render(data);
                Content.render(data);

                scroller.refresh(300);
            },
        });

        //Summary.on({
        //    'change': function (album) {
        //        Photo.render(album, current);
        //    },

        //    'signup': function () {
        //        var Signup = require('Signup');
        //        Signup.show();
        //    },
        //});

    });




    view.on('render', function (item) {

        API.get(item.id);

  
    });



    return view.wrap();


});