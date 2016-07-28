
define('/Done', function (require, module) {
    var $ = require('$');
    var KISP = require('KISP');

    var API = module.require('API');
    var List = module.require('List');
    var Pager = module.require('Pager');

    var panel = KISP.create('Panel', '#div-panel-done');


    panel.on('init', function () {

        API.on('success', {
            'get': function (list, page) {

                List.render(list);

                if (page.no == 1) {   //翻页引起的，不需要重新渲染。
                    Pager.render(page);
                }
            },

            'remove': function () {
                API.get(1);
            },
        });

        Pager.on({
            'change': function (no) {
                API.get(no);
            },
        });


        List.on({
            'cmd': function (cmd, item) {
                panel.fire(cmd, [item]);
            },
            'remove': function (item) {
                API.remove(item.construct.id);
            },
        });

    });


    panel.on('render', function (keyword) {

        API.get({
            'pageNo': 1,
            'keyword': keyword || '',
        });

    });

    return panel.wrap();


});