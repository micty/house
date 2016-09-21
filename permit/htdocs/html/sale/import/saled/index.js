
KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');

    var API = module.require('API');
    var Header = module.require('Header');
    var Dialog = module.require('Dialog');
    var Main = module.require('Main');




    API.on('success', function (type) {
        Bridge.refresh(['sale', 'list']);
    });


    Header.on('import', function () {
        Dialog.render();
    });


    Dialog.on('submit', function (list) {
        Main.render(list);
    });


    Main.on({
        'submit': function (list) {
            API.post(list);
        },

        'detail': function (item) {
            var key = $.String.random();
            Bridge.data(key, item);
            Bridge.open({
                name: '已售记录详情预览',
                url: 'html/saled/detail/index.html?key=' + key,
            });
        },
    });


    Header.render();
    Main.render();


});
