

define('/HouseDetail/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');
    var emitter = new Emitter();

    var loading = null;

    //获取数据
    function get(id) {


        var api = KISP.create('API', 'HouseDetail.get', {
            proxy: 'api/HouseDetail.js',
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

                var album$list = {};
                var photos = data.photos || [];

                $.Array.each(photos, function (item) {

                    var album = item.album;

                    var list = album$list[album];
                    if (!list) {
                        list = album$list[album] = [];
                    }

                    list.push(item);
                });


                var albums = ['效果图', '位置图', '实景图', '样板间', '户型图'];
                albums = $.Array.map(albums, function (album) {

                    var list = album$list[album];
                    if (!list) {
                        return null; //过滤掉。
                    }

                    return {
                        'name': album,
                        'list': list,
                    };
                });




                data = $.Object.extend(data, {
                    'ads': data.ads || 'style/img/ad-001.jpg', //默认广告图
                    'albums': albums,
                });


                emitter.fire('success', [data]);
            },



            'fail': function (code, msg, json, xhr) {

                KISP.alert('获取数据失败: {0} ({1})', msg, code);

            },

            'error': function (code, msg, json, xhr) {
                KISP.alert('网络繁忙，请稍候再试');
            },
        });

        api.get({
            'id': id,
        });


    }



    return {
        get: get,
        on: emitter.on.bind(emitter),
    };


});