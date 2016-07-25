


var $ = require('../lib/MiniQuery');



function id$item(list) {

    var id$item = {};

    list.forEach(function (item) {
        id$item[item.id] = item;
    });

    return id$item;
}


function sizes(prefix, item, data) {

    //重载 sizes(item, data)
    if (typeof prefix == 'object') {
        data = item;
        item = prefix;
        prefix = '';
    }

    var keys = [
        'residenceSize',
        'commerceSize',
        'officeSize',
        'otherSize',
        'parkSize',
        'otherSize1',
    ];



    var obj = $.Object.extend({}, data);

    keys.forEach(function (key) {

        skey = prefix + key;

        if (!(skey in item)) {
            return;
        }

        obj[key] = Number(item[skey]) || 0;
    });

    return obj;
}



module.exports = {

    

    /**
    * 获取。
    */
    get: function (res, data) {

        try {
            data = data || {};

            var beginDate = data.beginDate || '';
            var endDate = data.endDate || '';
            var role = data.role || 'sale';

            var Land = require('./Land');
            var Plan = require('./Plan');
            var Construct = require('./Construct');
            var Sale = require('./Sale');

            var PlanLicense = require('./PlanLicense');
            var SaleLicense = require('./SaleLicense');

            var lands = Land.list();
            var plans = Plan.list();
            var constructs = Construct.list();
            var sales = Sale.list();

            var plan_licenses = PlanLicense.list();
            var sale_licenses = SaleLicense.list();

            //如果指定了开始时间或结束时间，
            if (beginDate || endDate) {
                beginDate = Number(beginDate.split('-').join(''));
                endDate = Number(endDate.split('-').join('')) || 99991231;

                switch (role) {
                    case 'land':
                        lands = lands.filter(function (item) {
                            try {
                                var date = $.Date.parse(item.date);
                                date = $.Date.format(date, 'yyyyMMdd');
                                date = Number(date);
                                return beginDate <= date && date <= endDate;
                            }
                            catch (ex) {
                                return false;
                            }
                        });

                    case 'plan':
                        plan_licenses = plan_licenses.filter(function (item) {
                            try {
                                var date = $.Date.parse(item.date);
                                date = $.Date.format(date, 'yyyyMMdd');
                                date = Number(date);
                                return beginDate <= date && date <= endDate;
                            }
                            catch (ex) {
                                return false;
                            }
                        });

                        break;

                    case 'construct':
                        constructs = constructs.filter(function (item) {
                            try {
                                var date = $.Date.parse(item.date);
                                date = $.Date.format(date, 'yyyyMMdd');
                                date = Number(date);
                                return beginDate <= date && date <= endDate;
                            }
                            catch (ex) {
                                return false;
                            }
                        });
                        break;

                    //指定的是销售的提交时间
                    case 'sale':
                        //过滤出相关时间段的销售记录。
                        sales = sales.filter(function (item) {
                            var date = item.datetime.split(' ')[0];
                            date = date.split('-').join('');
                            date = Number(date);

                            return beginDate <= date && date <= endDate;
                        });

                        //根据销售记录反向找出已关联的规划记录。
                        var planId$sale = {};
                        sales.forEach(function (item) {
                            planId$sale[item.planId] = item;
                        });

                        plans = plans.filter(function (item) {
                            return !!planId$sale[item.id];
                        });

                        //根据规划记录反向找出已关联的土地记录。
                        var landId$plan = {};
                        plans.forEach(function (item) {
                            landId$plan[item.landId] = item;
                        });

                        lands = lands.filter(function (item) {
                            return !!landId$plan[item.id];
                        });

                        break;
                }

            }

            


    


            var id$land = id$item(lands);
            var id$plan = id$item(plans);
            var id$construct = id$item(constructs);
            var id$sale = id$item(sales);
            var id$planLicense = id$item(plan_licenses);
            var id$saleLicense = id$item(sale_licenses);


            lands = lands.map(function (item) {
                return sizes(item, {
                    'town': item.town,
                    'diy': item.diy,
                    'size': Number(item.size) || 0,
                });
            });


            plans = $.Array.map(plan_licenses, function (item) {

                var plan = id$plan[item.planId];
                if (!plan) {
                    return null;
                }

                var land = id$land[plan.landId];
                if (!land) {
                    return null;
                }

                return sizes(item, {
                    'town': land.town,
                    'diy': land.diy,
                });
            });


            constructs = $.Array.map(constructs, function (item) {

                var license = id$planLicense[item.licenseId]; //规划许可证
                if (!license) {
                    return null;
                }

                var plan = id$plan[license.planId];
                if (!plan) {
                    return null;
                }

                var land = id$land[plan.landId];
                if (!land) {
                    return null;
                }

                return sizes(license, {
                    'town': land.town,
                    'diy': land.diy,
                });
            });



            var prepares = [];          //预售许可
            var doings = [];            //现售备案
            var saledPrepares = [];     //预售许可，已售部分
            var saledDoings = [];       //现售备案，已售部分

            sale_licenses.forEach(function (item) {
                var sale = id$sale[item.saleId];
                if (!sale) {
                    return null;
                }

                var plan = id$plan[sale.planId];
                if (!plan) {
                    return null;
                }

                var land = id$land[plan.landId];
                if (!land) {
                    return null;
                }

           
                var obj = sizes(item, {
                    'town': land.town,
                    'diy': land.diy,
                });

                var a = item.type == 0 ? prepares : doings;
                a.push(obj);

                //
                var obj = sizes('saled-', item, {
                    'town': land.town,
                    'diy': land.diy,
                });

                var a = item.type == 0 ? saledPrepares : saledDoings;
                a.push(obj);
          
            });



            res.send({
                code: 200,
                msg: 'ok',
                data: {
                    'lands': lands,
                    'plans': plans,
                    'constructs': constructs,
                    'prepares': prepares,
                    'doings': doings,
                    'saled-prepares': saledPrepares,
                    'saled-doings': saledDoings,
                },
            });

        }
        catch (ex) {
            res.send({
                code: 500,
                msg: ex.message,
            });
        }

    },



};

