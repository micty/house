
define('/Todo', function (require, module) {

    var $ = require('$');
    var KISP = require('KISP');
    var Bridge = require('Bridge');

    var List = module.require('List');
    var panel = KISP.create('Panel', '#div-todo-list');
    var list = [];

    panel.on('init', function () {



        panel.template(['row'], function (data, index) {

            return {
                data: {
                    'operate-display': '',
                },

                list: data.list,

                fn: function (item, index) {


                    var dt = item.datetime;
                    dt = $.Date.parse(dt);
                    dt = $.Date.format(dt, 'yyyy-MM-dd');

                    var data = $.Object.extend({}, item, {
                        'index': index,
                        'no': index + 1,
                        'operate-display': '',
                        'datetime': dt,
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