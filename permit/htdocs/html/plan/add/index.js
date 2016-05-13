

KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Bridge = require('Bridge');
    var SessionStorage = require('SessionStorage');

    var Url = MiniQuery.require('Url');

    
    var API = module.require('API');
    var Form = module.require('Form');
    var Footer = module.require('Footer');
    var License = module.require('License');




    API.on('success', {

        'post': function (data, json) {
            Bridge.open(['plan', 'list']);
        },

        'get': function (data) {
            Form.render(data);
        },

    });




    Footer.on('submit', function () {

        var data = Form.get();
        if (!data) {
            return;
        }

        API.post(data);
    });


    Footer.render();



    var user = SessionStorage.get('user');
    //if (user.role != 'plan') {
    //    KISP.alert('您没有权限操作本页面', function () {
    //        Bridge.close();
    //    });
    //    return;
    //}

    var qs = Url.getQueryString(window);
    var id = qs.id;

    if (id) { //说明是编辑的
        API.get(id);
        License.render(id);
        return;
    }

    var landId = qs.landId;
    if (!landId) {
        KISP.alert('新增时必须指定 landId', function () {
            Bridge.close();
        });
        return;
    }

    API.get(landId, true);



});
