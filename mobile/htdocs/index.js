
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

    var HouseDetail = module.require('HouseDetail');
    HouseDetail.on('news', {
        'detail': function (item) {
            nav.to('NewsDetail', item);
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



    


    //var $ = require('$');
    //var startX = 0;
    //var lastX = 0;
    //var translateX = 0;
    //var clientWidth = document.body.clientWidth;
    //var hasBind = false;

    //$('#div-view-news-list').on('touchstart', function (event) {

    //    $('#div-view-master').show();

    //    var view = this;
    //    view.style.webkitTransition = 'none';

    //    var touch = event.originalEvent.touches[0];
    //    startX = touch.pageX;
        
    //});

    //$('#div-view-news-list').on('touchmove', function (event) {

    //    var view = this;
    //    var touch = event.originalEvent.touches[0];
    //    var dx = touch.pageX - startX;

    //    translateX = lastX + dx;
    //    view.style.webkitTransform = 'translateX(' + translateX + 'px)';

    //});

   
    //$('#div-view-news-list').on('touchend', function (event) {
        
    //    var view = this;

    //    if (!hasBind) {
    //        $(view).on('transitionend', function () {
    //            $('#div-view-master').toggle(translateX > 0);
    //        });

    //        hasBind = translateX;
    //    }

    //    view.style.webkitTransition = '-webkit-transform 0.7s';


    //    if (translateX > clientWidth / 3) {
    //        translateX = clientWidth;
    //    }
    //    else {
    //        translateX = 0;
    //    }

    //    view.style.webkitTransform = 'translateX(' + translateX + 'px)';


    //    lastX = translateX;

    //});



});



