
define('Resource', function (require, module) {

    var all = {
        'egg': { name: '舞台金蛋', url: 'style/img/beta/egg.png' },
        'egg1': { name: '金蛋', url: 'style/img/beta/egg1.png' },
        'egg2_1': { name: '金蛋碎开前景', url: 'style/img/beta/egg2_1.png' },
        'egg2_2': { name: '金蛋碎开背景', url: 'style/img/beta/egg2_2.png' },
        'goback': { name: '返回菜单', url: 'style/img/beta/goback.png' },
        'start': { name: '开始菜单', url: 'style/img/beta/start.png' },
        'gs': { name: '光束', url: 'style/img/beta/gs.png' },
        'gs2': { name: '光束2', url: 'style/img/beta/gs2.png' },
        'coin': { name: '金币', url: 'style/img/beta/coin.png' },
        'bg': { name: '列表背景', url: 'style/img/beta/bg.jpg' },
        'stage_bg': { name: '舞台背景', url: 'style/img/beta/stage_bg.jpg' },
        'gash': { name: '裂纹', url: 'style/img/beta/gash.png' },
        'gift': { name: '礼品', url: 'style/img/beta/gift.png' },
        'beat': { name: '锤子', url: 'style/img/beta/beat.png' },
        'bong': { name: 'Bong', url: 'style/img/bong.png' },
        'unprize': { name: '无奖', url: 'style/img/unprize.jpg' },
        'color': { name: '彩带花絮', url: 'style/img/beta/color.png' },
        'logo': { name: 'logo', url: 'style/img/beta/logo.png' }
    };


    // 资源统计
    var total = 0;
    for (var i in all) {
        if (all.hasOwnProperty(i)) {
            total++;
        }
    }


    return {
        get: function (name) {
            var res = Resource[name];
            if (!res['width']) {
                res['width'] = res['image']['width'];
                res['height'] = res['image']['height'];
            }
            return res;
        },

        total: total,
    };


});