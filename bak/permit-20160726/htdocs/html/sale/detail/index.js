

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
        Bridge.open(['sale', 'add'], {
            'id': id,
        });
    });

    License.on({
        'detail': function (item) {
            Bridge.open({
                name: item.type == 0 ? '预售许可证详情' : '现售备案详情',
                url: 'html/sale/license/detail/index.html?id=' + item.id,
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
        'plan': function (plan) {
            Bridge.open({
                name: '规划许可详情',
                url: 'html/plan/detail/index.html?id=' + plan.id,
            });
        },
    });



    Header.render();
    Base.render(id);
    License.render(id);

});
