
define('/Todo/List', function (require, module) {

    var $ = require('$');
    var KISP = require('KISP');
    var User = require('User');
    var $Object = require('$Object');

    var panel = KISP.create('Panel', '#div-todo-list');
    var list = [];

    panel.on('init', function () {

        panel.template(['row'], function (data, index) {

            return {
                data: {
                
                },

                list: data.list,

                fn: function (item, index) {

                    var data = $.Object.extend({}, item, {
                        'index': index,
                        'order': index + 1,
                    });

                    return {
                        'data': data,
                    };
                },
            };
        });




        panel.$.on('click', '[data-cmd]', function (event) {

            var btn = this;
            var index = +btn.getAttribute('data-index');
            var cmd = btn.getAttribute('data-cmd');
            var item = list[index];

            if (cmd == 'remove') {
                var msg = '确认要移除预售证号为【' + item.number + '】的记录吗';

                top.KISP.confirm(msg, function () {
                    panel.fire(cmd, [item, index]);
                });

                return;
            }


            panel.fire(cmd, [item, index]);

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