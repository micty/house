
define('/Formater/Group', function (require, module, exports) {

    var $ = require('$');


    //示例数据
    var data = [
       {
           name: '土地出让',
           value: '1234567890',
           uses: [
               { name: '计容面积', value: '56000', },
               { name: '住宅', value: '56000', },
               { name: '商业', value: '20000', },
               { name: '办公', value: '78000', },
               { name: '其它', value: '63000', },
               { name: '不计容面积', value: '56000', },
               { name: '地下车库', value: '56000', },
               { name: '其它', value: '56000', },
           ],
           towns: [
               {
                   name: '南庄镇',
                   value: '6789000',
                   uses: [
                       { name: '计容面积', value: '56000', },
                       { name: '住宅', value: '56000', },
                       { name: '商业', value: '20000', },
                       { name: '办公', value: '78000', },
                       { name: '其它', value: '63000', },
                       { name: '不计容面积', value: '56000', },
                       { name: '地下车库', value: '56000', },
                       { name: '其它', value: '56000', },
                   ],
               },
           ],
       },
    ];



    var roles = [
        { text: '土地出让', key: 'lands', },
        { text: '已办规划许可', key: 'plans', },
        { text: '已办施工许可', key: 'constructs', },
        { text: '已办预售许可', key: 'prepares', },
        { text: '已办现售备案', key: 'doings', },

    ];

    var towns = [
        { text: '南庄镇', key: '南庄', },
        { text: '石湾镇街道', key: '石湾', },
        { text: '张槎街道', key: '张槎', },
        { text: '祖庙街道', key: '祖庙', },
    ];

    var uses = [
        { text: '计容面积', key: ['residenceSize', 'commerceSize', 'officeSize', 'otherSize'], },
        { text: '住宅', key: 'residenceSize', },
        { text: '商业', key: 'commerceSize', },
        { text: '办公', key: 'officeSize', },
        { text: '其它', key: 'otherSize', },

        { text: '不计容面积', key: ['parkSize', 'otherSize1'], },
        { text: '地下车库', key: 'parkSize', },
        { text: '其它', key: 'otherSize1', },
    ];



    //对一个数组中指定的列或多列进行求和。
    function sum(list, key) {

        var total = 0;

        //重载 sum(list, keys)，多列的情况
        if (key instanceof Array) {

            $.Array.each(key, function (key) {
                total += sum(list, key);
            });

        }
        else { //单列
            $.Array.each(list, function (item) {
                var value = item[key];
                value = Number(value);
                total += value;
            });
        }

        return total;
    }


    //从指定的列表数据中创建一个分组。
    function get(text, list) {

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

            var total = sum(useList, 'value') / 2;

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

        var total = sum(useList, 'value') / 2;

        return {
            'text': text,
            'value': total,
            'uses': useList,
            'towns': townList,
        };

    }


    //取得标准的开始几组
    function getStandards(data) {

        var groups = $.Array.keep(roles, function (role) {
            var text = role.text;
            var list = data[role.key];
            var group = get(text, list);

            return group;
        });

        return groups;
    }





    return {
        'get': get,
        'getStandards': getStandards,
      
    };

});