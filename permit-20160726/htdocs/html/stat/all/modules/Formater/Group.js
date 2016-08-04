
define('/Formater/Group', function (require, module, exports) {

    var $ = require('$');
    var $Array = require('Array');


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
        { name: '土地出让', key: 'lands', },
        { name: '已办规划许可', key: 'plans', },
        { name: '已办施工许可', key: 'constructs', },
        { name: '已办预售许可', key: 'prepares', },
        { name: '已办现售备案', key: 'doings', },

        {},
        {},
        {},

        { name: '预售已售面积', key: 'saled-prepares', },
        { name: '现售已售面积', key: 'saled-doings', },

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

        var group = {
            'text': text,
            'value': total,
            'uses': useList,
            'towns': townList,
        };

        return linearize(group);

    }

    //把一个分组转成列数组。
    function linearize(group) {
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







    //取得基础的几组
    function getBases(data) {

        var groups = $.Array.keep(roles, function (role) {

            var key = role.key;
            if (!key) {
                return [];
            }

            var title = role.name;
            var list = data[key];
            var group = get(title, list);

            return group;
        });


        return groups;
    }




    function getEmpty(group) {

        //空白组
        group = $.Array.keep(group, function () {
            return {
                name: '',
                value: '',
                text: '',
            };
        });

        group[0].group = true;
        group[0].subGroup = true;

        return group;
    }


    function substract(A, B, name) {
        var group = $Array.substract(A, B);
        group[0].text = name;
        return group;
    }

    return {
        'get': get,
        'getBases': getBases,
        'getEmpty': getEmpty,
        'substract': substract,
      
    };

});