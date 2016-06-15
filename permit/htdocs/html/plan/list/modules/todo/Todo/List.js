﻿
define('/Todo/List', function (require, module) {

    var $ = require('$');
    var KISP = require('KISP');
    var User = require('User');
    var Size = require('Size');

    var panel = KISP.create('Panel', '#div-todo-list');
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

                    var data = $.Object.extend({}, item, {
                        'index': index,
                        'no': index + 1,
                        'operate-display': display,
                        'datetime': item.datetime.split(' ')[0],
                        'totalSize': Size.totalText(item),
                        'size': Size.text(item, 'size'),
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