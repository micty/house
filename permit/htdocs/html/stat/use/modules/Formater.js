
define('/Formater', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Group = module.require('Group');




    function format(data, use) {


        //基础
        var groups = Group.getBases(data);

        //空白组
        groups[5] = Group.getEmpty(groups[0]);

        ////未办规划许可。
        //groups[6] = Group.substract(groups[0], groups[1], '未办规划许可');
        groups[6] = Group.getEmpty(groups[0]);


        ////未办施工许可。
        ////未办施工许可 = 土地出让 - 已办施工许可
        //groups[7] = Group.substract(groups[0], groups[2], '未办施工许可');
        groups[7] = Group.getEmpty(groups[0]);


        var cols = groups.slice(0, 5).map(function (group, index) {
            return group.concat(groups[5 + index]);
        });

        //对数组进行转置。 即把数组的行与列对换，返回一个新数组。
        var rows = $.Array.transpose(cols);
    
        //住宅的特殊处理，公式跟其它的不同。
        var isResidence = use.key == 'residenceSize';

        return {
            'rows': rows,
            'formula0': isResidence ? '土地出让' : '已办规划许可面积',
            'total0': groups[isResidence ? 0 : 1 ][0].value - groups[8][0].value - groups[9][0].value,

            'total1': groups[3][0].value + groups[4][0].value - groups[8][0].value - groups[9][0].value,
        };

    }





    return {
        'format': format,
    };

});