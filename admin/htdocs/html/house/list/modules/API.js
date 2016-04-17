

define('/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');
    var emitter = new Emitter();
    var loading = null;
    var toast = null;




    function format(all) {

        var name$list = {};

        $.Array.each(all, function (item, index) {

            var price = item.price;

            var name =
                price == 0 ? '价格待定楼盘' :
                price < 8000 ? '8千元/平米以下楼盘' :
                price <= 10000 ? '8千-1万元/平米楼盘' :
                price <= 12000 ? '1-1.2万元/平米楼盘' :
                price > 12000 ? '1.2万元/平米以上楼盘' : '未知分类';

            var list = name$list[name];
            if (!list) {
                list = name$list[name] = [];
            }

            list.push(item);

        });

        var groups = [];

        $.Object.each(name$list, function (area, list) {

            groups.push({
                'name': area,
                'items': list,
            });
        });


        return groups;

    }

    //获取数据
    function get() {

        var api = KISP.create('API', 'House2.list', {
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

                var list = format(data);
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





    function remove(id) {

        var api = KISP.create('API', 'House2.remove');


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
                    var list = format(data);

                    emitter.fire('success', 'remove', [list]);

                }, 1500);

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
        remove: remove,
        on: emitter.on.bind(emitter),
    };


});