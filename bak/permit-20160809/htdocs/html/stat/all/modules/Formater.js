
define('/Formater', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Group = module.require('Group');
    var List = module.require('List');



    //针对 `未办规划许可` 和 `未办施工许可` 隐藏功能分类。
    var excludes = {
        '住宅': true,
        '商业': true,
        '办公': true,
        '其它': true,
        '地下车库': true,
    };


    function exclude(group) {
        group.forEach(function (item, index) {
            if (excludes[item.text]) {
                item.hidden = true;
            }
        });
    }
    


    function format(data) {


        //基础
        var groups = Group.get(data);

        //空白组
        groups[5] = Group.getEmpty(groups[0]);

        //未办规划许可。
        groups[6] = Group.substract(groups[0], groups[1], '未办规划许可');
        exclude(groups[6]);


        //未办施工许可。
        //未办施工许可 = 土地出让 - 已办施工许可
        groups[7] = Group.substract(groups[0], groups[2], '未办施工许可');
        exclude(groups[7]);



        var cols = groups.slice(0, 5).map(function (group, index) {
            return group.concat(groups[5 + index]);
        });

        //对数组进行转置。 即把数组的行与列对换，返回一个新数组。
        var rows = $.Array.transpose(cols);


        return {
            'rows': rows,

            'total0': groups[0][0].value - groups[8][0].value - groups[9][0].value,
            'total1': groups[3][0].value + groups[4][0].value - groups[8][0].value - groups[9][0].value,

            'total2': groups[0][1].value - groups[8][1].value - groups[9][1].value,
            'total3': groups[3][1].value + groups[4][1].value - groups[8][1].value - groups[9][1].value,

            'total4': groups[0][6].value - groups[8][6].value - groups[9][6].value,
            'total5': groups[3][6].value + groups[4][6].value - groups[8][6].value - groups[9][6].value,
        };

    }








    return {
        'format': format,
    };

});