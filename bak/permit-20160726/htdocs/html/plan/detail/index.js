

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

    Header.on('edit', function () {
        Bridge.open(['plan', 'add'], {
            'id': id,
        });
    });

    License.on({
        'detail': function (id) {
            Bridge.open({
                name: '规划许可证详情',
                url: 'html/plan/license/detail/index.html?id=' + id,
            });
        },
    });

    Base.on('detail', {
        'land': function (land) {
            Bridge.open({
                name: '土地出让详情',
                url: 'html/land/detail/index.html?id=' + land.id,
            });
        },
    });


    Header.render();
    Base.render(id);
    License.render(id);


});
