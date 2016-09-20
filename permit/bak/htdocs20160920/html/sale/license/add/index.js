

KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Bridge = require('Bridge');
    var User = require('User');


    var Header = module.require('Header');
    var Base = module.require('Base');
    var Saled = module.require('Saled');
    var Router = module.require('Router');

    if (!User.is('sale')) {
        KISP.alert('你没有权限操作本页面', function () {
            Bridge.close();
        });
        return;
    }


    var current = null;


    Saled.on({
        'change': function () {
            
        },
        'add': function (licenseId) {
            var sn = Bridge.sn();
            Bridge.open({
                name: '新增已售记录',
                url: 'html/sale/saled/add/index.html?licenseId=' + licenseId + '&sn=' + sn,
            });
        },
        'edit': function (id) {
            var sn = Bridge.sn();
            Bridge.open({
                name: '编辑已售记录',
                url: 'html/sale/saled/add/index.html?id=' + id + '&sn=' + sn,
            });
        },
        'detail': function (id) {
            Bridge.open({
                name: '已售记录详情',
                url: 'html/sale/saled/detail/index.html?id=' + id,
            });
        },
    });



    Base.on({
        'render': function (data) {
            Header.render(data);
        },
        'change': function () {
            Bridge.refresh(['sale', 'list']);
        },
        'add': function (item) {
            Base.render(item); //让新增之后变成编辑状态。
            Saled.render(item);
        },
    });



    Router.on({
        'new': function (data) {
            Base.render(data);
            Saled.render();
        },

        'edit': function (id) {
            Base.render(id);
            Saled.render(id);
        },
    });



    Router.render();

});
