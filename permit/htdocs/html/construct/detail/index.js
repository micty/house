

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
    });

    Header.on('edit', function () {
        Bridge.open(['construct', 'add'], {
            'id': id,
        });
    });


    Form.on('detail', {
        'land': function (land) {
            Bridge.open({
                name: '土地出让详情',
                url: 'html/land/detail/index.html?id=' + land.id,
            });
        },
        'plan': function (plan) {
            Bridge.open({
                name: '规划许可详情',
                url: 'html/plan/detail/index.html?id=' + plan.id,
            });
        },
        'license': function (license) {
            Bridge.open({
                name: '规划许可证详情',
                url: 'html/plan/license/detail/index.html?id=' + license.id,
            });
        },
    });



    if (!id) {
        KISP.alert('必须指定 id', function () {
            Bridge.close();
        });
        return;

    
    }

    API.get(id);
   



});
