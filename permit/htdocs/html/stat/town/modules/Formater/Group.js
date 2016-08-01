
define('/Formater/Group', function (require, module, exports) {

    var $ = require('$');
    var StatUse = require('StatUse');
    var $Array = require('Array');


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



    //取得基础的几组
    function getBases(data) {

        var groups = $.Array.keep(roles, function (role) {

            var key = role.key;
            if (!key) {
                return [];
            }

            var item = data[key];
            var title = role.name;

            var group = StatUse.get(item, title);
            return group;
        });

        return groups;
    }


    //空白组
    function getEmpty(group) {
        
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
        'getBases': getBases,
        'getEmpty': getEmpty,
        'substract': substract,
    };

});