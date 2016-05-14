

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
    //if (user.role != 'plan') {
    //    KISP.alert('您没有权限操作本页面', function () {
    //        Bridge.close();
    //    });
    //    return;
    //}

    var qs = Url.getQueryString(window);
    var id = qs.id;

    License.on({
        'change': function () {
            Bridge.refresh(['plan', 'list']);
        },
    });

    Base.on({
        'change': function () {
            Bridge.refresh(['plan', 'list']);
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

   

    Base.on({
        'save': function (item) {
            License.render(item.id);
        },
    });

    License.hide();
    Base.render(landId, true);


});
