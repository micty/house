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
                list.sort(function (a, b) {
                    return a.date > b.date ? -1 : 1; //按截止日期倒序
                });

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




    return {
        'get': get,
        'on': emitter.on.bind(emitter),
    };


});