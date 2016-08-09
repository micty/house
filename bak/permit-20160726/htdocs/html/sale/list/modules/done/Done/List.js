
define('/Done/List', function (require, module) {
    var $ = require('$');
    var KISP = require('KISP');
    var User = require('User');
    var $Object = require('$Object');

    var panel = KISP.create('Panel', '#div-done-list');
    var list = [];

    panel.on('init', function () {

        var display = User.display('sale');


        panel.template(['row'], function (data, index) {

            return {
                data: {
                    'operate-display': display,
                },

                list: data.list,

                fn: function (item, index) {

                    var licenses = item.licenses;
                    item = $Object.linear(item);

                    var data = $.Object.extend({}, item, {
                        'index': index,
                        'no': index + 1,
                        'operate-display': display,
                        'licenses.0.length': licenses[0].length,
                        'licenses.1.length': licenses[1].length,
                    });

                    return {
                        'data': data,
                    };
                },
            };
        });




        panel.$.on('click', '[data-cmd]', function (event) {

            var btn = this;
            var index = btn.getAttribute('data-index');
            var cmd = btn.getAttribute('data-cmd');
            var item = list[index];

            if (cmd == 'remove') {
                var msg = '确认要删除【' + item.sale.project + '】' + 
                    '这也将会删除其所拥有的预售许可证';

                top.KISP.confirm(msg, function () {
                    panel.fire('cmd', [cmd, item]);
                });
                return;
            }

            panel.fire('cmd', [cmd, item]);

        });

    });


    panel.on('render', function (data) {


        list = data;

        //二级模板填充所需要的数据格式
        panel.fill({
            'list': list,
        });

        panel.$.toggleClass('nodata', list.length == 0);

    });



    return panel.wrap();


});