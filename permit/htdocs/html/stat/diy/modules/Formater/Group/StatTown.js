

define('/Formater/Group/StatTown', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');

    var towns = [
        { key: '南庄', name: '南庄镇', },
        { key: '石湾', name: '石湾镇街道', },
        { key: '张槎', name: '张槎街道', },
        { key: '祖庙', name: '祖庙街道', },
    ];



    //从指定的列表数据中创建一个分组。
    function get(item, title) {

        var list = $.Array.keep(towns, function (town) {
            var value = item[town.key];

            return {
                'name': town.name,
                'value': value,
            };
        });

        if (!title) {
            return list;
        }


        var total = 0;
        list.forEach(function (item) {
            total += item.value;
        });


        list.unshift({
            'name': title,
            'value': total,
            'group': true,
            'subGroup': true,
        });

        return list;

    }


    return {
       'get': get,
    };


});