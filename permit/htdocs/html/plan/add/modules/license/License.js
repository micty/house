

define('/License', function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');

    var API = module.require('API');
    var Header = module.require('Header');
    var List = module.require('List');

    var currentIndex = -1;


    var panel = KISP.create('Panel', '#div-panel-license');

    panel.on('init', function () {


        Header.on('add', function () {
            Bridge.open(['land', 'add']);
        });

        API.on('success', {

            'get': function (data) {
                List.render(data);
            },

            'remove': function () {
                List.remove(currentIndex);
            },
        });

        List.on({

            'detail': function (item, index) {
                Bridge.open({
                    name: '土地出让详情',
                    url: 'html/land/detail/index.html?id=' + item.id,
                });
            },

            'remove': function (item, index) {
                currentIndex = index;
                API.remove(item.id);
            },

            'edit': function (item, index) {

                Bridge.open(['land', 'add'], {
                    'id': item.id,
                });
            },
        });

    });

    panel.on('render', function (planId) {

        API.get(planId);
        Header.render();
    });


    return panel.wrap();


    
});
