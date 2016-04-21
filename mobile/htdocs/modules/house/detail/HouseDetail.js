

define('/HouseDetail', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');

    var Scroller = require('Scroller');


    var API = module.require('API');
    var Header = module.require('Header');
    //var Summary = module.require('Summary');
    //var Photo = module.require('Photo');
    var Content = module.require('Content');
    var Footer = module.require('Footer');

    var view = KISP.create('View', '#div-view-house-detail');
    var current = null; //当前楼盘的数据。
    var scroller = null;


    view.on('init', function () {

        scroller = new Scroller('#div-house-detail-main', {
            bottom: '0.42rem',
        });

       
        API.on({
            'success': function (data) {
                current = data;

                Header.render(data);
                //Summary.render(data);
                Content.render(data);
                Footer.render();

                //解析 innerHTML 需要时间，这里需要延迟一下
                scroller.refresh(200);

                //要重新绑定 img，因为 img 是动态创建的，
                //并且加载后滚动区高度发生了变化，要刷新滚动器
                view.$.find('img, iframe').on('load', function () {
                    scroller.refresh(200);
                });

            },
        });

    });




    view.on('render', function (item) {

        API.get(item.id);

  
    });


    view.on('before-render', function () {
        view.$.find('img, iframe').off('load');
    });


    return view.wrap();


});