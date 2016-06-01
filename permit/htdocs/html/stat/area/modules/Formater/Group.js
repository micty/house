
define('/Formater/Group', function (require, module, exports) {

    var $ = require('$');
    var StatUse = require('StatUse');
    var $Array = require('Array');



    var roles = [
        { name: '土地出让', key: 'lands', },
        { name: '已办规划许可', key: 'plans', },
        { name: '已办施工许可', key: 'constructs', },
        { name: '已办预售许可', key: 'prepares', },
        { name: '已办现售备案', key: 'doings', },

    ];

    var towns = [
        { name: '南庄镇', key: '南庄', },
        { name: '石湾镇街道', key: '石湾', },
        { name: '张槎街道', key: '张槎', },
        { name: '祖庙街道', key: '祖庙', },
    ];


    function get(list, town, title) {

        list = $.Array.grep(list, function (item) {
            return item.town == town;
        });

        var group = StatUse.get(list, title);
        return group;
    }


    //取得标准的开始几组
    function getStandards(data, town) {

        var groups = $.Array.keep(roles, function (role) {
            var list = data[role.key];
            var title = role.name;
            var group = get(list, town, title);
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
        group[0].name = name;
        return group;
    }




    return {
        'getStandards': getStandards,
        'getEmpty': getEmpty,
        'substract': substract,
        'get': get,
    };

});