
var eggI;

KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var Url = MiniQuery.require('Url');
    var API = KISP.require('API');
    var api = new API('ActivityPrize.get');

    var phone = Url.getQueryString(window, 'phone') || '13760187469';

    api.on({
        'fail': function (msg, data, json) {
            KISP.alert(msg);
        },
        'error': function () {
            KISP.alert('验证身份失败，请稍候再试!');
        },

        'success': function (data, json) {
            
            var list = data.list;
            var item = $.Array.findItem(list, function (item, index) {
                return !!item.prize;
            });

            if (item) {
                KISP.alert('已存在手机号码 {phone} 的中奖记录，不能重复抽奖! <br /> 中奖时间: {datetime} <br />奖品: {prize}', item);
                return;
            }

            var ResourceCurrentCount = 0;

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
                            game = new Game(canvas, phone);
                            game.createGameScene(prize);
                            console.log('ResourceCurrentCount=' + ResourceCurrentCount);
                        }
                    }
                }
            }

        },
        
    });


    api.get({
        'phone': phone,
    });


});