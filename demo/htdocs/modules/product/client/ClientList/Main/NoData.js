

define('/ClientList/Main/NoData', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    

    var panel = KISP.create('Panel');
    var nodata = null;



    panel.on('init', function (list) {


        nodata = KISP.create('NoData', {

            container: '#div-view-client-list',
            append: true, //用 append 的方式，而不是 prepend
            top: 45,
            bottom: 46,
            background: 'none',
            text: '暂无客户',
            'z-index': 999, //要比日期控件的小
        });

    });




    panel.on('render', function (list) {

        nodata.toggle(list);


    });




    panel.on('hide', function () {
        nodata && nodata.hide();
    });



    return panel.wrap();
   


});