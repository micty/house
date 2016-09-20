

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

    panel.on('render', function (data) {

        //传进来的是预览数据对象。
        if (typeof data == 'object') {
            List.render([data]);
            return;
        }

        //传进来的是 licenseId
        API.get(data);
        
    });


    return panel.wrap();



});
