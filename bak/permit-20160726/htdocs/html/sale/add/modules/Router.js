

define('/Router', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');
    var Bridge = require('Bridge');

   
    var panel = KISP.create('Panel');


   




    panel.on('init', function () {

       
    });


 
    panel.on('render', function () {

        var qs = Url.getQueryString(window);
        var id = qs.id;

        if (id) { //说明是编辑的
            var data = {
                'id': id,
            };

            panel.fire('edit', [data]);

            return;
        }



        //说明是新增的。

        var planId = qs.planId;
        if (!planId) {
            KISP.alert('新增时必须指定规划记录 planId', function () {
                Bridge.close();
            });
            return;
        }

        var data = {
            'planId': planId,
        };

        panel.fire('new', [data]);
       
    });


    return panel.wrap();


});