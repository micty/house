

define('/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');

    var emitter = new Emitter();
    var loading = null;
    var toast = null;

    //获取数据
    function post(options) {

        options = options || {};

        var api = KISP.create('API', 'Construct.all');

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

                var lands = data.lands;
                var plans = data.plans;
                var licenses = data.licenses; //planLicenses
                var list = data.list;


                var id$land = {};
                lands.forEach(function (item) {
                    id$land[item.id] = item;
                });


                var id$plan = {};
                plans.forEach(function (item) {
                    id$plan[item.id] = item;
                });

                var id$license = {};
                licenses.forEach(function (item) {
                    id$license[item.id] = item;
                });

                //从施工许可证中标记出已办的规划许可证。
                var licenseId$done = {};
                list.forEach(function (item) {
                    licenseId$done[item.licenseId] = true;
                });

                //从所有的规划许可证中找出待办的。
                var todos = $.Array.map(licenses, function (license) {

                    //已完成的
                    var done = licenseId$done[license.id];
                    if (done) {
                        return null;
                    }

                    //找到关联的规划记录。
                    var plan = id$plan[license.planId];
                    if (!plan) {
                        return null;
                    }

                    //找到关联的土地记录。
                    var land = id$land[plan.landId];
                    if (!land) {
                        return null;
                    }

                    return {
                        'license': license,
                        'plan': plan,
                        'land': land,
                    };
                });



                var dones = $.Array.map(list, function (item) {

                    //找到关联的规划许可证。
                    var license = id$license[item.licenseId];
                    if (!license) {
                        return null;
                    }

                    //找到关联的规划记录。
                    var plan = id$plan[license.planId];
                    if (!plan) {
                        return null;
                    }

                    //找到关联的土地记录。
                    var land = id$land[plan.landId];
                    if (!land) {
                        return null;
                    }

                    return {
                        'license': license,
                        'plan': plan,
                        'land': land,
                        'construct': item,
                    };

                });

                emitter.fire('success', 'post', [{
                    'todo': todos,
                    'done': dones,
                }]);
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



    function remove(id) {

        var api = KISP.create('API', 'Construct.remove');

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
        post: post,
        remove: remove,
        on: emitter.on.bind(emitter),
    };


});