
var $ = require('../../lib/MiniQuery');
var DataBase = require('../../lib/DataBase');



function sum(list) {

    var Uses = require('./Uses');
    var stat = {};

    Uses.forEach(function (key) {
        stat[key] = 0;

        list.forEach(function (item) {
            var value = Number(item[key]) || 0;
            stat[key] += value;
        });
    });

    return stat;
}



module.exports = {
    stat: function (data) {

        var town = data.town;

        var Land = require('../Land').db;
        var Construct = require('../Construct').db;
        var PlanLicense = require('../PlanLicense').db;
        var SaleLicense = require('../SaleLicense').db;
        var Saled = require('../Saled').db;

        var Dates = require('./Dates');

        var lands = [];
        var plans = [];
        var constructs = [];
        var planLicenses = [];
        var saleLicenses = [];
        var saleds = [];

        var dates = Dates.normalize(data);

        //如果指定了开始时间或结束时间，
        if (dates) {
            //全部已售记录
            saleds = Saled.list(true, function (item) {
                var land = item.refer.licenseId.refer.saleId.refer.planId.refer.landId.item;
                return !land.diy && land.town == town;
            });

            var list = saleds.map(function (item) {
                return item.item;
            });

            //许可证关联的一条有效的已售记录，即把一组已售记录合并成一条。
            var licenseId$saled = DataBase.group(list, 'licenseId', function (licenseId, items) {
                //按日期值升序。
                items.sort(function (a, b) {
                    return a.date > b.date ? 1 : -1;   
                });

                //没有指定开始时间，即只指定了结束时间
                if (!dates.begin) {
                    var item = items.find(function (item) {
                        return item.date >= dates.end;
                    });
                    //如果没有找到，说明指定的结束时间超过了最后一条，则以最后一条为准。
                    return item || items.slice(-1)[0];
                }

                //指定了开始时间的

                var endItem = null;

                if (dates.end) {
                    endItem = items.find(function (item) {
                        return item.date >= dates.end;
                    });
                }
                endItem = endItem || items.slice(-1)[0];

                var beginItem = items.reverse().find(function (item) {
                    return item.date <= dates.begin;
                });

                if (!beginItem) {
                    return endItem;
                }

                var item = {};
                var isValid = false;

                $.Object.each(endItem, function (key, value) {
                    if (typeof value != 'number') {
                        item[key] = value;
                        return;
                    }
                
                    value = value - beginItem[key];

                    //只要有一个不为 0，则为合法记录，用于向上搜索其它角色的记录。
                    if (value != 0) {
                        isValid = true;
                    }

                    item[key] = value;
                });

                return isValid ? item : null;
            });

            saleds = saleds.filter(function (item) {
                var saled = licenseId$saled[item.item.licenseId];
                if (!saled || saled.id != item.item.id) {
                    return false;
                }

                //顺便收集相应的记录。
                var license = item.refer.licenseId;
                var sale = license.refer.saleId;
                var plan = sale.refer.planId;
                var land = plan.refer.landId.item;

                saleLicenses.push(license.item);
                plans.push(plan.item);
                lands.push(land);

                return true;
            });


            //以 id 作为主键关联整条记录。
            var id$plan = DataBase.map(plans);

            //过滤出符合条件的规划许可证。
            planLicenses = PlanLicense.list(function (item) {
                return !!id$plan[item.planId];
            });

            //过滤出符合条件的施工许可证。
            constructs = Construct.list(true, function (item) {
                return !!id$plan[item.refer.licenseId.item.planId];
            });
        }
        else {
            lands = Land.list(function (item) {
                return !item.diy && item.town == town;
            });

            planLicenses = PlanLicense.list(true, function (item) {
                var land = item.refer.planId.refer.landId.item;
                return !land.diy && land.town == town;

            }).map(function (item) {
                return item.item;
            });

            constructs = Construct.list(true, function (item) {
                var land = item.refer.licenseId.refer.planId.refer.landId.item;
                return !land.diy && land.town == town;
            });

            saleLicenses = SaleLicense.list(true, function (item) {
                var land = item.refer.saleId.refer.planId.refer.landId.item;
                return !land.diy && land.town == town;
            }).map(function (item) {
                return item.item;
            });

            saleds = Saled.list(true, function (item) {
                var land = item.refer.licenseId.refer.saleId.refer.planId.refer.landId.item;
                return !land.diy && land.town == town;
            });

            var list = saleds.map(function (item) {
                return item.item;
            });

            var licenseId$saled = DataBase.group(list, 'licenseId', function (licenseId, items) {
                items.sort(function (a, b) {
                    return a.date > b.date ? -1 : 1;   //按日期值倒序。
                });

                return items[0];  //日期最大值的一条记录
            });

            saleds = saleds.filter(function (item) {
                item = item.item;
                var saled = licenseId$saled[item.licenseId];
                return saled.id == item.id;
            });

        }

        //这里统一加个 type 字段。
        saleds = saleds.map(function (item) {
            return {
                'type': item.refer.licenseId.item.type,
                'item': item.item,
            };
        });

        //注意，这里用的规划许可证的字段。
        constructs = constructs.map(function (item) {
            return item.refer.licenseId.item;
        });


        var stat = {};

        stat['land'] = sum(lands);
        stat['plan'] = sum(planLicenses);
        stat['construct'] = sum(constructs);

        //按 type 进行分类收集。
        var types = { 0: [], 1: [], };

        saleLicenses.forEach(function (item) {
            types[item.type].push(item);
        });

        stat['prepare'] = sum(types[0]);
        stat['doing'] = sum(types[1]);

        types = { 0: [], 1: [], };
        saleds.forEach(function (item) {
            types[item.type].push(item.item);
        });

        stat['saled-prepare'] = sum(types[0]);
        stat['saled-doing'] = sum(types[1]);

        return stat;

    },
};