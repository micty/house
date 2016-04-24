

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


                emitter.fire('success', [{
                    'ads': ads,
                    'houses': catalogs,


                    'menus': [
                        {
                            text: '地铁',
                            url: ' http://topic.leju.com/mview/m/aDK88888K.html?&source=weixin_wx10',
                        },
                        {
                            text: '入户',
                            url: 'http://topic.leju.com/mview/m/5uK88888K.html',
                        },
                        {
                            text: '学位',
                            url: ' http://topic.leju.com/mview/m/7dK88888K.html?&source=weixin_wx10',
                        },
                        {
                            text: '娱乐',
                            url: 'http://topic.leju.com/mview/m/jDK88888K.html?&source=weixin_wx10',
                        },
                        {
                            text: '版块',
                            url: ' http://topic.leju.com/mview/m/gTK88888K.html?&source=weixin_wx10',
                        },
                        {
                            text: '公积金',
                            cmd: ['news', 'detail'],
                            data: {
                                type: 'news',
                                id: '5913C3BABB3B',
                            },
                        },
                        {
                            text: '文化',
                            url: 'http://topic.leju.com/mview/m/EuK88888K.html',
                        },
                        {
                            text: '动态',
                            cmd: ['news', 'list'],
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