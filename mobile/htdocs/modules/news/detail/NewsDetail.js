define('/NewsDetail', function (require, module, exports) {
    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Scroller = require('Scroller');


    var API = module.require('API');


    var view = KISP.create('View', '#div-view-news-detail');
    var scroller = null;

    view.on('init', function () {

        scroller = new Scroller(view.$.get(0));

        
        API.on('success', function (data) {

            var Template = KISP.require('Template');


            Template.fill('#div-news-detail-body', {
                'title': data.title,
                'datetime': data.datetime,
                'content': data.content,
            });

            //解析 innerHTML 需要时间，这里需要延迟一下
            scroller.refresh(200);

            //要重新绑定 img，因为 img 是动态创建的，
            //并且加载后滚动区高度发生了变化，要刷新滚动器
            view.$.find('img').on('load', function () {
                scroller.refresh(200);
            });


        });

    });

    view.on('render', function (type, id) {

        //重载 render({})
        if (typeof type == 'object') {
            var obj = type;
            type = obj.type;
            id = obj.id;
        }

        API.get(type, id);


    });


    view.on('before-render', function () {
        view.$.find('img').off('load');
    });


    view.on('hide', function () {
        $('#div-news-detail-body').html('');
        scroller.to(0); //避免下次进来还停留在上一次的位置。

    });

  

    return view.wrap();


});


