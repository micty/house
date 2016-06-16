
define('/Todo', function (require, module) {

    var $ = require('$');
    var KISP = require('KISP');

    var Header = module.require('Header');
    var List = module.require('List');
    var Pager = module.require('Pager');

    var panel = KISP.create('Panel', '#div-panel-todo');
    var list = [];
    var pageSize = KISP.data('pager').size;

    //var pageSize = 5;

    panel.on('init', function () {

        Header.on({
            'submit': function () {

                var items = list.map(function (item) {
                    item = $.Object.extend({}, item);
                    delete item['id'];
                    return item;
                });

                panel.fire('submit', [items]);
            },
        });


        Pager.on({
            'change': function (no) {

                var begin = (no - 1) * pageSize;
                var end = begin + pageSize;
                var items = list.slice(begin, end);

                List.render(items);

            },
        });

        List.on({

            'detail': function (item) {
                panel.fire('detail', [item]);
            },
            'remove': function (item) {
                
                var id = item.id;
                list = list.filter(function (item) {
                    return item.id != id;
                });

                panel.render(list);
            },
        });

    });




    panel.on('render', function (data) {

   
        data = data || [];
        list = data;

        Pager.render({
            'no': 1,
            'size': pageSize,
            'total': data.length,
        });

        var items = list.slice(0, pageSize);
        List.render(items);

        Header.render(list.length > 0);

   

    });



    return panel.wrap();


});