

define('/Saled', function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');

    var API = module.require('API');
    var Header = module.require('Header');
    var List = module.require('List');


    var current = null;
    var panel = KISP.create('Panel', '#div-panel-saled');

    panel.on('init', function () {


        Header.on('add', function () {
            panel.fire('add', [current.licenseId]);
        });


        API.on('success', {

            'get': function (data) {
                List.render(data);
            },

            'remove': function (data) {
                API.get(current.licenseId);
                panel.fire('change');
            },
            'post': function (data) {
                List.render(data);
                panel.fire('change');
            },
        });

        List.on({

            'detail': function (item, index) {
                panel.fire('detail', [item.id]);
            },

            'remove': function (item, index) {
                API.remove(item.id);
            },

            'edit': function (item, index) {
                panel.fire('edit', [item.id]);
            },
        });

    });

    panel.on('render', function (licenseId) {

        //新增的初始状态，只作展示，不能添加。
        if (!licenseId) {
            Header.render(false);
            List.render([]);
            return;
        }

        current = {
            'licenseId': licenseId,
        };

        API.get(licenseId);
        Header.render(true);

    });


    return panel.wrap();



});
