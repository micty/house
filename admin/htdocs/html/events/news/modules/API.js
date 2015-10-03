

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

        loading = loading || KISP.create('Loading', {
            
        });

        loading.show('加载中...');

        var api = KISP.create('API', 'EventsNews.list');


        api.on({

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
                if (!json) { // http 协议连接错误
                    msg = '网络繁忙，请稍候再试';
                }

                KISP.alert(msg);
            },
        });

        api.get();


    }



    function remove(id) {

        loading = loading || KISP.create('Loading', {
           
        });

        loading.show('删除中...');

        var api = KISP.create('API', 'EventsNews.remove');


        api.on({

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

                KISP.alert('获取数据失败: {0} ({1})', msg, code);

            },

            'error': function (code, msg, json, xhr) {
                if (!json) { // http 协议连接错误
                    msg = '网络繁忙，请稍候再试';
                }

                KISP.alert(msg);
            },
        });

        api.get({
            'id': id,
        });

    }





    function post(data) {


        loading = loading || KISP.create('Loading', {
            mask: 0,

        });

        var id = data.id;

        var text = id ? '更新中...' : '添加中...';
        loading.show(text);


     
        var name = id ? 'update' : 'add';
        var api = KISP.create('API', 'EventsNews.' + name);


        api.on({

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {

                toast = toast || KISP.create('Toast', {
                    duration: 1500,
                    mask: 0,
                });

                toast.show(id ? '更新成功' : '添加成功');

                setTimeout(function () {
                    emitter.fire('success', 'post', [data]);

                }, 1500);

            },


            'fail': function (code, msg, json) {
                alert('添加失败: {0}({1})', msg, code);
            },

            'error': function () {
                alert('添加错误: 网络繁忙，请稍候再试');
            },
        });



        api.post(data);


    }



    return {
        get: get,
        post: post,
        remove: remove,
        on: emitter.on.bind(emitter),
    };


});