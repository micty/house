

KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Bridge = require('Bridge');
    var User = require('User');
    var Url = MiniQuery.require('Url');

    var Base = module.require('Base');
    var License = module.require('License');
    var Router = module.require('Router');


    if (!User.is('sale')) {
        KISP.alert('你没有权限操作本页面', function () {
            Bridge.close();
        });
        return;
    }


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
        'add': function (item) {
            Base.render(item); //让新增之后变成编辑状态。
            License.render(item);
        },
    });



    Router.on({


        'new': function (data) {
            Base.render(data);
            License.render();
        },

        'edit': function (data) {
            Base.render(data);
            License.render(data);
        },
    });


    Router.render();







});
