
var $ = require('../../lib/MiniQuery');
var DataBase = require('../../lib/DataBase');


function sum(list, key) {

    var Towns = require('./Towns');

    var stat = {};

    Towns.forEach(function (town) {
        stat[town] = 0;
    });

    list.forEach(function (item) {
        var town = item.town;
        var value = item.item[key];

        stat[town] += value;
    });

    return stat;
}


module.exports = {
    stat: function (data) {

        var use = data.use;

        var lands = [];
        var plans = [];
        var constructs = [];
        var sales = [];
        var planLicenses = [];
        var saleLicenses = [];
        var saleds = [];

        var Land = require('../Land').db;
        var Construct = require('../Construct').db;
        var PlanLicense = require('../PlanLicense').db;
        var Sale = require('../Sale').db;
        var SaleLicense = require('../SaleLicense').db;
        var Saled = require('../Saled'); //这里没有 .db

        var Dates = require('./Dates');

        var dates = Dates.normalize(data);

        //如果指定了开始时间或结束时间，
        if (dates) {

            //指定日期区间的有效已售记录。
            saleds = Saled.byDates(dates, true, function (item) {
                var land = item.refer.licenseId.refer.saleId.refer.planId.refer.landId.item;
                return !land.diy;
            });

            //收集相应的记录。
            saleds.forEach(function (saled) {
                var license = saled.refer.licenseId;
                var sale = license.refer.saleId;
                var plan = sale.refer.planId;
                var land = plan.refer.landId.item;
              
                saleLicenses.push(license);
                plans.push(plan.item);
                lands.push(land);
            });
            
            //以 id 作为主键关联整条记录。
            var id$plan = DataBase.map(plans);

            //过滤出符合条件的规划许可证。
            planLicenses = PlanLicense.list(true, function (item) {
                return !!id$plan[item.item.planId];
            });

            //过滤出符合条件的施工许可证。
            constructs = Construct.list(true, function (item) {
                return !!id$plan[item.refer.licenseId.item.planId];
            });
        }
        else {
            lands = Land.list(function (item) {
                return !item.diy;
            });

            planLicenses = PlanLicense.list(true, function (item) {
                var land = item.refer.planId.refer.landId.item;
                return !land.diy;
            });

            constructs = Construct.list(true, function (item) {
                var land = item.refer.licenseId.refer.planId.refer.landId.item;
                return !land.diy;
            });

            saleLicenses = SaleLicense.list(true, function (item) {
                var land = item.refer.saleId.refer.planId.refer.landId.item;
                return !land.diy;
            });

            saleds = Saled.currents(true, function (item) {
                var land = item.refer.licenseId.refer.saleId.refer.planId.refer.landId.item;
                return !land.diy;
            });
           
        }


        lands = lands.map(function (item) {
            return {
                'item': item,
                'town': item.town,
            };
        });

        planLicenses = planLicenses.map(function (item) {
            return {
                'item': item.item,
                'town': item.refer.planId.refer.landId.item.town,
            };
        });

        //注意，这里用的规划许可证的字段。
        constructs = constructs.map(function (item) {
            var license = item.refer.licenseId;
            return {
                'item': license.item,
                'town': license.refer.planId.refer.landId.item.town,
            };
        });

        saleLicenses = saleLicenses.map(function (item) {
            return {
                'item': item.item,
                'town': item.refer.saleId.refer.planId.refer.landId.item.town,
            };
        });

        saleds = saleds.map(function (item) {
            var license = item.refer.licenseId;

            return {
                'item': item.item,
                'town': license.refer.saleId.refer.planId.refer.landId.item.town,
                'type': license.item.type,  //这里加个 type 字段。
            };
        });

        


        var stat = {};

        stat['land'] = sum(lands, use);
        stat['plan'] = sum(planLicenses, use);
        stat['construct'] = sum(constructs, use);

        //按 type 进行分类收集。
        var types = { 0: [], 1: [], };

        saleLicenses.forEach(function (item) {
            types[item.item.type].push(item);
        });

        stat['prepare'] = sum(types[0], use);
        stat['doing'] = sum(types[1], use);


        types = { 0: [], 1: [], };
        saleds.forEach(function (item) {
            types[item.type].push(item);
        });

        stat['saled-prepare'] = sum(types[0], use);
        stat['saled-doing'] = sum(types[1], use);

        return stat;

    },
};