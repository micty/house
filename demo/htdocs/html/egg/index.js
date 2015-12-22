

KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var Url = MiniQuery.require('Url');

    var key = Url.getQueryString(window, 'key');
    if (!key) {
        KISP.alert('请先报名再来抽奖!', function () {
            window.close();
        });
        return;
    }


    var SessionStorage = MiniQuery.require('SessionStorage');
    var user = SessionStorage.get(key);
    if (!user) {
        KISP.alert('请先报名再来抽奖!', function () {
            window.close();
        });
        return;
    }

    var loading = null;

    var API = KISP.require('API');
    var api = new API('ActivityPrize.get');

    api.on({
        'request': function () {
            loading = KISP.create('Loading', {
                text: '身份验证中...',
                mask: 0.4,
            });
            loading.show();
        },
        'response': function () {
            loading.hide();
        },
        'fail': function (msg, data, json) {
            KISP.alert(msg, function () {
                window.close();
            });
        },
        'error': function () {
            KISP.alert('身份验证失败，请稍候刷新再试!');
        },
    });


    api.on('success', function (data) {
        var list = data.list;
        var item = $.Array.findItem(list, function (item, index) {
            return !!item.prize;
        });

        if (item) {
            KISP.alert('已存在手机号 {phone} 的中奖记录，不能重复抽奖! ', item, function () {
                window.close();
            });
            return;
        }


        // 资源加载
        for (var i in Resource) {
            if (Resource.hasOwnProperty(i)) {
                Resource[i]['image'] = new Image();
                Resource[i]['image'].src = Resource[i]['url'];
                Resource[i]['image'].onload = function () {
                    ResourceCurrentCount++;
                    if (ResourceCurrentCount >= ResourceTotalCount) {
                        // 计算高度
                        for (var i in Resource) {
                            if (Resource.hasOwnProperty(i)) {
                                if (Resource[i]['width']) {
                                    Resource[i]['height'] = Resource[i]['width'] / Resource[i]['image']['width'] * Resource[i]['image']['height'];
                                }
                                if (Resource[i]['height']) {
                                    Resource[i]['width'] = Resource[i]['height'] / Resource[i]['image']['height'] * Resource[i]['image']['width'];
                                }
                            }
                        }
                        // 资源加载完成，开始游戏
                        game = new Game(canvas, key);
                        game.createGameScene(prize);
                    }
                }
            }
        }

    });



    api.get({
        'phone': user.phone,
    });


});