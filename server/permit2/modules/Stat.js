


var $ = require('../lib/MiniQuery');
var DataBase = require('../lib/DataBase');

var towns = ['南庄', '石湾', '张槎', '祖庙'];

var uses = [
    'residenceSize',
    'commerceSize',
    'officeSize',
    'otherSize',
    'parkSize',
    'otherSize1',
];




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
                return !!id$planLicense[item.item.licenseId];
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


        function sum(list, prefix) {
            prefix = prefix || '';
            var stat = {};

            uses.forEach(function (key) {
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

        var stat = ({
            'land': function () {
                var Land = require('./Land').db;
                var list = Land.list();
                list = list.map(function (item) {
                    return {
                        'item': item,
                        'town': item.town,
                    };
                });

                var keys = uses.concat('size');
                var stat = sum(list, keys);
                return { 'land': stat };
            },

            'plan': function () {
                var PlanLicense = require('./PlanLicense').db;
                var list = PlanLicense.list(true);

                list = list.map(function (item) {
                    return {
                        'item': item.item,
                        'town': item.refer.planId.refer.landId.item.town,
                    };
                });

                var stat = sum(list);
                return { 'plan': stat };
            },

            'construct': function () {
                var Construct = require('./Construct').db;
                //注意，这里用的规划许可证的字段。
                var list = Construct.list(true);

                list = list.map(function (item) {
                    var license = item.refer.licenseId;
                    return {
                        'item': license.item,
                        'town': license.refer.planId.refer.landId.item.town,
                    };
                });

                var stat = sum(list);
                return { 'construct': stat };
            },

            'sale': function () {
                var SaleLicense = require('./SaleLicense').db;
                var list = SaleLicense.list(true);
                var types = { 0: [], 1: [], };

                list.forEach(function (item) {
                    var data = item.item;
                    types[data.type].push({
                        'item': data,
                        'town': item.refer.saleId.refer.planId.refer.landId.item.town,
                    });
                });

                var stat = {
                    'prepare': null,
                    'doing': null,
                    'saled-prepare': null,
                    'saled-doing': null,
                };

                stat['prepare'] = sum(types[0]);
                stat['doing'] = sum(types[1]);
                stat['saled-prepare'] = sum(types[0], 'saled-');
                stat['saled-doing'] = sum(types[1], 'saled-');

                return stat;
            },

        })[role]();

        res.success(stat);


        function sum(list, prefix, keys) {

            //重载sum(list, keys)
            if (Array.isArray(prefix)) {
                keys = prefix;
                prefix = '';
            }
            
            prefix = prefix || '';
            keys = keys || uses;

            //初始化
            var stat = {};

            towns.forEach(function (town) {
                var group = stat[town] = {};

                keys.forEach(function (key) {
                    group[key] = 0;
                });
            });

            list.forEach(function (item) {
                var group = stat[item.town];
                var key$value = item.item;

                keys.forEach(function (key) {
                    var skey = prefix + key;
                    group[key] += key$value[skey];
                });
            });

            return stat;
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

            //根据销售记录的提交时间找出相应的销售记录集合。
            sales = Sale.list(true, function (sale) {
                var date = sale.item.datetime.split(' ')[0].split('-').join('');
                date = Number(date);

                if (date < beginDate || date > endDate) {
                    return false;
                }

                var plan = sale.refer.planId;
                var land = plan.refer.landId;

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
            planLicenses = PlanLicense.list(true, function (item) {
                return !!id$plan[item.item.planId];
            });

            //以 id 作为主键关联整条记录。
            var id$planLicense = DataBase.map(planLicenses);

            //过滤出符合条件的施工许可证。
            constructs = Construct.list(true, function (item) {
                return !!id$planLicense[item.item.licenseId];
            });

            //过滤出符合条件的销售许可证。
            saleLicenses = SaleLicense.list(true, function (item) {
                return !!id$sale[item.item.saleId];
            });
        }
        else {
            lands = Land.list();
            planLicenses = PlanLicense.list(true);
            constructs = Construct.list(true);
            saleLicenses = SaleLicense.list(true);
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


        function sum(list, prefix) {
            var key = prefix ? prefix + use : use;
            var stat = {};

            towns.forEach(function (town) {
                stat[town] = 0;
            });

            list.forEach(function (item) {
                var town = item.town;
                var value = item.item[key];
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

