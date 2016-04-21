
define('/Master/Menus', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var panel = KISP.create('Panel', '#ul-master-menus');


    var list = [
        {
            text: '地铁',
            url: ' http://topic.leju.com/mview/m/aDK88888K.html?&source=weixin_wx10',
        },
        {
            text: '入户',
            cmd: ['news', 'detail'],
            data: {
                type: 'policy',
                id: 'AA3B0F8C60CE',
            },
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
            cmd: ['news', 'detail'],
            data: {
                type: 'news',
                id: '1B57D6C58F4A',
            },
        },
        {
            text: '动态',
            cmd: ['news', 'list'],
        },

    ];



    panel.on('init', function () {

        
        panel.$.touch({
            '[data-index]': function () {

                var index = +this.getAttribute('data-index');
                var item = list[index];
                var cmd = item.cmd;

                if (cmd) {
                    panel.fire('cmd', [cmd, item.data]);
                }
                else {
                    panel.fire('url', [item.url]);
                }

            },
        });
    });

    panel.on('render', function (data) {

        //list = data;

        panel.fill(list, function (item, index) {

            return {
                'index': index,
                'text': item.text,
            };
        });

    });

   

    return panel.wrap();


});


