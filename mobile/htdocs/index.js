
/*
* 主控制器。
*/
KISP.launch(function (require, module, nav) {

    var $ = require('$');
    function resize() {
        document.documentElement.style.fontSize = (document.body.clientWidth / 3.75) + 'px';
    }

    $(window).on('resize', resize);
    resize();
   


    var HouseList = module.require('HouseList');
    HouseList.on({
        'detail': function (item) {
            nav.to('HouseDetail', item);
        },
    });



    var NewsList = module.require('NewsList');
    NewsList.on({
        'detail': function (item) {
            nav.to('NewsDetail', item);
        },
        'url': function (url) {
            location.href = url;
        },
    });


    var Master = module.require('Master');
    Master.on({
        'news': {
            'list': function () {
                nav.to('NewsList');
            },
            'detail': function (item) {
                nav.to('NewsDetail', item);
            },
        },

        'url': function (url) {
            location.href = url;
        },

        'houses': function (item) {
            nav.to('HouseList', item);
        },
    });

    nav.to('Master');

  
   

});



