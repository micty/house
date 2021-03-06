﻿
define('/License/List', function (require, module) {

    var $ = require('$');
    var KISP = require('KISP');
    var SessionStorage = require('SessionStorage');
    var Size = require('Size');

    var panel = KISP.create('Panel', '#div-license-list');
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


                    data = $.Object.extend(data, item, {
                        'index': index,
                        'no': index + 1,
                        'operate-display': '',
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