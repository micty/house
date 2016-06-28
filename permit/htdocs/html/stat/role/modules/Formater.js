
define('/Formater', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var NumberField = require('NumberField');
    var Group = module.require('Group');
    var StatTown = module.require('StatTown');


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

        var clusters = []; 
        var bases = Group.getBases(data);
        var sizes = null;

        switch (role) {
            case 'land':
                clusters[0] = bases[0];
                sizes = StatTown.get(data.lands, '土地出让');
            
                break;

            case 'plan':
                clusters[0] = bases[1];
                clusters[1] = Group.substract(bases[0], bases[1], '未办规划许可');
                exclude(clusters[1]);
                break;

            case 'construct':
                clusters[0] = bases[2];

                //未办施工许可 = 土地出让 - 已办施工许可
                clusters[1] = Group.substract(bases[0], bases[2], '未办施工许可');
                exclude(clusters[1]);

                break;

            case 'sale':
                clusters = bases.slice(3);
                break;

        }



        //列数组的数组，即列的二维数组。
        var colss = $.Array.keep(clusters, function (cluster, clusterNo) {

            var groups = cluster;

            //针对土地，把土地面积放在第一行。
            if (sizes) {
                sizes.forEach(function (item, index) {
                    groups[index] = [item].concat(groups[index]);
                });
            }


            var names = $.Array.keep(groups[0], function (item, index) {

                //只有土地的第一行和第二行需要加粗，其它的只需要第一行加粗。
                var isFirst = sizes ? index <= 1 : index == 0;

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

                    var isFirst = sizes ? index <= 1 : index == 0;
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