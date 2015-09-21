

/**
* 固定器模块
*/
define('Fixer', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KERP = require('KERP');
    var MenuData = require('MenuData');


    var div = document.getElementById('div-fixer-tab-panel');
    var hasFixed = false;


    function render(config) {

        var top = config.top;
        var fnChange = config.change;
        var fnScroll = config.scroll;


        $(window).on('scroll', function () {

            //滚动的垂直距离
            //后者是兼容 IE
            var y = document.body.scrollTop || document.documentElement.scrollTop;
            fnScroll && fnScroll(y);


            var d = y - top;
            if (hasFixed && d > 0 || !hasFixed && d <= 0) {
                return;
            }

            hasFixed = !hasFixed;

            $(div).toggleClass('tab-panel-fixed', hasFixed);
            $(document.body).toggleClass('tab-fixed', hasFixed);


            fnChange && fnChange(hasFixed);

        });
    }



    return {
        render: render
    };


   

});



    