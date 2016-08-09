
define('/Formater/Group', function (require, module, exports) {

    var $ = require('$');
    var $Array = require('Array');

    var StatTown = module.require('StatTown');


    var roles = [
        { name: '土地出让', key: 'land', },
        { name: '已办规划许可', key: 'plan', },
        { name: '已办施工许可', key: 'construct', },
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

            var group = StatTown.get(item, title);
            return group;
        });

        return groups;
    }


    return {
        'getBases': getBases,
    };

});