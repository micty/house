
var $ = require('../lib/MiniQuery');
var DataBase = require('../lib/DataBase');
var Cache = require('./Sale/Cache');

var db = new DataBase('Sale', [
    { name: 'datetime', },

    { name: 'planId', required: true, unique: true, refer: 'Plan', },

    { name: 'project', },
    { name: 'projectDesc', },

]);




module.exports = {

    /**
    * 仅供其它内部模块调用。
    */
    db: db,

    /**
    * 获取一条指定 id 的记录。
    */
    get: function (req, res) {
        var id = req.query.id;
        if (!id) {
            res.empty('id');
            return;
        }

        try {
            var data = db.get(id, true);
            if (!data) {
                res.none({ 'id': id });
                return;
            }

            var plan = data.refer.planId;
            if (!plan) {
                res.none('不存在关联的 Plan 记录', data);
                return;
            }

            var land = plan.refer.landId;
            if (!land) {
                res.none('不存在关联的 Land 记录', data);
                return;
            }

            res.success({
                'sale': data.item,
                'plan': plan.item,
                'land': land.item,
            });

        }
        catch (ex) {
            res.error(ex);
        }
    },

    /**
    * 添加一条记录。
    */
    add: function (req, res) {
        var item = req.body.data;

        try {
            item = db.add(item);
            res.success(item);
        }
        catch (ex) {
            res.error(ex);
        }
    },

    /**
    * 更新一条指定 id 的记录。
    */
    update: function (req, res) {
        var item = req.body.data;
        var id = item.id;

        if (!id) {
            res.empty('id');
            return;
        }

        try {
            var data = db.update(item);
            if (data) {
                res.success(data);
            }
            else {
                res.none(item);
            }
        }
        catch (ex) {
            res.error(ex);
        }
    },

    /**
    * 删除一条指定 id 的记录。
    */
    remove: function (req, res) {
        var id = req.query.id;

        if (!id) {
            res.empty('id');
            return;
        }

        try {
            var item = db.remove(id);
            if (item) {
                res.success(item);
            }
            else {
                res.none({ 'id': id });
            }
        }
        catch (ex) {
            res.error(ex);
        }
    },

    /**
    * 读取指定分页和条件的已办列表。
    */
    page: function (req, res) {
        var opt = req.body.data;
        var pageNo = opt.pageNo;

        if (!pageNo) {
            res.empty('pageNo');
            return;
        }

        var pageSize = opt.pageSize;
        if (!pageSize) {
            res.empty('pageSize');
            return;
        }

        try {
            var cache = Cache.getPage(opt);
            if (cache) {
                res.success(cache);
                return;
            }

            var keyword = opt.keyword;
            var list = db.list(true);

            if (keyword) {
                list = list.filter(function (item) {
                    var land = item.refer.planId.refer.landId;
                    return land.number.indexOf(keyword) >= 0;
                });
            }

            var SaleLicense = require('./SaleLicense').db;

            list = list.map(function (item) {

                var plan = item.refer.planId;
                var land = plan.refer.landId;

                var id = item.item.id;
                var counts = { 0: 0, 1: 0, };
                var licenses = SaleLicense.refer('saleId', id);

                licenses.forEach(function (item) {
                    counts[item.type]++;
                });

                return {
                    'sale': item.item,
                    'plan': plan.item,
                    'land': land.item,
                    'license0': counts[0],
                    'license1': counts[1],
                };
            });

            var data = DataBase.page(pageNo, pageSize, list);
            Cache.setPage(opt, data);
            res.success(data);
        }
        catch (ex) {
            res.error(ex);
        }
    },

    /**
    * 读取指定分页和条件的待办列表。
    */
    todos: function (req, res) {
        var opt = req.body.data;
        var pageNo = opt.pageNo;

        if (!pageNo) {
            res.empty('pageNo');
            return;
        }

        var pageSize = opt.pageSize;
        if (!pageSize) {
            res.empty('pageSize');
            return;
        }

        try {
            var cache = Cache.getTodos(opt);
            if (cache) {
                res.success(cache);
                return;
            }

            //用 planId 作为主键关联整条记录。
            var id$item = db.map('planId');
            var keyword = opt.keyword;
            var Plan = require('./Plan').db;

            var plans = Plan.list(true, function (plan) {
                var item = id$item[plan.item.id];
                if (item) { 
                    return false; //说明是已办的。
                }

                var land = plan.refer.landId.item;
                if (keyword && land.number.indexOf(keyword) < 0) {
                    return false;
                }

                return true;
            });

            plans = plans.map(function (item) {
                var land = item.refer.landId;

                return {
                    'plan': item.item,
                    'land': land.item,
                };
            });

            var data = DataBase.page(pageNo, pageSize, plans);
            Cache.setTodos(opt, data);
            res.success(data);
        }
        catch (ex) {
            res.error(ex);
        }
    },

    /**
    * 批量导入。 
    */
    'import': function (req, res) {

        //同一个土地证号就为一个组。
        var groups = req.body.data; 

        //记录无法关联的土地记录和规划记录，以及相应的预售许可证和现售备案。
        var fail = {
            'lands': [],
            'plans': [],
            'licenses': [],
        };

        var sales = db.list();      //导入前的销售记录。

        var license$land = require('./Land').map('license');    //以土地证号为主键关联整条土地记录。
        var landId$plan = require('./Plan').db.map('landId');   //以 landId 作为主键关联整条规划记录。
        var planId$sale = DataBase.map(sales, 'planId');        //以 planId 作为主键关联整条销售记录。

        //需要导入的
        var imported = {
            'sales': [],
            'licenses': [],
            'licenseId$saled': {},
        };

        //把 items 合并到 list 中。
        function concat(list, items) {
            if (Array.isArray(list)) {
                list.push.apply(list, items);
            }
            else { //两个 obj 合并
                $.Object.extend(list, items);
            }
        }


        groups.forEach(function (group) {
            var land = group.land;
            var licenses = group.licenses;

            //根据土地证号找到整条土地记录
            var landItem = license$land[land.license];

            if (!landItem) {
                fail.lands.push(land);
                concat(fail.licenses, licenses);
                return;
            }

            //根据土地 id 向下找到整条规划记录
            var plan = landId$plan[landItem.id];
            if (!plan) {
                fail.plans.push(land);  //这里压进的是 land，而不是 plan。
                concat(fail.licenses, licenses);
                return;
            }

            //根据规划 id 向下找到对应的销售记录。
            var planId = plan.id;
            var sale = planId$sale[planId];
            var saleId = sale ? sale.id : DataBase.newId();

            //未存在该销售记录，则添加
            if (!sale) {
                sale = {
                    'id': saleId,
                    'planId': planId,
                    'project': group.sale.project,
                    'projectDesc': '',
                };

                //注册一下，防止重复添加。
                planId$sale[planId] = sale;
                imported.sales.push(sale);
            }

            //关联到销售记录
            licenses.forEach(function (item) {
                item.saleId = saleId; 
            });

            concat(imported.licenses, licenses);
            concat(imported.licenseId$saled, group.licenseId$saled);
        });


        var invalid = fail.licenses.length > 0;

        if (imported.licenses.length == 0) {
            res.send({
                code: invalid ? 301 : 300,
                msg: '没有可以导入的销售许可证或现售备案。' + (invalid ? ' 存在无法关联的土地记录或规划记录。' : ''),
                data: fail,
            });
            return;
        }

        //新增了销售记录。
        if (imported.sales.length > 0) {
            try {
                db.add(imported.sales);
            }
            catch (ex) {
                res.error(ex);
                return;
            }
        }

        //预售许可证或现售备案列表。
        try {
            var result = require('./SaleLicense').import(imported.licenses);

            res.send({
                code: invalid ? 201 : 0, //这里全部成功用 0，方便前端处理
                msg: invalid ?
                    '部分导入成功! 存在部分无法关联的土地记录或规划记录。' :
                    '全部导入成功。',
                data: $.Object.extend({}, fail, result),
            });
        }
        catch (ex) {
            res.error(ex);
        }

    },



};

