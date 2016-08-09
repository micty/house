

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
    //if (user.role != 'construct') {
    //    KISP.alert('您没有权限操作本页面', function () {
    //        Bridge.close();
    //    });
    //    return;
    //}

    var qs = Url.getQueryString(window);
    var id = qs.id;

    License.on({
        'change': function () {
            Bridge.refresh(['construct', 'list']);
        },
        'add': function (item) {
            Bridge.open({
                name: '新增施工许可证',
                url: 'html/construct/license/add/index.html?constructId=' + item.constructId,
            });
        },
        'edit': function (item) {
            Bridge.open({
                name: '编辑施工许可证',
                url: 'html/construct/license/add/index.html?id=' + item.id,
            });
        },
        'detail': function (item) {
            Bridge.open({
                name: '施工许可证详情',
                url: 'html/construct/license/detail/index.html?id=' + item.id,
            });
        },
    });

    Base.on({
        'change': function () {
            Bridge.refresh(['construct', 'list']);
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
    var landId = qs.landId;
    if (!landId) {
        KISP.alert('新增时必须指定 landId', function () {
            Bridge.close();
        });
        return;
    }


    Base.render(landId, true);
    License.render();


});
