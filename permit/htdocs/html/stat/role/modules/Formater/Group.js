
define('/Formater/Group', function (require, module, exports) {

    var $ = require('$');
    var StatUse = require('StatUse');
    var $Array = require('Array');



    var roles = [
        { name: '出让可建面积', key: 'land', },
        { name: '已办规划许可', key: 'plan', },
        { name: '已办施工许可', key: 'construct', },
        { name: '已办预售许可', key: 'prepare', },
        { name: '预售已售面积', key: 'saled-prepare', },
        { name: '已办现售备案', key: 'doing', },
        { name: '现售已售面积', key: 'saled-doing', },
    ];


    var towns = [
        { key: '', name: '合计', },
        { key: '南庄', name: '南庄', },
        { key: '石湾', name: '石湾', },
        { key: '张槎', name: '张槎', },
        { key: '祖庙', name: '祖庙', },
    ];



  
    function get(data) {

        var clusters = $.Array.map(roles, function (role) {
            var key = role.key;
            var town$stat = data[key];

            if (!town$stat) {
                return null;
            }


            var title = role.name;

            var groups = $.Array.map(towns, function (town) {
                var key = town.key;
                if (!key) {
                    return [];
                }

                var stat = town$stat[key];
                var group = StatUse.get(stat, title);

                return group;
            });

            groups[0]


            if (key == 'land') {
                //针对土地，把土地面积放在第一行。
                var list = sizes(town$stat);

                list.forEach(function (item, index) {
                    groups[index].unshift(item);
                });
            }

            return groups;
        });

        return clusters;
    }


    function substract(A, B, name) {

        var clusters = $.Array.keep(A, function (group, index) {
  
            group = $Array.substract(group, B[index]);

            group[0].name = name;

            return group;

        });

      
        return clusters;
    }


    /**
    * 针对土地出让的，统计土地面积。
    */
    function sizes(town$stat) {

        var total = 0;

        var list = $.Array.map(towns, function (town) {
            var key = town.key;
            if (!key) {
                return {
                    'name': '土地出让面积',
                    'value': 0,
                    'group': true,
                    'subGroup': true,
                };
            }

            var stat = town$stat[key];
            var value = stat.size;

            total += value;

            return {
                'name': town.name,
                'value': value,
            };
        });

        list[0].value = total;

        return list;
    }


    return {
        'get': get,

        'substract': substract,
    };

});