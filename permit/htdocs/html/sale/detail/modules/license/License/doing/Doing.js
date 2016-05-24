

define('/License/Doing', function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');


    var List = module.require('List');



    var panel = KISP.create('Panel', '#div-panel-license-doing');


    panel.on('init', function () {

 

        List.on({
            'detail': function (item, index) {
                panel.fire('detail', [item]);
            },

            'edit': function (item, index) {
                panel.fire('edit', [item]);
            },

            'remove': function (item, index) {
                panel.fire('remove', [item]);
            },
        });

    });




    panel.on('render', function (data) {

        //新增的初始状态，只作展示，不能添加。
        if (!data) {
            List.render([]);
            return;
        }
 
        List.render(data);

    });


    return panel.wrap();


    
});
