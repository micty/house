

define('/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var API = require('API');

    var Emitter = MiniQuery.require('Emitter');

    var emitter = new Emitter();
    var loading = null;

    var defaults = {
        'beginDate': '',
        'endDate': '',
    };


    //获取数据
    function post(options) {

        //注意，这里有记忆功能，上次的值会给记录下
        options = $.Object.extend(defaults, options || {});

        var api = new API('Stat.diy');


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

                emitter.fire('success', [data]);
            },

            'fail': function (code, msg, json, xhr) {
                KISP.alert('获取数据失败: {0} ({1})', msg, code);
            },

            'error': function (code, msg, json, xhr) {
                KISP.alert('获取数据错误: 网络繁忙，请稍候再试');
            },
        });

        api.post(options);


    }



    return {
        'post': post,
        'on': emitter.on.bind(emitter),
    };



});