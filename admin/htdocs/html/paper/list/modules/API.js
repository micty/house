

define('/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');


    var emitter = new Emitter();


    var loading = null;




    //获取数据
    function get(type) {

        loading = loading || top.KISP.create('Loading', {
            
        });

        loading.show('加载中...');

        var api = KISP.create('API', 'Paper.list');


        api.on({

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {

                var list = $.Array.keep(data, function (item, index) {
                    item.title = decodeURIComponent(item.title);
                    item.type = type;
                    return item;
                });


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

        api.get({
            'type': type,
        });


    }



    function remove(type, id) {

        loading = loading || KISP.create('Loading', {
           
        });

        loading.show('删除中...');

        var api = KISP.create('API', 'Paper.remove');


        api.on({

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {

                var list = $.Array.keep(data, function (item, index) {
                    item.title = decodeURIComponent(item.title);
                    return item;
                });

                //二级模板填充所需要的数据格式
                list = [
                    {
                        items: list,
                    },
                ];

                emitter.fire('success', 'remove', [list]);

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
            'type': type,
            'id': id,
        });

    }



    return {
        get: get,
        remove: remove,
        on: emitter.on.bind(emitter),
    };


});