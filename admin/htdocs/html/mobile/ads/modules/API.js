

define('/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');
    var emitter = new Emitter();
    var loading = null;
    var toast = null;


    //获取数据
    function get() {

        var api = KISP.create('API', 'Mobile.Ads.list', {
            //proxy: 'api/GetRecommedList.js',
        });


        api.on({
            'request': function () {
                loading = loading || KISP.create('Loading', {

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
                KISP.alert('获取数据失败: {0} ({1})', msg, code);
            },

            'error': function (code, msg, json, xhr) {
                KISP.alert('网络繁忙，请稍候再试');
            },
        });

        api.get();
    }







    function post(data) {


        var id = data.id;
        var name = id ? 'update' : 'add';
        var action = id ? '更新' : '添加';

        var api = KISP.create('API', 'Mobile.Ads.' + name);


        api.on({

            'request': function () {
                loading = loading || KISP.create('Loading', {

                });
                
                loading.show(action + '中...');

            },

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {

                toast = toast || KISP.create('Toast', {
                    duration: 1500,
                    mask: 0,
                });

                toast.show(action + '成功');

                setTimeout(function () {

                    emitter.fire('success', 'post', [data]);

                }, 1500);

            },


            'fail': function (code, msg, json) {
                KISP.alert(action + '失败: {0}({1})', msg, code);
            },

            'error': function () {
                KISP.alert(action + '错误: 网络繁忙，请稍候再试');
            },
        });



        api.post(data);


    }




    function remove(id) {

        var api = KISP.create('API', 'Mobile.Ads.remove');


        api.on({

            'request': function () {
                loading = loading || KISP.create('Loading', {

                });

                loading.show('删除中...');
            },

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {

                toast = toast || KISP.create('Toast', {
                    duration: 1500,
                    mask: 0,
                });

                toast.show('删除成功');

                setTimeout(function () {
                    emitter.fire('success', 'remove', [data]);
                }, 1500);

            },



            'fail': function (code, msg, json, xhr) {
                KISP.alert('删除数据失败: {0} ({1})', msg, code);
            },

            'error': function (code, msg, json, xhr) {
                KISP.alert('网络繁忙，请稍候再试');
            },
        });

        api.get({
            'id': id,
        });

    }



    return {
        get: get,
        post: post,
        remove: remove,
        on: emitter.on.bind(emitter),
    };


});