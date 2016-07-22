


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
    get: function (res) {

        try {
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
            var saledPrepares = [];    //预售许可，已售部分
            var saledDoings = [];      //现售备案，已售部分

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

