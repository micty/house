

KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Bridge = require('Bridge');
    var User = require('User');
    var Url = MiniQuery.require('Url');

    var API = module.require('API');
    var Form = module.require('Form');
    var Header = module.require('Header');

    if (!User.is('plan')) {
        KISP.alert('你没有权限操作本页面', function () {
            Bridge.close();
        });
        return;
    }


    API.on('success', {
        'post': function (data, json) {
            var sn = Url.getQueryString(window, 'sn');
            Bridge.close();
            Bridge.refresh({'sn': sn});
        },

        'get': function (data) {
            Form.render(data);
        },

    });

    Header.on('submit', function () {
        var data = Form.get(true);
        if (!data) {
            return;
        }

   

        API.post(data);
    });


    Header.render();



    var qs = Url.getQueryString(window);

    //说明是编辑的
    var id = qs.id;
    if (id) { 
        API.get(id);
        return;
    }



    //说明是新增的。
    var licenseId = qs.licenseId;
    if (!licenseId) {
        KISP.alert('新增时必须指定 licenseId', function () {
            Bridge.close();
        });
        return;
    }

    API.get(licenseId, true);



});
