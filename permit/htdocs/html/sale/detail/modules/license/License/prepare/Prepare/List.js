
define('/License/Prepare/List', function (require, module) {

    var $ = require('$');
    var KISP = require('KISP');

    var Cell = require('Cell');
    var Size = require('Size');
    var $Object = require('$Object');

    var panel = KISP.create('Panel', '#div-license-prepare-list');
    var list = [];

    panel.on('init', function () {



        panel.template(['row'],  function (data, index) {

            return {
                data: {
                    
                },

                list: data.list,

                fn: function (item, index) {

                    var license = item.license;
                    var saleds = item.saleds;

                    license.datetime = license.datetime.split(' ')[0];


                    var data = $Object.linear(item);

                    data = $.Object.extend(data, {
                        'index': index,
                        'no': index + 1,

                        'totalSize': Size.totalText(license),
                        'totalCell': Cell.totalText(license),

                        //因为已售记录是累积的，这里采用按截止日期倒序后的第一条为准。
                        'saled-totalSize': Size.sumText(saleds.slice(0, 1)),
                        'saled-totalCell': Cell.sumText(saleds.slice(0, 1)),

                        'saled-count': saleds.length,
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
            var item = list[index].license;

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