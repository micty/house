﻿

define('/Formater/Group/StatTown', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');

    var NumberField = require('NumberField');

  
    var towns = [
        { key: '南庄', name: '南庄镇', },
        { key: '石湾', name: '石湾镇街道', },
        { key: '张槎', name: '张槎街道', },
        { key: '祖庙', name: '祖庙街道', },
    ];



    //对一个数组中指定的列求和。
    function sum(list, key) {

        var total = 0;

        $.Array.each(list, function (item) {
            var value = item[key];
            value = Number(value);
            total += value;
        });

        return total;
    }



    //从指定的列表数据中创建一个分组。
    function get(list, use, title) {

        var items = $.Array.keep(towns, function (town) {

            var items = $.Array.grep(list, function (item) {
                return item.town == town.key;
            });

            var total = sum(list, use);

            return {
                'name': town.name,
                'value': total,
            };
        });


        if (!title) {
            return items;
        }


        var total = sum(items, 'value'); //这里没有除以 2

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