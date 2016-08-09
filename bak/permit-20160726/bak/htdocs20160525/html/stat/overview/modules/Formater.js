
define('/Formater', function (require, module, exports) {

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


    //示例数据
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


    //对一个数组中指定的列进行求和。
    function sum(list, key) {
        var total = 0;

        $.Array.each(list, function (item) {
 
            var value = item[key];
            value = Number(value);
            total += value;
        });

        return total;
    }

    //对两个数组的元素分别进行相加
    function add(A, B, k) {

        if (k === undefined) {
            k = 1;
        }

        return $.Array.keep(A, function (item, index) {

            var value = item.value + B[index].value * k;

            return $.Object.extend({}, item, {
                'value': value,
            });
        });
    }

    //从指定的列表数据中创建一个分组。
    function getGroup(text, list) {

        //按区域统计
        var townList = $.Array.keep(towns, function (town) {

            var items = $.Array.grep(list, function (item) {
                return item.town == town.key;
            });

            var useList = $.Array.keep(uses, function (use) {

                var total = sum(items, use.key);

                return {
                    'text': use.text,
                    'value': total,
                };
            });


            var total = sum(useList, 'value');

            return {
                'text': town.text,
                'value': total,
                'uses': useList,
            };
        });

        //按用途统计
        var useList = $.Array.keep(uses, function (use) {

            var total = sum(list, use.key);

            return {
                'text': use.text,
                'value': total,
            };
        });


        var total = sum(useList, 'value');

        return {
            'text': text,
            'value': total,
            'uses': useList,
            'towns': townList,
        };

    }

    //把一个分组转成列数组。
    function getColumn(group) {
        var list = [];

        list.push({
            'text': group.text,
            'value': group.value,
            'group': true,
            'subGroup': true,
        });

        list = list.concat(group.uses);

        $.Array.each(group.towns, function (town) {

            list.push({
                'text': town.text,
                'value': town.value,
                'subGroup': true,

            });

            list = list.concat(town.uses);

        });

        return list;
    }


    function format(data) {

        //标准
        var groups = $.Array.keep(roles, function (role) {

            var text = role.text;
            var list = data[role.key];
            var group = getGroup(text, list);

            return group;

        });

        var cols = $.Array.keep(groups, function (group) {
            return getColumn(group);
        });

        //规划差异调整。
        var adjusts = getGroup('规划差异调整', []);
        adjusts = getColumn(adjusts);

        //未办规划许可。
        var unplans = add(cols[0], cols[1], -1);
        unplans[0].text = '未办规划许可';
     
        //已办提前介入。
        var befores = $.Array.grep(data.constructs, function (item) {
            return item.before == '是';
        });

        befores = getGroup('已办提前介入', befores);
        befores = getColumn(befores);

        //已售房屋面积。 未实现，暂时用空数组代替。
        var sales = getGroup('已售房屋面积', []);
        sales = getColumn(sales);

       
        cols[0] = cols[0].concat(adjusts, [
            { text: '', value: '', },
            { text: '可建面积合计', value: '', subGroup: true, },
        ]);

        cols[1] = cols[1].concat(unplans, [
            { text: '', value: '', },
            { text: '应办规划许可面积合计', value: '', subGroup: true, },
        ]);

        cols[2] = cols[2].concat(befores, [
            { text: '未办施工许可', value: '', },
            { text: '应办施工许可面积合计', value: '', subGroup: true, },
        ]);

        cols[3] = cols[3].concat(sales, [
            { text: '', value: '', },
            { text: '预售未售面积合计', value: '', subGroup: true, },
        ]);


       

        //对数组进行转置。 即把数组的行与列对换，返回一个新数组。
        var rows = $.Array.transpose(cols);

        return rows;

    }








    return {
        'format': format,
    };

});