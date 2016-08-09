


var $ = require('../lib/MiniQuery');



function id$item(list) {

    var id$item = {};

    list.forEach(function (item) {
        id$item[item.id] = item;
    });

    return id$item;
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
            var ConstructLicense = require('./ConstructLicense');
            var SaleLicense = require('./SaleLicense');

            var lands = Land.list();
            var plans = Plan.list();
            var constructs = Construct.list();
            var sales = Sale.list();


            var plan_licenses = PlanLicense.list();
            var construct_licenses = ConstructLicense.list();
            var sale_licenses = SaleLicense.list();


            var id$land = id$item(lands);
            var id$plan = id$item(plans);
            var id$construct = id$item(constructs);
            var id$sale = id$item(sales);


            lands = lands.map(function (item) {
                return {
                    'town': item.town,
                    'commerceSize': item.commerceSize,
                    'residenceSize': item.residenceSize,
                    'officeSize': item.officeSize,
                    'otherSize': item.otherSize,
                };
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

                return {
                    'town': land.town,
                    'commerceSize': item.commerceSize,
                    'residenceSize': item.residenceSize,
                    'officeSize': item.officeSize,
                    'otherSize': item.otherSize,
                };
            });


            constructs = $.Array.map(construct_licenses, function (item) {

                var construct = id$construct[item.constructId];
                if (!construct) {
                    return null;
                }

                var land = id$land[construct.landId];
                if (!land) {
                    return null;
                }

                return {
                    'town': land.town,
                    'before': item.before,
                    'commerceSize': item.commerceSize,
                    'residenceSize': item.residenceSize,
                    'officeSize': item.officeSize,
                    'otherSize': item.otherSize,
                };
            });


            sales = $.Array.map(sale_licenses, function (item) {

                var sale = id$sale[item.saleId];
                if (!sale) {
                    return null;
                }

                var land = id$land[sale.landId];
                if (!land) {
                    return null;
                }

                return {
                    'town': land.town,
                    'commerceSize': item.commerceSize,
                    'residenceSize': item.residenceSize,
                    'officeSize': item.officeSize,
                    'otherSize': item.otherSize,
                };
            });



            res.send({
                code: 200,
                msg: 'ok',
                data: {
                    'lands': lands,
                    'plans': plans,
                    'constructs': constructs,
                    'sales': sales,
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

