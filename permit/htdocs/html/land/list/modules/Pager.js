

define('/Pager', function (require, module) {

    var $ = require('$');
    var KISP = require('KISP');

    var Pager = require('Pager');

    var panel = KISP.create('Panel', '#div-pager');
    var pager = null;


    panel.on('init', function () {

       
    });



    panel.on('render', function (page) {
        
        if (pager) {
            pager.destroy();
        }

        pager = new Pager({
            'container': panel.$.selector,  //分页控件的容器
            'hideIfLessThen': 2,            //总页数小于该值时，分页器会隐藏。 如果不指定，则一直显示。
            'current': page.no,             //当前激活的页码，默认为 1
            'size': page.size,              //每页的大小，即每页的记录数
            'total': page.total,            //总的记录数，应该从后台取得该值
        });


        var tid = null;

        pager.on({
            //翻页时会调用该方法，参数 no 是当前页码
            'change': function (no) {

                //避免过快翻页而连续发起请求。
                clearTimeout(tid);

                tid = setTimeout(function () {
                    panel.fire('change', [no]);

                }, 300);
            },

            //控件发生错误时会调用该方法，比如输入的页码有错误时
            'error': function (msg) {
                KISP.alert(msg);
            },
        });


        pager.render();


    });



    return panel.wrap();

});





