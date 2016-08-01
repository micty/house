


var $ = require('../lib/MiniQuery');
var DataBase = require('../lib/DataBase');



function id$item(list) {

    var id$item = {};

    list.forEach(function (item) {
        id$item[item.id] = item;
    });

    return id$item;
}




module.exports = {

    /**
    * 按区域(镇街)进行统计。
    */
    town: function (req, res) {
        var data = req.body.data;
        var town = data.town;
        if (!town) {
            res.empty('town');
            return;
        }

        var lands = [];
        var plans = [];
        var constructs = [];
        var sales = [];
        var planLicenses = [];
        var saleLicenses = [];

        var Land = require('./Land').db;
        var Construct = require('./Construct').db;
        var PlanLicense = require('./PlanLicense').db;
        var Sale = require('./Sale').db;
        var SaleLicense = require('./SaleLicense').db;

        var beginDate = data.beginDate || '';
        var endDate = data.endDate || '';

        //如果指定了开始时间或结束时间，
        if (beginDate || endDate) {
            beginDate = Number(beginDate.split('-').join(''));
            endDate = Number(endDate.split('-').join('')) || 20960101;

            //根据销售记录的提交时间找出相应的销售记录集合。
            sales = Sale.list(true, function (sale) {
                var date = sale.item.datetime.split(' ')[0].split('-').join('');
                date = Number(date);

                if (date < beginDate || date > endDate) {
                    return false;
                }

                var plan = sale.refer.planId;
                var land = plan.refer.landId;

                if (land.item.town != town) {
                    return false;
                }

                //顺便收集规划记录和土地记录。
                plans.push(plan.item);
                lands.push(land.item);

                return true;

            }).map(function (sale) {
                return sale.item;
            });

            //以 id 作为主键关联整条记录。
            var id$land = DataBase.map(lands);
            var id$plan = DataBase.map(plans);
            var id$sale = DataBase.map(sales);

            //过滤出符合条件的规划许可证。
            planLicenses = PlanLicense.list(function (item) {
                return !!id$plan[item.planId];
            });

            //以 id 作为主键关联整条记录。
            var id$planLicense = DataBase.map(planLicenses);

            //过滤出符合条件的施工许可证。
            constructs = Construct.list(true, function (item) {
                return !!id$planLicense[item.licenseId];
            });

            //过滤出符合条件的销售许可证。
            saleLicenses = SaleLicense.list(function (item) {
                return !!id$sale[item.saleId];
            });
        }
        else {
            lands = Land.list(function (item) {
                return item.town == town;
            });

            planLicenses = PlanLicense.list(true, function (item) {
                return item.refer.planId.refer.landId.item.town == town;
            }).map(function (item) {
                return item.item;
            });

            constructs = Construct.list(true, function (item) {
                return item.refer.licenseId.refer.planId.refer.landId.item.town == town;
            });

            saleLicenses = SaleLicense.list(true, function (item) {
                return item.refer.saleId.refer.planId.refer.landId.item.town == town;
            }).map(function (item) {
                return item.item;
            });
        }

        //注意，这里用的规划许可证的字段。
        constructs = constructs.map(function (item) {
            return item.refer.licenseId.item;   
        });

        var keys = [
            'residenceSize',
            'commerceSize',
            'officeSize',
            'otherSize',
            'parkSize',
            'otherSize1',
        ];

        function sum(list, prefix) {

            prefix = prefix || '';
            var stat = {};

            keys.forEach(function (key) {
                stat[key] = 0;
                var skey = prefix + key;

                list.forEach(function (item) {
                    var value = Number(item[skey]) || 0;
                    stat[key] += value;
                });
            });
            return stat;
        }

        var stat = {
            'land': null,
            'plan': null,
            'construct': null,
            'prepare': null,
            'doing': null,
            'saled-prepare': null,
            'saled-doing': null,
        };

        
        stat['land'] = sum(lands);
        stat['plan'] = sum(planLicenses);
        stat['construct'] = sum(constructs);
        

        var groups = {
            0: [],
            1: [],
        };

        saleLicenses.forEach(function (item) {
            groups[item.type].push(item);
        });

        stat['prepare'] = sum(groups[0]);
        stat['doing'] = sum(groups[1]);
        stat['saled-prepare'] = sum(groups[0], 'saled-');
        stat['saled-doing'] = sum(groups[1], 'saled-');

        res.success(stat);
    },

    /**
    * 按板块(角色)进行统计。
    */
    role: function (req, res) {
        var data = req.body.data;
        var role = data.role;
        if (!role) {
            res.empty('role');
            return;
        }


    },

    /**
    * 按功能(用途)进行统计。
    */
    use: function (req, res) {
        var data = req.body.data;
        var use = data.use;
        if (!use) {
            res.empty('use');
            return;
        }


        var lands = [];
        var plans = [];
        var constructs = [];
        var sales = [];
        var planLicenses = [];
        var saleLicenses = [];

        var Land = require('./Land').db;
        var Construct = require('./Construct').db;
        var PlanLicense = require('./PlanLicense').db;
        var Sale = require('./Sale').db;
        var SaleLicense = require('./SaleLicense').db;

        var beginDate = data.beginDate || '';
        var endDate = data.endDate || '';

        //如果指定了开始时间或结束时间，
        if (beginDate || endDate) {
            beginDate = Number(beginDate.split('-').join(''));
            endDate = Number(endDate.split('-').join('')) || 20960101;
        }
        else {
            lands = Land.list().map(function (item) {
                return {
                    'item': item,
                    'town': item.town,
                };
            });

            planLicenses = PlanLicense.list(true).map(function (item) {
                return {
                    'item': item.item,
                    'town': item.refer.planId.refer.landId.item.town,
                };
            });

            constructs = Construct.list(true).map(function (item) {
                return {
                    'item': item.refer.licenseId.item,  //注意，这里用的规划许可证的字段。
                    'town': item.refer.licenseId.refer.planId.refer.landId.item.town,
                };
            });

            saleLicenses = SaleLicense.list(true).map(function (item) {
                return {
                    'item': item.item,
                    'town': item.refer.saleId.refer.planId.refer.landId.item.town,
                };
            });
        }

        var towns = ['南庄', '石湾', '张槎', '祖庙'];

        function sum(list) {
            var stat = {};

            towns.forEach(function (town) {
                stat[town] = 0;
            });

            list.forEach(function (item) {
                var town = item.town;
                var value = item.item[use];
                stat[town] += value;
            });

            return stat;
        }



        var stat = {
            'land': null,
            'plan': null,
            'construct': null,
            'prepare': null,
            'doing': null,
            'saled-prepare': null,
            'saled-doing': null,
        };


        stat['land'] = sum(lands);
        stat['plan'] = sum(planLicenses);
        stat['construct'] = sum(constructs);


        var groups = {
            0: [],
            1: [],
        };

        saleLicenses.forEach(function (item) {
            groups[item.item.type].push(item);
        });

        stat['prepare'] = sum(groups[0]);
        stat['doing'] = sum(groups[1]);
        stat['saled-prepare'] = sum(groups[0], 'saled-');
        stat['saled-doing'] = sum(groups[1], 'saled-');

        res.success(stat);
    },

    /**
    * 按自建房进行统计。
    */
    diy: function () {

    },
};

