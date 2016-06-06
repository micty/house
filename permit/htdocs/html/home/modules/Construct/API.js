

define('/Construct/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');

    var emitter = new Emitter();
    var loading = null;


    //获取数据
    function get() {

        var api = KISP.create('API', 'Construct.all', {
            
        });


        api.on({

            //'request': function () {

            //    loading = loading || top.KISP.create('Loading', {
            //        mask: 0,
            //    });

            //    loading.show('加载中...');
            //},

            //'response': function () {
            //    loading.hide();
            //},

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

                emitter.fire('success', 'get', [dones.slice(0, 5)]);
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



    return {
        get: get,
        on: emitter.on.bind(emitter),
    };


});