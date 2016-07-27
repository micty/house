﻿

define('/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var API = require('API');

    var Emitter = MiniQuery.require('Emitter');

    var emitter = new Emitter();
    var loading = null;

    //获取数据
    function get(id) {

        var api = new API('PlanLicense.get');

        api.on({
            'request': function () {
                loading = loading || top.KISP.create('Loading', {
                    mask: 0,
                });
                loading.show('加载中...');
            },

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {
                emitter.fire('success', 'get', [data]);
            },

            'fail': function (code, msg, json, xhr) {
                top.KISP.alert('获取数据失败: {0} ({1})', msg, code);
            },

            'error': function (code, msg, json, xhr) {
                top.KISP.alert('获取数据错误: 网络繁忙，请稍候再试');
            },
        });

        api.get({
            'id': id,
        });
    }





    return {
        'get': get,
        'on': emitter.on.bind(emitter),
    };


});