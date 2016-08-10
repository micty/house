

define('/Saled', function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');
    var API = module.require('API');
    var List = module.require('List');


    var panel = KISP.create('Panel', '#div-panel-saled');

    panel.on('init', function () {

        API.on('success', {
            'get': function (data) {
                List.render(data);
            },
        });

        List.on({
            'detail': function (item, index) {
                panel.fire('detail', [item.id]);
            },
        });

    });

    panel.on('render', function (licenseId) {

        API.get(licenseId);

    });


    return panel.wrap();



});
