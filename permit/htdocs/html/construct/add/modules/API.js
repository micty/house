
define('/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var API = require('API');

    var Emitter = MiniQuery.require('Emitter');

    var emitter = new Emitter();
    var loading = null;
    var toast = null;




    function post(data) {

        var name = data.id ? 'update' : 'add';
        var api = new API('Construct.' + name);

        api.on({
            'request': function () {
                loading = loading || KISP.create('Loading', {
                    mask: 0,
                });
                loading.show('提交中...');
            },

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {

                toast = toast || KISP.create('Toast', {
                    text: '提交成功',
                    duration: 1500,
                    mask: 0,
                });

                toast.show();

                setTimeout(function () {
                    emitter.fire('success', 'post', [data]);

                }, 1500);

            },
 

            'fail': function (code, msg, json) {
                KISP.alert('提交失败: {0}', msg);
            },

            'error': function () {
                KISP.alert('提交错误: 网络繁忙，请稍候再试');
            },
        });


        api.post(data);


    }


    function get(id, isLicense) {

        var name = isLicense ? 'PlanLicense.get' : 'Construct.get';
        var api = new API(name);

        api.on({
            'request': function () {
                loading = loading || KISP.create('Loading', {
                    mask: 0,
                });
                loading.show('读取中...');
            },

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {
                emitter.fire('success', 'get', [data]);
            },

            'fail': function (code, msg, json) {
                KISP.alert('读取失败: {0}', msg);
            },

            'error': function () {
                KISP.alert('读取错误: 网络繁忙，请稍候再试');
            },
        });


        var data = { 'id': id };
        if (isLicense) {
            data.refer = true;  //获取关联的外键信息
        }

        api.get(data);

    }



    return {
        'get': get,
        'post': post,
        'on': emitter.on.bind(emitter),
    };


});