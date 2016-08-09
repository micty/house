

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

        var api = KISP.create('API', 'Plan.all');

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

                var list = data.list;
                var lands = data.lands;

                var landId$item = {};

                list.forEach(function (item) {
                    landId$item[item.landId] = item;
                });

                var todos = $.Array.grep(lands, function (land) {
                    var item = landId$item[land.id];
                    return !item;
                });


                var id$land = {};
                lands.forEach(function (item) {
                    id$land[item.id] = item;
                });



                var dones = $.Array.map(list, function (item) {

                    var land = id$land[item.landId];
                    if (!land) {
                        return null;
                    }

                    var planId = item.id;

                    var licenses = $.Array.grep(data.licenses, function (item) {
                        return item.planId == planId;
                    });

                    return $.Object.extend({}, item, {
                        'land': land,
                        'licenses': licenses,
                    });

                });

                emitter.fire('success', 'get', [{
                    'done': dones,
                    'todo': todos,
                }]);
            },

            'fail': function (code, msg, json, xhr) {
                KISP.alert('获取数据失败: {0} ({1})', msg, code);
            },

            'error': function (code, msg, json, xhr) {
                KISP.alert('获取数据错误: 网络繁忙，请稍候再试');
            },
        });

        api.get();


    }



    function remove(id) {

        var api = KISP.create('API', 'Plan.remove');

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
                    text: '删除成功',
                    duration: 1500,
                    mask: 0,
                });

                toast.show();

                var list = data;
                setTimeout(function () {
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


    return {
        get: get,
        remove: remove,
        on: emitter.on.bind(emitter),
    };


});