

var $ = require('../../lib/MiniQuery');
var DataBase = require('../../lib/DataBase');



var Roles = {
    'land': function () {
        var Land = require('../Land').db;

        var list = Land.list(function (item) {
            return !item.diy;
        });

        list = list.map(function (item) {
            return {
                'item': item,
                'town': item.town,
            };
        });

        return { 'land': list, };
    },

    'plan': function () {
        var PlanLicense = require('../PlanLicense').db;

        var list = PlanLicense.list(true, function (item) {
            var land = item.refer.planId.refer.landId.item;
            return !land.diy;
        });

        list = list.map(function (item) {
            return {
                'item': item.item,
                'town': item.refer.planId.refer.landId.item.town,
            };
        });

        return { 'plan': list, };
    },

    'construct': function () {
        var Construct = require('../Construct').db;

        var list = Construct.list(true, function (item) {
            var land = item.refer.licenseId.refer.planId.refer.landId.item;
            return !land.diy;
        });

        //注意，这里用的规划许可证的字段。
        list = list.map(function (item) {
            var license = item.refer.licenseId;
            return {
                'item': license.item,
                'town': license.refer.planId.refer.landId.item.town,
            };
        });

        return { 'construct': list, };
    },

    'sale': function () {
        var SaleLicense = require('../SaleLicense').db;
        var list = SaleLicense.list(true);
        var types = { 0: [], 1: [], };

        list.forEach(function (item) {
            var land = item.refer.saleId.refer.planId.refer.landId.item;
            if (land.diy) {
                return;
            }

            var data = item.item;
            types[data.type].push({
                'item': data,
                'town': land.town,
            });
        });

        var stat = {};

        stat['prepare'] = types[0];
        stat['doing'] = types[1];

        return stat;
    },

    //已售记录。
    'saled': function () {
        var Saled = require('../Saled');

        var list = Saled.currents(true, function (item) {
            var land = item.refer.licenseId.refer.saleId.refer.planId.refer.landId.item;
            return !land.diy;
        });

        var types = { 0: [], 1: [], };

        list.forEach(function (item) {
            var license = item.refer.licenseId;
            var land = license.refer.saleId.refer.planId.refer.landId.item;

            var type = license.item.type;
            types[type].push({
                'item': item.item,
                'town': land.town,
            });
        });

        var stat = {};

        stat['saled-prepare'] = types[0];
        stat['saled-doing'] = types[1];

        return stat;
    },
};


var Helper = {

    byDates: function (dates) {
        var Construct = require('../Construct').db;
        var PlanLicense = require('../PlanLicense').db;
        var Saled = require('../Saled'); //这里没有 .db
        var Dates = require('./Dates');

        var lands = [];
        var plans = [];
        var type$licenses = { 0: [], 1: [], };
        var type$saleds = { 0: [], 1: [], };

        var saleds = Saled.byDates(dates, true, function (item) {
            var land = item.refer.licenseId.refer.saleId.refer.planId.refer.landId.item;
            return !land.diy;
        });

        saleds.forEach(function (saled) {
            var license = saled.refer.licenseId;
            var plan = license.refer.saleId.refer.planId;
            var land = plan.refer.landId.item;

            //顺便收集相应的记录。
            plans.push(plan.item);

            lands.push({
                'item': land,
                'town': land.town,
            });

            license = license.item;
            var type = license.type;

            type$licenses[type].push({
                'item': license,
                'town': land.town,
            });

            type$saleds[type].push({
                'item': saled.item,
                'town': land.town,
            });
        });



        //以 id 作为主键关联整条记录。
        var id$plan = DataBase.map(plans);

        //过滤出符合条件的规划许可证。
        var planLicenses = PlanLicense.list(true, function (item) {
            return !!id$plan[item.item.planId];
        }).map(function (item) {
            return {
                'item': item.item,
                'town': item.refer.planId.refer.landId.item.town,
            };
        });

        //过滤出符合条件的施工许可证。
        var constructs = Construct.list(true, function (item) {
            return !!id$plan[item.refer.licenseId.item.planId];
        }).map(function (item) {
            //注意，这里用的规划许可证的字段。
            var license = item.refer.licenseId;
            return {
                'item': license.item,
                'town': license.refer.planId.refer.landId.item.town,
            };
        });

        var stat = {};

        stat['land'] = lands;
        stat['plan'] = planLicenses;
        stat['construct'] = constructs;

        stat['prepare'] = type$licenses[0];
        stat['doing'] = type$licenses[1];
        stat['saled-prepare'] = type$saleds[0];
        stat['saled-doing'] = type$saleds[1];

        return stat;
    },



    byRoles: function () {

        var stat = {};

        Object.keys(Roles).forEach(function (key) {
            var fn = Roles[key];
            var obj = fn();
            $.Object.extend(stat, obj);
        });

        return stat;
    },
};




module.exports = {

    stat: function (data) {
        var Dates = require('./Dates');
        var Sum = require('./Sum');
        var dates = Dates.normalize(data);

        var stat = null;


        //如果指定了开始时间或结束时间，则以已售记录的截止时间为准。
        if (dates) {
            stat = Helper.byDates(dates);
        }
        else {
            stat = Helper.byRoles();
        }

        Object.keys(stat).forEach(function (key) {
            var list = stat[key];
            stat[key] = Sum.stat(list);
        });

        return stat;
    },


};