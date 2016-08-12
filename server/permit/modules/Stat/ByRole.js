
var $ = require('../../lib/MiniQuery');


module.exports = {
    stat: function (data) {

        var role = data.role;

        var Dates = require('./Dates');
        var Sum = require('./Sum');

        var dates = Dates.normalize(data);

        var stat = ({
            'land': function () {
                var Land = require('../Land').db;

                var list = Land.list(function (item) {
                    return !item.diy;
                });

                //如果指定了开始时间或结束时间，则以竞得时间为准。
                if (dates) {
                    list = list.filter(function (item) {
                        return Dates.filter(dates, item.date);
                    });
                }

                list = list.map(function (item) {
                    return {
                        'item': item,
                        'town': item.town,
                    };
                });

                var Uses = require('./Uses');
                var keys = Uses.concat('size');
                var stat = Sum.stat(list, keys);
                return { 'land': stat };
            },

            'plan': function () {
                var PlanLicense = require('../PlanLicense').db;

                var list = PlanLicense.list(true, function (item) {
                    var land = item.refer.planId.refer.landId.item;
                    return !land.diy;
                });

                //如果指定了开始时间或结束时间，则以规划许可证时间为准。
                if (dates) {
                    list = list.filter(function (item) {
                        return Dates.filter(dates, item.item.date);
                    });
                }

                list = list.map(function (item) {
                    return {
                        'item': item.item,
                        'town': item.refer.planId.refer.landId.item.town,
                    };
                });

                var stat = Sum.stat(list);
                return { 'plan': stat };
            },

            'construct': function () {
                var Construct = require('../Construct').db;

                var list = Construct.list(true, function (item) {
                    var land = item.refer.licenseId.refer.planId.refer.landId.item;
                    return !land.diy;
                });

                //如果指定了开始时间或结束时间，则以建设日期为准。
                if (dates) {
                    list = list.filter(function (item) {
                        return Dates.filter(dates, item.item.date);
                    });
                }

                //注意，这里用的规划许可证的字段。
                list = list.map(function (item) {
                    var license = item.refer.licenseId;
                    return {
                        'item': license.item,
                        'town': license.refer.planId.refer.landId.item.town,
                    };
                });

                var stat = Sum.stat(list);
                return { 'construct': stat };
            },

            'sale': function () {
                var stat = {};

                //如果指定了开始时间或结束时间，则以已售记录的提交时间为准。
                if (dates) {
                    var Saled = require('../Saled').db;
                    var type$licenses = { 0: [], 1: [], };
                    var type$saleds = { 0: [], 1: [], };

                    Saled.list(true, function (saled) {
                        var license = saled.refer.licenseId;
                        var land = license.refer.saleId.refer.planId.refer.landId.item;
                        if (land.diy) {
                            return false;
                        }

                        if (!Dates.filter(dates, saled.item.datetime)) {
                            return false;
                        }

                        license = license.item;

                        type$licenses[license.type].push({
                            'item': license,
                            'town': land.town,
                        });

                        type$saleds[license.type].push({
                            'item': saled.item,
                            'town': land.town,
                        });

                        return true;
                    });

                    stat['prepare'] = Sum.stat(type$licenses[0]);
                    stat['doing'] = Sum.stat(type$licenses[1]);
                    stat['saled-prepare'] = Sum.stat(type$saleds[0]);
                    stat['saled-doing'] = Sum.stat(type$saleds[1]);

                    return stat;
                }

                (function () {
                    var SaleLicense = require('../SaleLicense').db;
                    var list = SaleLicense.list(true);
                    var types = { 0: [], 1: [], };

                    list.forEach(function (item) {
                        var land = item.refer.saleId.refer.planId.refer.landId.item;
                        if (land.diy) {
                            return;
                        }

                        var license = item.item;
                        types[license.type].push({
                            'item': license,
                            'town': land.town,
                        });
                    });

                    stat['prepare'] = Sum.stat(types[0]);
                    stat['doing'] = Sum.stat(types[1]);
                })();

                (function () {
                    var Saled = require('../Saled').db;
                    var list = Saled.list(true);
                    var types = { 0: [], 1: [], };

                    list.forEach(function (item) {

                        var license = item.refer.licenseId;

                        var land = license.refer.saleId.refer.planId.refer.landId.item;
                        if (land.diy) {
                            return;
                        }

                        license = license.item;
                        types[license.type].push({
                            'item': item.item,
                            'town': land.town,
                        });
                    });

                    stat['saled-prepare'] = Sum.stat(types[0]);
                    stat['saled-doing'] = Sum.stat(types[1]);
                })();

                return stat;
            },

        })[role]();

        return stat;

    },
};