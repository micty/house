
var $ = require('../../lib/MiniQuery');
var DataBase = require('../../lib/DataBase');


function sum(list) {

    var Towns = require('./Towns');
    var Uses = require('./Uses');

    var stat = {};

    Towns.forEach(function (town) {
        stat[town] = 0;
    });

    list.forEach(function (item) {
        var town = item.town;
        var value = 0;

        item = item.item;

        Uses.forEach(function (key) {
            value += item[key];
        });

        stat[town] += value;
    });

    return stat;
}


module.exports = {
    stat: function (data) {

        var lands = [];
        var constructs = [];
        var planLicenses = [];

        var Land = require('../Land').db;
        var Construct = require('../Construct').db;
        var PlanLicense = require('../PlanLicense').db;

        var Dates = require('./Dates');

        var dates = Dates.normalize(data);

        //如果指定了开始时间或结束时间，则以土地竞得时间为准。
        if (dates) {
            lands = Land.list(function (item) {
                if (!item.diy) {
                    return false;
                }

                return Dates.filter(dates, item.date);
            });

            var id$land = DataBase.map(lands);

            planLicenses = PlanLicense.list(true, function (item) {
                var landId = item.refer.planId.item.landId;
                return !!id$land[landId];
            });

            constructs = Construct.list(true, function (item) {
                var landId = item.refer.licenseId.refer.planId.item.landId;
                return !!id$land[landId];
            });

        }
        else {
            lands = Land.list(function (item) {
                return item.diy;
            });

            planLicenses = PlanLicense.list(true, function (item) {
                var land = item.refer.planId.refer.landId.item;
                return land.diy;
            });

            constructs = Construct.list(true, function (item) {
                var land = item.refer.licenseId.refer.planId.refer.landId.item;
                return land.diy;
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

    


        var stat = {};

        stat['land'] = sum(lands);
        stat['plan'] = sum(planLicenses);
        stat['construct'] = sum(constructs);

        return stat;

    },
};