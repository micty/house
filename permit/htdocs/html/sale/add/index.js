

KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Bridge = require('Bridge');
    var SessionStorage = require('SessionStorage');

    var Url = MiniQuery.require('Url');

    var Base = module.require('Base');
    var License = module.require('License');


    var user = SessionStorage.get('user');
    var qs = Url.getQueryString(window);
    var id = qs.id;

    License.on({
        'change': function () {
            Bridge.refresh(['sale', 'list']);
        },
        'add': function (saleId) {
            Bridge.open({
                name: '新增预售许可证',
                url: 'html/sale/license/add/index.html?saleId=' + saleId,
            });
        },
        'edit': function (id) {
            Bridge.open({
                name: '编辑预售许可证',
                url: 'html/sale/license/add/index.html?id=' + id,
            });
        },
        'detail': function (id) {
            Bridge.open({
                name: '预售许可证详情',
                url: 'html/sale/license/detail/index.html?id=' + id,
            });
        },
    });

    Base.on({
        'change': function () {
            Bridge.refresh(['sale', 'list']);
        },
        'save': function (item) {
            if (!id) {
                id = item.id;
                Base.render(id); //让新增之后变成编辑状态。
                License.render(id);
            }
        },
    });



    //说明是编辑的。
    if (id) { 
        Base.render(id);
        License.render(id);
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


    Base.render(licenseId, true);
    License.render();


});
