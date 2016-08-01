

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


    //从指定的列表数据中创建一个分组。
    function get(stat, title) {

        var list = $.Array.keep(uses, function (use) {

            var key = use.key;
            var value = 0;

            if (Array.isArray(key)) {
                key.forEach(function (key) {
                    value += stat[key];
                });
            }
            else {
                value = stat[key];
            }

            return {
                'name': use.name,
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

        total = total / 2;


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