﻿

define('/License', function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');

    var API = module.require('API');
    var Header = module.require('Header');
    var List = module.require('List');


    var current = null;
    var panel = KISP.create('Panel', '#div-panel-license');

    panel.on('init', function () {


        Header.on('add', function () {
            panel.fire('add', [current]);
        });


        API.on('success', {

            'get': function (data) {
                List.render(data);
            },

            'remove': function (data) {
                List.render(data);
                panel.fire('change');
            },
            'post': function (data) {
                List.render(data);
                panel.fire('change');
            },
        });

        List.on({

            'detail': function (item, index) {
                panel.fire('detail', [item]);
            },

            'remove': function (item, index) {
                API.remove(item.id);
            },

            'edit': function (item, index) {
                panel.fire('edit', [item]);
            },
        });

    });

    panel.on('render', function (constructId) {

        //新增的初始状态，只作展示，不能添加。
        if (!constructId) {
            Header.render(false);
            List.render([]);
            return;
        }

        current = {
            'constructId': constructId,
        };

        API.get(constructId);
        Header.render(true);
    });


    return panel.wrap();


    
});
