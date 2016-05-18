

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
            Bridge.refresh(['construct', 'list']);
            Bridge.open(['construct', 'add'], {
                'id': current.constructId,
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

    var constructId = qs.constructId;
    if (!constructId) {
        KISP.alert('新增时必须指定 constructId', function () {
            Bridge.close();
        });
        return;
    }

    current = {
        'constructId': constructId,
    };

    Form.render(current);

});
