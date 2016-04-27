

define('/Master/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Url = MiniQuery.require('Url');
    var Emitter = MiniQuery.require('Emitter');

    var emitter = new Emitter();
    var loading = null;


    //获取数据
    function get() {


        var api = KISP.create('API', 'Mobile.Master.get', {
            //proxy: 'HouseCatalog.js',
        });


        api.on({

            'request': function () {
                loading = loading || KISP.create('Loading', {
                    text: '加载中...',
                });
                loading.show();
            },

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {

                var catalogs = data.catalogs;
                var houses = data.houses;

                $.Array.each(catalogs, function (item, index) {

                    var list = $.Array.grep(houses, function (house) {
                        return house.belong == item.belong;
                    });

                    item.list = list;
                    item.count = list.length;

                });

                var ads = $.Array.keep(data.ads, function (item) {
                    var url = item.url;
                    var qs = Url.getQueryString(url) || {};
                    var type = qs.type;
                    var id = qs.id;

                    if (type && id) {
                        delete item.url;
                        item.type = type;
                        item.id = id;
                    }

                    return item;
                });

                //把价格待定项移动最后
                catalogs = catalogs.slice(1).concat(catalogs[0]);

                emitter.fire('success', [{
                    'ads': ads,
                    'houses': catalogs,


                    'menus': [
                        {
                            text: '地铁',
                            url: ' http://topic.leju.com/mview/m/aDK88888K.html',
                            icon: 'style/img/menu-item-01.png',
                            width: 52,
                        },
                        {
                            text: '入户',
                            url: 'http://topic.leju.com/mview/m/5uK88888K.html',
                            icon: 'style/img/menu-item-02.png',
                            width: 56,
                        },
                        {
                            text: '学位',
                            url: ' http://topic.leju.com/mview/m/7dK88888K.html',
                            icon: 'style/img/menu-item-03.png',
                            width: 96,
                        },
                        {
                            text: '购物',
                            url: 'http://topic.leju.com/mview/m/jDK88888K.html',
                            icon: 'style/img/menu-item-04.png',
                            width: 85,
                        },
                        {
                            text: '版块',
                            url: ' http://topic.leju.com/mview/m/gTK88888K.html',
                            icon: 'style/img/menu-item-05.png',
                            width: 72,
                        },
                        {
                            text: '公积金',
                            url: 'http://topic.leju.com/mview/m/4uK88888K.html',
                            icon: 'style/img/menu-item-06.png',
                            width: 100,
                        },
                        {
                            text: '文化',
                            url: 'http://topic.leju.com/mview/m/EuK88888K.html',
                            icon: 'style/img/menu-item-07.png',
                            width: 72,
                        },
                        {
                            text: '动态',
                            cmd: ['news', 'list'],
                            icon: 'style/img/menu-item-08.png',
                            width: 70,
                        },
                        {
                            text: '美食',
                            url: 'http://topic.leju.com/mview/m/SDK88888K.html',
                            icon: 'style/img/menu-item-09.png',
                            width: 82,
                        },
                        {
                            text: '医疗',
                            url: 'http://topic.leju.com/mview/m/4xK88888K.html',
                            icon: 'style/img/menu-item-10.png',
                            width: 68,
                        },
                        {
                            text: '体育',
                            url: 'http://topic.leju.com/mview/m/UxK88888K.html',
                            icon: 'style/img/menu-item-11.png',
                            width: 70,

                        },
                        {
                            text: '旅游',
                            url: 'http://topic.leju.com/mview/m/nDK88888K.html',
                            icon: 'style/img/menu-item-12.png',
                            width: 52,
                        },
                    ],



                }]);
            },






            'fail': function (code, msg, json, xhr) {
                KISP.alert('获取数据失败: {0} ({1})', msg, code);
            },

            'error': function (code, msg, json, xhr) {
                KISP.alert('网络繁忙，请稍候再试');
            },
        });

        api.get();


    }



    return {
        get: get,
        on: emitter.on.bind(emitter),
    };


});