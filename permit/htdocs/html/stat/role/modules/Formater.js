
define('/Formater', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var NumberField = require('NumberField');
    var Group = module.require('Group');




    function format(data, role) {

        var clusters = []; 
        var bases = Group.getBases(data); 

        switch (role) {
            case 'land':
                clusters[0] = bases[0];
                break;

            case 'plan':
                clusters[0] = bases[1];
                clusters[1] = Group.substract(bases[0], bases[1], '未办规划许可');
                break;

            case 'construct':
                clusters[0] = bases[2];
                clusters[1] = Group.substract(bases[1], bases[2], '未办施工许可');
                break;

            case 'sale':
                clusters = bases.slice(3);
                break;

        }

        console.dir(clusters);


        //列数组的数组，即列的二维数组。
        var colss = $.Array.keep(clusters, function (cluster, clusterNo) {

            var groups = cluster;

            var names = $.Array.keep(groups[0], function (item, index) {

                var isFirst = index == 0;

                return {
                    'text': item.name,
                    'isName': true,
                    'group': isFirst,
                    'subGroup': isFirst,
                };
            });


            //值数组的数组，即值的二维数组。
            var valuess = $.Array.keep(groups, function (group, groupNo) {

                group = $.Array.keep(group, function (item, index) {

                    var isFirst = index == 0;
                    var value = item.value;

                    return {
                        'text': NumberField.text(value),
                        'group': isFirst,
                        'subGroup': isFirst,
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