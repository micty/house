
var $ = require('../../lib/MiniQuery');
var DataBase = require('../../lib/DataBase');



var keys = [
    'residenceSize',
    'commerceSize',
    'officeSize',
    'otherSize',

    'parkSize',
    'otherSize1',
];


function sum(list) {

    if (!Array.isArray(list)) {
        list = [list];
    }


    var sum = 0;
    
    list.forEach(function (item) {
        keys.forEach(function (key) {
            var value = item[key];
            sum += value;
        });
    });

    return sum;
}






module.exports = {
    stat: function (data) {

        var Sale = require('../Sale').db;
        var Construct = require('../Construct').db;
        var SaleLicense = require('../SaleLicense').db;
        var PlanLicense = require('../PlanLicense').db;
        var Saled = require('../Saled').db;

        var sales = Sale.list(true);
        var planId$stat = {};

        var list = sales.map(function (sale) {
            var stat = {
                'sale': sale.item.project,
                'land': 0,
                'plan': 0,
                'construct': 0,
                'prepare': 0,
                'doing': 0,
                'saled-prepare': 0,
                'saled-doing': 0,
            };

            //
            var plan = sale.refer.planId.item;
            var list = PlanLicense.refer('planId', plan.id);
            stat['plan'] = sum(list);

            //
            var land = sale.refer.planId.refer.landId.item;
            stat['land'] = sum(land);

            //预售许可证和现售备案。
            var list = SaleLicense.refer('saleId', sale.item.id, true);
            list.forEach(function (item) {
                var license = item.item;
                var type = license.type;
                var key = type == 0 ? 'prepare' : 'doing';

                stat[key] += sum(license);

                //已售记录
                var list = Saled.refer('licenseId', license.id);
                list.sort(function (a, b) {
                    return a.date > b.date ? -1 : 1;   //按日期值倒序。
                });

                //统计日期最大值的一条记录。
                var saled = list[0];
                if (saled) {
                    stat['saled-' + key] += sum(saled);
                }

            });

            //用于 construct 的检索。
            planId$stat[plan.id] = stat;

            return stat;

        });


        var constructs = Construct.list(true);

        constructs.forEach(function (construct) {

            var license = construct.refer.licenseId;
            var planId = license.refer.planId.item.id;

            var stat = planId$stat[planId];
            if (!stat) {
                return;
            }

            stat['construct'] += sum(license.item); //这里统计的是规划许可证的字段，而不是建设的字段。
           
        });

        return list;
    },
};