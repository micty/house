

KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Bridge = require('Bridge');
    var SessionStorage = require('SessionStorage');

    var Url = MiniQuery.require('Url');

    var Base = module.require('Base');
    var License = module.require('License');
    var Header = module.require('Header');

    var user = SessionStorage.get('user');
    var qs = Url.getQueryString(window);
    var id = qs.id;



    if (!id) {
        KISP.alert('缺少 id', function () {
            Bridge.close();
        });
        return;
    }


    License.on({
        'detail': function (id) {
            Bridge.open({
                name: '预售许可证详情',
                url: 'html/sale/license/detail/index.html?id=' + id,
            });
        },
    });


    Header.on('edit', function () {
        Bridge.open(['sale', 'add'], {
            'id': id,
        });
    });

    Header.render();
    Base.render(id);
    License.render(id);


});
