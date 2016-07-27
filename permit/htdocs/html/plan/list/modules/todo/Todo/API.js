﻿

define('/Todo/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var API = require('API');

    var Emitter = MiniQuery.require('Emitter');

    var emitter = new Emitter();
    var loading = null;

    var defaults = {
        'pageNo': 1,
        'pageSize': KISP.data('pager').size,
        'keyword': '',
    };


    function normalize(opt) {
        switch (typeof opt) {
            case 'number': //重载 normalize(pageNo)
                opt = { 'pageNo': opt };
                break;

            case 'string': //重载 normalize(keyword)
                opt = { 'keyword': opt, 'pageNo': 1, };
                break;
        }

        //注意，这里有记忆功能，上次的值会给记录下
        opt = $.Object.extend(defaults, opt);
        return opt;
    }


    /**
    * 获取指定条件的记录列表。
    */
    function get(opt) {

        opt = normalize(opt);

        var api = new API('Plan.todos');

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

                var list = data['list'];

                emitter.fire('success', [list, {
                    'total': data.total,    //总记录数
                    'no': opt.pageNo,
                    'size': opt.pageSize,
                }]);
            },

            'fail': function (code, msg, json, xhr) {
                top.KISP.alert('获取数据失败: {0}', msg);
            },

            'error': function (code, msg, json, xhr) {
                top.KISP.alert('获取数据错误: 网络繁忙，请稍候再试');
            },
        });

        api.post(opt);

    }


    return {
        'get': get,
        'on': emitter.on.bind(emitter),
    };


});