

define('/Sale/API', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Emitter = MiniQuery.require('Emitter');

    var emitter = new Emitter();
    var loading = null;


    //获取数据
    function get() {

        var api = KISP.create('API', 'Sale.all', {
            
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
                var sales = data.sales;
                var licenses = data.licenses;

                var id$land = {};
                lands.forEach(function (item) {
                    id$land[item.id] = item;
                });


                var id$plan = {};
                plans.forEach(function (item) {
                    id$plan[item.id] = item;
                });


                var planId$sale = {};
                sales.forEach(function (sale) {
                    planId$sale[sale.planId] = sale;
                });



                //从销售记录中找出合法的已办的子集。
                var dones = $.Array.map(sales, function (sale) {

                    //找到关联的规划记录。
                    var plan = id$plan[sale.planId];
                    if (!plan) {
                        return null;
                    }

                    //找到关联的土地记录。
                    var land = id$land[plan.landId];
                    if (!land) {
                        return null;
                    }

                    return {
                        'sale': sale,
                        'plan': plan,
                        'land': land,
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

        api.post();


    }



    return {
        get: get,
        on: emitter.on.bind(emitter),
    };


});