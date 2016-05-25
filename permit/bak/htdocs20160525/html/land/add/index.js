﻿

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

        'post': function (data, json) {
            Bridge.close();
            Bridge.open(['land', 'list']);
            Bridge.refresh(['plan', 'list']);
            Bridge.refresh(['construct', 'list']);
            Bridge.refresh(['sale', 'list']);
        },

        'get': function (data) {
            Form.render(data);
        },

    });




    Header.on('submit', function () {

        var data = Form.get({'id': id, });
        if (!data) {
            return;
        }

        API.post(data);
    });


    Header.render();



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
