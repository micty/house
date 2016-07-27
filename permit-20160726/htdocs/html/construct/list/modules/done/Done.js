
define('/Done', function (require, module) {
    var $ = require('$');
    var KISP = require('KISP');

    var List = module.require('List');
    var Pager = module.require('Pager');

    var panel = KISP.create('Panel', '#div-panel-done');
    var list = [];
    var pageSize = KISP.data('pager').size;


    panel.on('init', function () {

        Pager.on({
            'change': function (no) {

                var begin = (no - 1) * pageSize;
                var end = begin + pageSize;
                var items = list.slice(begin, end);

                List.render(items);

            },
        });

        List.on({
            'cmd': function (cmd, item) {
                panel.fire(cmd, [item]);
            },
        });

    });


    panel.on('render', function (data) {


        list = data;

        Pager.render({
            'no': 1,
            'size': pageSize,
            'total': data.length,
        });

        var items = list.slice(0, pageSize);
        List.render(items);


    });


    return panel.wrap();


});