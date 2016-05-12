

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


    API.on('success', {

        'post': function (data, json) {
            Bridge.open(['land', 'list']);
        },

        'get': function (data) {
            Form.render(data);
        },

    });




    Footer.on('submit', function () {

        var data = Form.get(id);
        if (!data) {
            return;
        }

        API.post(data);
    });


    Footer.render();



    var user = SessionStorage.get('user');
    if (user.role != 'land') {
        KISP.alert('您没有权限操作本页面', function () {
            Bridge.close();
        });

        return;
    }

    var qs = Url.getQueryString(window);
    var id = qs.id;

    if (id) { //说明是编辑的
        API.get(id);
    }
    else {
        Form.render();
    }



});
