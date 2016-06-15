
define('/Done/List', function (require, module) {
    var $ = require('$');
    var KISP = require('KISP');
    var User = require('User');
    var $Object = require('$Object');

    var panel = KISP.create('Panel', '#div-done-list');
    var list = [];

    panel.on('init', function () {

        var display = User.display('construct');


        panel.template(['row'], function (data, index) {

            return {
                data: {
                    'operate-display': display,
                },

                list: data.list,

                fn: function (item, index) {

                    var land = item.land;

                    item = $Object.linear(item);

                    var data = $.Object.extend({}, item, {
                        'index': index,
                        'no': index + 1,
                        'operate-display': display,
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
                var msg = '确认要删除施工许可证【' + item.construct.number + '】';
                top.KISP.confirm(msg, function () {
                    panel.fire(cmd, [item, index]);
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