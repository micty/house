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
    var Footer = module.require('Footer');

    var current = null;


    API.on('success', {

        'post': function (data, json) {
            Bridge.close();
            Bridge.refresh(['plan', 'list']);
            Bridge.open(['plan', 'add'], {
                'id': current.planId,
            });
        },

        'get': function (data) {
            current = data;
            Form.render(data);
        },

    });

    Footer.on('submit', function () {

        var data = Form.get(current);
        if (!data) {
            return;
        }

        API.post(data);
    });


    Footer.render();



    var qs = Url.getQueryString(window);
    var id = qs.id;

    if (id) { //说明是编辑的
        API.get(id);
        return;
    }

    //说明是新增的。

    var planId = qs.planId;
    if (!planId) {
        KISP.alert('新增时必须指定 planId', function () {
            Bridge.close();
        });
        return;
    }

    current = {
        'planId': planId,
    };

    Form.render(current);

});
