


define('/Formater0', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');



    var roles = [
        { text: '土地出让', key: 'lands', },
        { text: '已办规划许可', key: 'plans', },
        { text: '已办施工许可', key: 'constructs', },
        { text: '已办预售许可', key: 'sales', },
    ];

    var towns = [
        { text: '南庄镇', key: '南庄', },
        { text: '石湾镇街道', key: '石湾', },
        { text: '张槎街道', key: '张槎', },
        { text: '祖庙街道', key: '祖庙', },
    ];

    var uses = [
        { text: '商业', key: 'commerceSize', },
        { text: '住宅', key: 'residenceSize', },
        { text: '办公', key: 'officeSize', },
        { text: '其它', key: 'otherSize', },
    ];


    var data = [
       {
           name: '土地出让',
           value: '1234567890',
           uses: [
               { name: '商业', value: '20000', },
               { name: '住宅', value: '56000', },
               { name: '办公', value: '78000', },
               { name: '其它', value: '63000', },
           ],
           towns: [
               {
                   name: '南庄镇',
                   value: '6789000',
                   uses: [
                       { name: '商业', value: '20000', },
                       { name: '住宅', value: '56000', },
                       { name: '办公', value: '78000', },
                       { name: '其它', value: '63000', },
                   ],
               },
           ],
       },
    ];



    function sum(list, key) {
        var total = 0;

        $.Array.each(list, function (item) {
 
            var value = item[key];
            value = Number(value);
            total += value;
        });

        return total;
    }



    function format(data) {

        var list = $.Array.keep(roles, function (role) {

            var list = data[role.key];
            var town$stat = {};         //按区域统计

            $.Array.each(list, function (item) {
                var town = item.town;
                var stat = town$stat[town];

                if (!stat) {
                    stat = town$stat[town] = {};
                }

                $.Array.each(uses, function (use) {
                    var text = use.text;
                    var key = use.key;
                    var value = item[key];

                    value = Number(value);

                    var old = stat[key] || 0;
                    stat[key] = old + value;

                });

            });



            var townList = $.Array.keep(towns, function (town) {

                var stat = town$stat[town.key] || {};
           
                var list = $.Array.keep(uses, function (use) {
                    return {
                        'text': use.text,
                        'value': stat[use.key] || 0,
                    };
                });

                var total = sum(list, 'value');

                return {
                    'text': town.text,
                    'value': total,
                    'uses': list,
                };
            });


            var useList = $.Array.keep(uses, function (use) {

                var total = sum(list, use.key);
                return {
                    'text': use.text,
                    'value': total,
                };
            });

            var total = sum(useList, 'value');


            return {
                'text': role.text,
                'value': total,
                'uses': useList,
                'towns': townList,
            };

        });

        console.log(list);

        return list;

    }

    return {
        'format': format,
    };

});