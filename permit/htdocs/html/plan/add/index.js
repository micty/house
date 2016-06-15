
KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Bridge = require('Bridge');
    var User = require('User');

    var Url = MiniQuery.require('Url');

    var Base = module.require('Base');
    var License = module.require('License');


    if (!User.is('plan')) {
        KISP.alert('你没有权限操作本页面', function () {
            Bridge.close();
        });
        return;
    }






    License.on({
        'change': function () {
            Bridge.refresh(['plan', 'list']);
        },
        'add': function (planId) {
            Bridge.open({
                name: '新增规划许可证',
                url: 'html/plan/license/add/index.html?planId=' + planId,
            });
        },
        'edit': function (id) {
            Bridge.open({
                name: '编辑规划许可证',
                url: 'html/plan/license/add/index.html?id=' + id,
            });
        },
        'detail': function (id) {
            Bridge.open({
                name: '规划许可证详情',
                url: 'html/plan/license/detail/index.html?id=' + id,
            });
        },
    });


    Base.on({
        'change': function () {
            Bridge.refresh(['plan', 'list']);
        },
        'save': function (item) {
            if (!id) {
                id = item.id;
                Base.render(id); //让新增之后变成编辑状态。
                License.render(id);
            }
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



    var qs = Url.getQueryString(window);
    var id = qs.id;

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
