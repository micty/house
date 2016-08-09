

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


    var user = SessionStorage.get('user');
    var qs = Url.getQueryString(window);
    var id = qs.id;



    API.on('success', {

        'get': function (data) {
            Header.render();
            Form.render(data);
        },

        'post': function (data, json) {
            Bridge.close(); //这个要先执行。
            Bridge.open(['construct', 'list']);
           
        },


    });

    Header.on('save', function () {

        var data = Form.get();
        if (!data) {
            return;
        }

        API.post(data);
    });


    //说明是编辑的。
    if (id) {
        API.get(id, false);
        return;
    }



    //说明是新增的。
    var licenseId = qs.licenseId;
    if (!licenseId) {
        KISP.alert('新增时必须指定规划许可证 licenseId', function () {
            Bridge.close();
        });
        return;
    }

    API.get(licenseId, true);



});
