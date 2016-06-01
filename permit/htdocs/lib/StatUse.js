

define('StatUse', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');

    var NumberField = require('NumberField');

  

    var uses = [
        { name: '计容面积', key: ['residenceSize', 'commerceSize', 'officeSize', 'otherSize'], },
        { name: '住宅', key: 'residenceSize', },
        { name: '商业', key: 'commerceSize', },
        { name: '办公', key: 'officeSize', },
        { name: '其它', key: 'otherSize', },

        { name: '不计容面积', key: ['parkSize', 'otherSize1'], },
        { name: '地下车库', key: 'parkSize', },
        { name: '其它', key: 'otherSize1', },
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
    function get(list, title) {

        //按用途统计
        var items = $.Array.keep(uses, function (use) {

            var total = sum(list, use.key);

            return {
                'name': use.name,
                'value': total,
            };
        });

        if (!title) {
            return items;
        }


        var total = sum(items, 'value') / 2;

        items = [{
            'name': title,
            'value': total,
            'group': true,
            'subGroup': true,

        }].concat(items);


        return items;

    }


    return {
       'get': get,
    };


});