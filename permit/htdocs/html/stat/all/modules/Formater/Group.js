
define('/Formater/Group', function (require, module, exports) {

    var $ = require('$');
    var $Array = require('Array');
    var StatUse = require('StatUse');


    var roles = [
        { name: '土地出让', key: 'land', },
        { name: '已办规划许可', key: 'plan', },
        { name: '已办施工许可', key: 'construct', },
        { name: '已办预售许可', key: 'prepare', },
        { name: '已办现售备案', key: 'doing', },
        { name: '', },
        { name: '未办规划许可', },
        { name: '未办施工许可', },
        { name: '预售已售面积', key: 'saled-prepare', },
        { name: '现售已售面积', key: 'saled-doing', },

    ];

    var towns = [
        { key: '', name: '', },
        { key: '南庄', name: '南庄镇', },
        { key: '石湾', name: '石湾镇街道', },
        { key: '张槎', name: '张槎街道', },
        { key: '祖庙', name: '祖庙街道', },
    ];



    //取得基础的几组
    function get(data) {

        var clusters = $.Array.keep(roles, function (role) {
            var key = role.key;
            if (!key) {
                return [];
            }

            var town$stat = data[key];
            
            var groups = towns.map(function (town) {
                var key = town.key;
                if (!key) {
                    return [];
                }

                var title = town.name;
                var stat = town$stat[key];
                var group = StatUse.get(stat, title);
             
                return group;
            });

            //基础的4组
            var bases = groups.slice(1);
            
            //把基础的 4 组相加到合计里
            groups[0] = groups[1].map(function (item, index) {

                //统计对应的列的 value 字段。
                var total = 0;
                bases.forEach(function (items) {
                    total += items[index].value;
                });

                var isFirst = index == 0;
                var name = isFirst ? role.name : item.name;

                return {
                    'name': name,
                    'value': total,
                    'group': isFirst,
                    'subGroup': isFirst,
                };
            });


            var items = $.Array.reduceDimension(groups);
            return items;

        });




        return clusters;
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
        group[0].name = name;
        return group;
    }

    return {
  
        'get': get,
        'getEmpty': getEmpty,
        'substract': substract,
      
    };

});