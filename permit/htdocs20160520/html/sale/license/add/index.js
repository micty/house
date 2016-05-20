

KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Bridge = require('Bridge');
    var SessionStorage = require('SessionStorage');

    var Url = MiniQuery.require('Url');


    var API = module.require('API');
    var Form = module.require('Form');
    var Header = module.require('Header');

    var current = null;


    API.on('success', {

        'post': function (data, json) {
            Bridge.close();
            Bridge.refresh(['sale', 'list']);
            Bridge.open(['sale', 'add'], {
                'id': current.saleId,
            });
        },

        'get': function (data) {
            current = data;
            Form.render(data);
        },

    });

    Header.on('submit', function () {

        var data = Form.get(current);
        if (!data) {
            return;
        }

        API.post(data);
    });


    Header.render();



    var qs = Url.getQueryString(window);
    var id = qs.id;

    if (id) { //说明是编辑的
        API.get(id);
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

    current = {
        'saleId': saleId,
    };

    Form.render(current);

});
