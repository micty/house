

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




    Base.on({
        'render': function (data) {
            Header.render(data);
        },
        'change': function () {
            Bridge.refresh(['sale', 'list']);
        },
        'add': function (item) {
            Base.render(item); //让新增之后变成编辑状态。
            //Saled.render(item);
        },
    });



    Router.on({
        'new': function (data) {
            Base.render(data);
            //Saled.render();
        },

        'edit': function (data) {
            Base.render(data);
            //Saled.render(data);
        },
    });



    Router.render();

});
