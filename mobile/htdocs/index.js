
/*
* 主控制器。
*/
KISP.launch(function (require, module, nav) {

    

    function init() {
 
        var dpr = window.devicePixelRatio;
        var scale = 1 / dpr;
        var scale = 1;
        var content = 'initial-scale=' + scale + ', user-scalable=yes';

        var meta = document.createElement('meta');
        meta.setAttribute('name', 'viewport');
        meta.setAttribute('content', content);

        document.head.appendChild(meta);


        function resize() {
            var size = document.body.clientWidth / 3.75;
            document.documentElement.style.fontSize = size + 'px';
        }

        window.addEventListener('resize', resize, false);

        resize();

    }

    init();


   


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



