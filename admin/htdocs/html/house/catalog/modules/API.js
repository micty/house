

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

        var api = KISP.create('API', 'HouseCatalog.list', {
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
                var list = data.list;
                emitter.fire('success', 'get', [list]);
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


        loading = loading || KISP.create('Loading', {
            mask: 0,

        });

        var id = data.id;
        var action = id ? '更新' : '添加';

        loading.show(action + '中...');


     
        var name = id ? 'update' : 'add';
        var api = KISP.create('API', 'Recommend.' + name);


        api.on({

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
                    var list = format(data);

                    emitter.fire('success', 'post', [list]);

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



    return {
        get: get,
        post: post,

        on: emitter.on.bind(emitter),
    };


});