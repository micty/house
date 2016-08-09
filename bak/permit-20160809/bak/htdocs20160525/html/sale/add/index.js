

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
        'add': function (type, saleId) {
            Bridge.open({
                name: type == 0 ? '新增预售许可证' : '新增现售备案',
                url: Url.addQueryString('html/sale/license/add/index.html', {
                    'type': type,
                    'saleId': saleId,
                }),
            });
        },
        'edit': function (item) {
            Bridge.open({
                name: item.type == 0 ? '编辑预售许可证' : '编辑现售备案',
                url: 'html/sale/license/add/index.html?id=' + item.id,
            });
        },
        'detail': function (item) {
            Bridge.open({
                name: item.type == 0 ? '预售许可证详情' : '现售备案详情',
                url: 'html/sale/license/detail/index.html?id=' + item.id,
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
