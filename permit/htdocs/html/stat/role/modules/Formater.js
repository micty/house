
define('/Formater', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var NumberField = require('NumberField');
    var Group = module.require('Group');


    //针对 `未办规划许可` 和 `未办施工许可` 隐藏功能分类。
    var excludes = {
        '住宅': true,
        '商业': true,
        '办公': true,
        '其它': true,
        '地下车库': true,
    };


    function exclude(groups) {
        groups.forEach(function (group) {
            group.forEach(function (item, index) {
                if (excludes[item.name]) {
                    item.hidden = true;
                }
            });
        });
    }


    function format(data, role) {


        var isLand = role == 'land';
        var clusters = Group.get(data);

        //列数组的数组，即列的二维数组。
        var colss = $.Array.keep(clusters, function (cluster, clusterNo) {

            var groups = cluster;

            var names = $.Array.keep(groups[0], function (item, index) {

                //只有土地的第一行和第二行需要加粗，其它的只需要第一行加粗。
                var isFirst = isLand ? index <= 1 : index == 0;

                return {
                    'text': item.name,
                    'isName': true,
                    'group': isFirst,
                    'subGroup': isFirst,
                    'hidden': item.hidden,
                };
            });


            //值数组的数组，即值的二维数组。
            var valuess = $.Array.keep(groups, function (group, groupNo) {

                group = $.Array.keep(group, function (item, index) {

                    var isFirst = isLand ? index <= 1 : index == 0;
                    var value = item.value;

                    return {
                        'value': value,
                        'text': NumberField.text(value),
                        'group': isFirst,
                        'subGroup': isFirst,
                        'hidden': item.hidden,
                    };
                });

                return group;
            });


            var cols = [names].concat(valuess);

            return cols;
        });


        var a = [];

        $.Array.each(colss, function (cols, no) {
            
            $.Array.each(cols, function (col, index) {

                a[index] = a[index] || [];
                a[index] = a[index].concat(col);

            });

        });

        var rows = $.Array.transpose(a);

        return {
            'rows': rows,
        };

    }





    return {
        'format': format,
    };

});