﻿

define('/Saled/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var API = require('API');

    var Emitter = MiniQuery.require('Emitter');

    var emitter = new Emitter();
    var loading = null;
    var toast = null;

    //获取数据
    function get(licenseId) {
        var api = new API('Saled.list');

        api.on({
            'request': function () {
                loading = loading || KISP.create('Loading', {
                    mask: 0,
                });
                loading.show('加载中...');
            },

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {
                var list = data;
           
                emitter.fire('success', 'get', [list]);
            },

            'fail': function (code, msg, json, xhr) {
                KISP.alert('获取数据失败: {0} ({1})', msg, code);
            },

            'error': function (code, msg, json, xhr) {
                KISP.alert('获取数据错误: 网络繁忙，请稍候再试');
            },
        });

        api.get({
            'licenseId': licenseId,
        });


    }




    function remove(id) {

        var api = new API('Saled.remove');

        api.on({
            'request': function () {
                loading = loading || KISP.create('Loading');
                loading.show('删除中...');
            },

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {
                var list = data;
                
                emitter.fire('success', 'remove', [list]);
            },

            'fail': function (code, msg, json, xhr) {
                KISP.alert('删除数据失败: {0} ({1})', msg, code);
            },
            'error': function (code, msg, json, xhr) {
                KISP.alert('删除数据错误: 网络繁忙，请稍候再试');
            },
        });

        api.get({
            'id': id,
        });

    }



    return {
        'get': get,
        'remove': remove,
        'on': emitter.on.bind(emitter),
    };


});