﻿
define('/List', function (require, module) {

    var $ = require('$');
    var KISP = require('KISP');
    var SessionStorage = require('SessionStorage');

    var panel = KISP.create('Panel', '#div-list');
    var user = SessionStorage.get('user');
    var list = [];

    panel.on('init', function () {

        var display = user.role == 'land' ? '' : 'display: none;';


        panel.template(['row'],  function (data, index) {

            return {
                data: {
                    'operate-display': display,
                },

                list: data.list,

                fn: function (item, index) {


                    var dt = item.datetime;
                    dt = $.Date.parse(dt);
                    dt = $.Date.format(dt, 'yyyy-MM-dd');

                    var data = $.Object.extend({}, item, {
                        'index': index,
                        'no': index + 1,
                        'operate-display': display,
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

            if (cmd == 'remove') {
                var msg = '确认要删除【' + item.number + '】';
                KISP.confirm(msg, function () {
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



    return panel.wrap({

        remove: function (index) {
            panel.$.find('tr[data-index="' + index + '"]').slideUp(function () {

                list.splice(index, 1);
                panel.render(list);

            });
        },
    });


});