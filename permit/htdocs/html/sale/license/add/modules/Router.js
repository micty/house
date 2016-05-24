

define('/Router', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

   
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

            panel.fire('render', [data]);
            panel.fire('edit', [data]);

            return;
        }




        //说明是新增的。

        var saleId = qs.saleId;
        if (!saleId) {
            KISP.alert('新增时必须指定 saleId', function () {
                Bridge.close();
            });
            return;
        }

        var type = qs.type;
        if (!type) {
            KISP.alert('新增时必须指定 type', function () {
                Bridge.close();
            });
            return;
        }


        var data = {
            'saleId': saleId,
            'type': type,
        };

        panel.fire('render', [data]);
        panel.fire('new', [data]);
       
    });


    return panel.wrap();


});