
define('Resource', function (require, module) {

    var all = {
        'egg': { name: '��̨��', url: 'style/img/beta/egg.png' },
        'egg1': { name: '��', url: 'style/img/beta/egg1.png' },
        'egg2_1': { name: '���鿪ǰ��', url: 'style/img/beta/egg2_1.png' },
        'egg2_2': { name: '���鿪����', url: 'style/img/beta/egg2_2.png' },
        'goback': { name: '���ز˵�', url: 'style/img/beta/goback.png' },
        'start': { name: '��ʼ�˵�', url: 'style/img/beta/start.png' },
        'gs': { name: '����', url: 'style/img/beta/gs.png' },
        'gs2': { name: '����2', url: 'style/img/beta/gs2.png' },
        'coin': { name: '���', url: 'style/img/beta/coin.png' },
        'bg': { name: '�б���', url: 'style/img/beta/bg.jpg' },
        'stage_bg': { name: '��̨����', url: 'style/img/beta/stage_bg.jpg' },
        'gash': { name: '����', url: 'style/img/beta/gash.png' },
        'gift': { name: '��Ʒ', url: 'style/img/beta/gift.png' },
        'beat': { name: '����', url: 'style/img/beta/beat.png' },
        'bong': { name: 'Bong', url: 'style/img/bong.png' },
        'unprize': { name: '�޽�', url: 'style/img/unprize.jpg' },
        'color': { name: '�ʴ�����', url: 'style/img/beta/color.png' },
        'logo': { name: 'logo', url: 'style/img/beta/logo.png' }
    };


    // ��Դͳ��
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