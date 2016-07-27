
define('/Done/List', function (require, module) {
    var $ = require('$');
    var KISP = require('KISP');
    var User = require('User');
    var $Object = require('$Object');


    var panel = KISP.create('Panel', '#div-done-list');
    var list = [];

    panel.on('init', function () {

        var display = User.display('plan');


        panel.template(['row'], function (data, index) {

            return {
                data: {
                    'operate-display': display,
                },

                list: data.list,

                fn: function (item, index) {

                    item = $Object.linear(item);

                    var data = $.Object.extend({}, item, {
                        'index': index,
                        'no': index + 1,
                        'operate-display': display,
                        'license': item.licenses.length,
                        'diy-class': item['land.diy'] == '是' ? 'diy' : '',

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
                var msg = '确认要删除规划许可【' + item.project + '】' +
                    ' 同时也会删除其所拥有的许可证。';

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