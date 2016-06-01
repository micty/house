
define('/Formater/Group', function (require, module, exports) {

    var $ = require('$');
    var StatUse = require('StatUse');
    var $Array = require('Array');



    var roles = [
        { name: '土地出让', key: 'lands', },
        { name: '已办规划许可', key: 'plans', },
        { name: '已办施工许可', key: 'constructs', },
        { name: '已办预售许可', key: 'prepares', },
        { name: '预售已售面积', key: 'saled-prepares', },
        { name: '已办现售备案', key: 'doings', },
        { name: '现售已售面积', key: 'saled-doings', },
    ];


    var towns = [
        { key: '', name: '合计', },
        { key: '南庄', name: '南庄', },
        { key: '石湾', name: '石湾', },
        { key: '张槎', name: '张槎', },
        { key: '祖庙', name: '祖庙', },
    ];


    function get(title, list, town) {

        if (town) {
            list = $.Array.grep(list, function (item) {
                return item.town == town;
            });
        }


        var group = StatUse.get(list, title);
        return group;
    }

    function getCluster(title, list) {

        var groups = $.Array.keep(towns, function (town) {

            var group = get(title, list, town.key);

            return group;

            //return {
            //    'town': town.key,
            //    'list': group,
            //};
        });

        return groups;
    }



    //取得基础的几组
    function getBases(data) {

        var clusters = $.Array.keep(roles, function (role) {

            var key = role.key;
            if (!key) {
                return [];
            }

            var list = data[key];
            var title = role.name;


            return getCluster(title, list);
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






    return {
        'getBases': getBases,
        'getCluster': getCluster,
        'substract': substract,
        'get': get,
    };

});