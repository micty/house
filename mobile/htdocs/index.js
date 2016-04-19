
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
            nav.to('HouseDetail');
        },
    });

    var NewsList = module.require('NewsList');
    NewsList.on({
        'detail': function (item) {
            nav.to('NewsDetail');
        },
    });


    var Master = module.require('Master');
    Master.on({
        'news': function (item) {
            nav.to('NewsList');

        },
        'houses': function (item) {
            nav.to('HouseList');
        },
    });

    nav.to('Master');

  
   

});



