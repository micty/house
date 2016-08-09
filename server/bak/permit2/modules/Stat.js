
var $ = require('../lib/MiniQuery');
var DataBase = require('../lib/DataBase');

var Dates = require('./Stat/Dates');
var Towns = require('./Stat/Towns');
var Uses = require('./Stat/Uses');
var Cache = require('./Stat/Cache');


//按区域进行分类，再按功能进行求和。
function sum(list, prefix, keys) {

    //重载sum(list, keys)
    if (Array.isArray(prefix)) {
        keys = prefix;
        prefix = '';
    }

    prefix = prefix || '';
    keys = keys || Uses;

    //初始化
    var stat = {};

    Towns.forEach(function (town) {
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

        var cache = Cache.get('town', data);
        if (cache) {
            res.success(cache);
            return;
        }

        var Land = require('./Land').db;
        var Construct = require('./Construct').db;
        var PlanLicense = require('./PlanLicense').db;
        var Sale = require('./Sale').db;
        var SaleLicense = require('./SaleLicense').db;

        var lands = [];
        var plans = [];
        var constructs = [];
        var sales = [];
        var planLicenses = [];
        var saleLicenses = [];


        var dates = Dates.normalize(data);

        //如果指定了开始时间或结束时间，
        if (dates) {
            //根据销售记录的提交时间找出相应的销售记录集合。
            sales = Sale.list(true, function (sale) {
                var date = sale.item.datetime.split(' ')[0].split('-').join('');
                date = Number(date);

                if (date < dates.begin || date > dates.end) {
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
        }

        //注意，这里用的规划许可证的字段。
        constructs = constructs.map(function (item) {
            return item.refer.licenseId.item;   
        });


        function sum(list, prefix) {
            prefix = prefix || '';
            var stat = {};

            Uses.forEach(function (key) {
                stat[key] = 0;
                var skey = prefix + key;

                list.forEach(function (item) {
                    var value = Number(item[skey]) || 0;
                    stat[key] += value;
                });
            });
            return stat;
        }

        var stat = { };
        
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
        stat['saled-prepare'] = sum(types[0], 'saled-');
        stat['saled-doing'] = sum(types[1], 'saled-');

        Cache.set('town', data, stat);
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

        var cache = Cache.get('role', data);
        if (cache) {
            res.success(cache);
            return;
        }

        var dates = Dates.normalize(data);

        var stat = ({
            'land': function () {
                var Land = require('./Land').db;
                var list = Land.list();

                //如果指定了开始时间或结束时间，则以竞得时间为准。
                if (dates) {
                    list = list.filter(function (item) {
                        return Dates.filter(dates, item.date);
                    });
                }

                list = list.filter(function (item) {
                    return !item.diy;
                });

                list = list.map(function (item) {
                    return {
                        'item': item,
                        'town': item.town,
                    };
                });

                var keys = Uses.concat('size');
                var stat = sum(list, keys);
                return { 'land': stat };
            },

            'plan': function () {
                var PlanLicense = require('./PlanLicense').db;
                var list = PlanLicense.list(true);
                //如果指定了开始时间或结束时间，则以规划许可证时间为准。
                if (dates) {
                    list = list.filter(function (item) {
                        return Dates.filter(dates, item.item.date);
                    });
                }

                list = list.filter(function (item) {
                    var land = item.refer.planId.refer.landId.item;
                    return !land.diy;
                });

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

                //如果指定了开始时间或结束时间，则以建设日期为准。
                if (dates) {
                    list = list.filter(function (item) {
                        return Dates.filter(dates, item.item.date);
                    });
                }

                list = list.filter(function (item) {
                    var land = item.refer.licenseId.refer.planId.refer.landId.item;
                    return !land.diy;
                });

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

                //如果指定了开始时间或结束时间，则以....为准。
                if (dates) {
                    //todo...................
                }

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

                var stat = { };

                stat['prepare'] = sum(types[0]);
                stat['doing'] = sum(types[1]);
                stat['saled-prepare'] = sum(types[0], 'saled-');
                stat['saled-doing'] = sum(types[1], 'saled-');

                return stat;
            },

        })[role]();

        Cache.set('role', data, stat);
        res.success(stat);
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

        var cache = Cache.get('use', data);
        if (cache) {
            res.success(cache);
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

        var dates = Dates.normalize(data);

        //如果指定了开始时间或结束时间，
        if (dates) {

            //根据销售记录的提交时间找出相应的销售记录集合。
            sales = Sale.list(true, function (sale) {
                var date = sale.item.datetime.split(' ')[0].split('-').join('');
                date = Number(date);

                if (date < dates.begin || date > dates.end) {
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


        lands = lands.filter(function (item) {
            return !item.diy;
        });

        lands = lands.map(function (item) {
            return {
                'item': item,
                'town': item.town,
            };
        });

        planLicenses = planLicenses.filter(function (item) {
            var land = item.refer.planId.refer.landId.item;
            return !land.diy;
        });

        planLicenses = planLicenses.map(function (item) {
            return {
                'item': item.item,
                'town': item.refer.planId.refer.landId.item.town,
            };
        });

        constructs = constructs.filter(function (item) {
            var land = item.refer.licenseId.refer.planId.refer.landId.item;
            return !land.diy;
        });

        //注意，这里用的规划许可证的字段。
        constructs = constructs.map(function (item) {
            var license = item.refer.licenseId;
            return {
                'item': license.item,
                'town': license.refer.planId.refer.landId.item.town,
            };
        });

        saleLicenses = saleLicenses.filter(function (item) {
            var land = item.refer.saleId.refer.planId.refer.landId.item;
            return !land.diy;
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


        var stat = { };

        stat['land'] = sum(lands);
        stat['plan'] = sum(planLicenses);
        stat['construct'] = sum(constructs);

        //按 type 进行分类收集。
        var types = { 0: [], 1: [], };

        saleLicenses.forEach(function (item) {
            types[item.item.type].push(item);
        });

        stat['prepare'] = sum(types[0]);
        stat['doing'] = sum(types[1]);
        stat['saled-prepare'] = sum(types[0], 'saled-');
        stat['saled-doing'] = sum(types[1], 'saled-');

        Cache.set('use', data, stat);
        res.success(stat);
    },

    /**
    * 按自建房进行统计。
    */
    diy: function (req, res) {
        var data = req.body.data;

        var cache = Cache.get('diy', data);
        if (cache) {
            res.success(cache);
            return;
        }


        var lands = [];
        var plans = [];
        var constructs = [];
        var planLicenses = [];

        var Land = require('./Land').db;
        var Construct = require('./Construct').db;
        var PlanLicense = require('./PlanLicense').db;

        var dates = Dates.normalize(data);

        //如果指定了开始时间或结束时间，
        if (dates) {

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

        function sum(list) {
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


        var stat = {};

        stat['land'] = sum(lands);
        stat['plan'] = sum(planLicenses);
        stat['construct'] = sum(constructs);

        Cache.set('diy', data, stat);
        res.success(stat);
    },

    /**
    * 统计一览表。
    */
    all: function (req, res) {
        var data = req.body.data;
        var cache = Cache.get('all', data);
        if (cache) {
            res.success(cache);
            return;
        }

        var dates = Dates.normalize(data);

        var roles = {
            'land': function () {
                var Land = require('./Land').db;
                var list = Land.list();

                list = list.filter(function (item) {
                    return !item.diy;
                });

                list = list.map(function (item) {
                    return {
                        'item': item,
                        'town': item.town,
                    };
                });
                var stat = sum(list);
                return { 'land': stat };
            },

            'plan': function () {
                var PlanLicense = require('./PlanLicense').db;
                var list = PlanLicense.list(true);

                list = list.filter(function (item) {
                    var land = item.refer.planId.refer.landId.item;
                    return !land.diy;
                });

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

                list = list.filter(function (item) {
                    var land = item.refer.licenseId.refer.planId.refer.landId.item;
                    return !land.diy;
                });

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

                stat['prepare'] = sum(types[0]);
                stat['doing'] = sum(types[1]);
                stat['saled-prepare'] = sum(types[0], 'saled-');
                stat['saled-doing'] = sum(types[1], 'saled-');

                return stat;
            },
        };


        var stat = {};

        Object.keys(roles).forEach(function (key) {
            var fn = roles[key];
            var obj = fn();

            $.Object.extend(stat, obj);
        });

        Cache.set('all', data, stat);
        res.success(stat);

    },
};

