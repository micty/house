

define('/NewsDetail', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');
    var Template = KISP.require('Template');

    var API = module.require('API');
    var Main = module.require('Main');
    var Header = module.require('Header');



    var view = KISP.create('Panel', '#div-view-news-detail');


    view.on('init', function () {

        API.on({

            'success': function (data) {

                Template.fill('#div-news-detail-body', {
                    'title': data.title,
                    'datetime': data.datetime,
                    'content': data.content,
                });

                scrollTo(0, 360);

               
            },
        });

    });


    view.on('render', function (type, id, options) {

        Header.render(type);
        API.get(type, id);
        
        showParts(options);

       

    });


    //显示/隐藏指定的部分
    function showParts(options) {

        //默认显示全部
        var defaults = {
            sidebar: true,
            head: true,
            title: true,
            sub: true,
        };

        var keys = ['sidebar', 'head', 'title', 'sub', ];

        if (options) {
            var isPure = options.mode == 0; //全部隐藏

            $.Array.each(keys, function (key, index) {
                if (isPure) {
                    options[key] = false;
                    return;
                }

                var value = options[key];
                if (value === '0' || value === 'false') {
                    options[key] = false;
                }
                else {
                    options[key] = true;
                }
            });
        }

        options = $.Object.extend({}, defaults, options);



        view.$.toggleClass('no-sidebar', !options.sidebar);
        view.$.toggleClass('no-head', !options.head);
        view.$.toggleClass('no-title', !options.title);
        view.$.toggleClass('no-sub', !options.sub);
    }



    return view.wrap();


});