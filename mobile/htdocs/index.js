
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
   

    nav.to('Master');


  
   

});



