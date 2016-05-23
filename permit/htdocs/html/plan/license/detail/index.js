

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


    API.on('success', {
        'get': function (data) {
            Form.render(data.license);
            Header.render();
        },

    });


    Header.on('submit', function () {
        Bridge.open({
            name: '编辑规划许可证',
            url: 'html/plan/license/add/index.html?id=' + id,
        });

    });




    var qs = Url.getQueryString(window);
    var id = qs.id;

    if (!id) {
        KISP.alert('请传入 id');
        return;
    }

    API.get(id);

});
