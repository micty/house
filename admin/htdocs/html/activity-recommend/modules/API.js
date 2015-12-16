

define('/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');
    var emitter = new Emitter();
    var loading = null;
    var toast = null;




    function format(all) {

        var belong$list = {};

        $.Array.each(all, function (item, index) {

            var belong = item.belong;
            var list = belong$list[belong];
            if (!list) {
                list = belong$list[belong] = [];
            }

            list.push(item);

        });

        var groups = [];

        $.Object.each(belong$list, function (belong, list) {

            list.sort(function (a, b) {
                a = a.prioriy || 0;
                b = b.prioriy || 0;

                return a - b;
            });

            groups.push({
                'name': belong,
                'items': list,
            });
        });


        return groups;

    }

    //获取数据
    function get() {

        loading = loading || KISP.create('Loading', {
            
        });

        loading.show('加载中...');



        var api = KISP.create('API', 'ActivityRecommend.list', {
            //proxy: 'api/GetRecommedList.js',
        });


        api.on({
            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {

                var list = format(data);
                emitter.fire('success', 'get', [list]);
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

        var api = KISP.create('API', 'ActivityRecommend.remove');


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
                    var list = format(data);

                    emitter.fire('success', 'remove', [list]);

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
        var action = id ? '更新' : '添加';

        loading.show(action + '中...');


     
        var name = id ? 'update' : 'add';
        var api = KISP.create('API', 'ActivityRecommend.' + name);


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
        remove: remove,
        on: emitter.on.bind(emitter),
    };


});