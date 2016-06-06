﻿
define('/License/List', function (require, module) {

    var $ = require('$');
    var KISP = require('KISP');
    var Size = require('Size');

    var panel = KISP.create('Panel', '#div-license-list');
    var list = [];

    panel.on('init', function () {



        panel.template(['row'],  function (data, index) {

            return {
                data: {
                },

                list: data.list,

                fn: function (item, index) {


                    data = $.Object.extend(data, item, {
                        'index': index,
                        'no': index + 1,
                        'datetime': item.datetime.split(' ')[0],
                    
                        'totalSize0': Size.totalText(item, 0),
                        'totalSize1': Size.totalText(item, 1),
                        'totalSize': Size.totalText(item),

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



    return panel.wrap();


});