

define('/Map', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Dialog = module.require('Dialog');

    var panel = KISP.create('Panel', '#div-panel-map');
    var dialog = null;
    var current = null; //当前的数据。


    panel.on('init', function () {

        panel.$.on('click', '[data-cmd="edit"]', function () {

            Dialog.render(current);
        });

        Dialog.on({
            'submit': function (data) {

                panel.render(data);
            },
        });

    });



    panel.on('render', function (data) {

        current = data;

        data = data || {
            y: '23.110494',
            x: '113.264561',
            title: '示例楼盘',
            content: '示例电话: 0755-25639874',
        };


        var url = KISP.data('demo').map;
        url = Url.addQueryString(url, data);

        panel.$.find('iframe').attr('src', url);

    });


    return panel.wrap({

        get: function () {
            return current || {};
        },

        
    });

});