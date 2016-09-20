
/**
* 容器模块。
*/
define('/Container', function (require, module, exports) {

    var $ = require('$');
    var KISP = require('KISP');

    var panel = KISP.create('Panel', '#div-container');


    panel.on('init', function () {
        $(window).on('resize', function () {
            adaptHeight();
        });

    });


    panel.on('render', function () {
        adaptHeight();
    });



    //调整高度
    function adaptHeight() {
        var width = panel.$.width();
        var height = width / 2;
        panel.$.height(height);
    }


    return panel.wrap();

});