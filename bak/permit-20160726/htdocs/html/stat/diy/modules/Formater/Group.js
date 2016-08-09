
define('/Formater/Group', function (require, module, exports) {

    var $ = require('$');
    var $Array = require('Array');

    var StatTown = module.require('StatTown');


    var roles = [
        { name: '土地出让', key: 'lands', },
        { name: '已办规划许可', key: 'plans', },
        { name: '已办施工许可', key: 'constructs', },
    ];



    //取得基础的几组
    function getBases(data) {

        var groups = $.Array.keep(roles, function (role) {

            var key = role.key;
            if (!key) {
                return [];
            }

            var list = data[key];
            var title = role.name;

            var group = StatTown.get(list, title);
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
        'getBases': getBases,
        'getEmpty': getEmpty,
        'substract': substract,
    };

});