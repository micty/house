

var DataBase = require('../lib/DataBase');

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

                var count0 = SaleLicense.count(function (license) {
                    return license.saleId == id && license.type == 0;
                });

                var count1 = SaleLicense.count(function (license) {
                    return license.saleId == id && license.type == 1;
                });

                return {
                    'sale': item.item,
                    'plan': plan.item,
                    'land': land.item,
                    'license0': count0,
                    'license1': count1,
                };
            });

            var data = DataBase.page(pageNo, pageSize, list);

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

            res.success(data);
        }
        catch (ex) {
            res.error(ex);
        }
    },

    /**
    * 批量导入。 todo.....
    */
    import: function (res, data) {

        data = decodeURIComponent(data['data']);
        var groups = JSON.parse(data);

        //记录无法关联的土地记录和规划记录，以及相应的预售许可证和现售备案。
        var none = {
            lands: [],
            plans: [],
            sales: [],      //需要新增的销售记录
            licenses: [],
        };

        var licenses = [];          //需要导入的预售许可证或现售备案。
        var list = db.list();       //全部销售记录
        var count = list.length;    //用于判断是否由于增加了记录而重新写入。
        var planId$sale = {};       //以 planId 作为主键关联到销售记录。

        list.forEach(function (sale) {
            planId$sale[sale.planId] = sale;
        });


        groups.forEach(function (group) {

            var Land = require('./Land');
            var Plan = require('./Plan');

            var lands = Land.db.list();
            var plans = Plan.db.list();
            var land = group.land;

            //根据土地证号找到整条土地记录
            var landItem = lands.find(function (item) {
                var a = item.license.split('|');        //这里只需要找到一个土地证号即可

                var index = a.indexOf(land.license);
                return index > -1;
            });

            if (!landItem) {
                none.lands.push(land);
                none.licenses = none.licenses.concat(group.licenses);
                return;
            }

            //根据土地 id 找到整条规划记录
            var plan = plans.find(function (item) {
                return item.landId == landItem.id;
            });

            if (!plan) {
                none.plans.push(land);
                none.licenses = none.licenses.concat(group.licenses);
                return;
            }

            //根据规划 id 找到对应的销售记录。
            var planId = plan.id;
            var sale = planId$sale[planId];
            var saleId = sale ? sale.id : $.String.random();

            //未存在该销售记录，则添加
            if (!sale) {
                sale = {
                    'id': saleId,
                    'planId': planId,
                    'project': group.sale.project,
                    'datetime': getDateTime(),
                };

                //注册一下，防止重复添加。
                planId$sale[planId] = sale;

                list.push(sale);
                none.sales.push(sale);
            }

            group.licenses.forEach(function (item) {
                item.saleId = saleId; //关联到销售记录
            });

            licenses = licenses.concat(group.licenses); //合并到总列表

        });

        var invalid = none.licenses.length > 0;

        if (licenses.length == 0) {
            var msg = '没有可以导入的销售许可证或现售备案。 ';
            if (invalid) {
                msg += '存在无法关联的土地记录或规划记录。';
            }

            res.send({
                code: invalid ? 301 : 300,
                msg: msg,
                data: none,
            });
            return;
        }


        //销售记录的条数发生了变化，写回 json 文件。
        if (list.length > count) {
            try {
                var path = getPath();
                var json = JSON.stringify(list, null, 4);
                fs.writeFileSync(path, json, 'utf8');
            }
            catch (ex) {
                res.send({
                    code: 501,
                    msg: ex.message,
                });

                return;
            }
        }

        //预售许可证或现售备案列表。
        try {
            var SaleLicense = require('./SaleLicense');
            var result = SaleLicense.add(licenses);

            res.send({
                code: invalid ? 201 : 0, //这里全部成功用 0，方便前端处理
                msg: invalid ?
                    '部分导入成功! 存在部分无法关联的土地记录或规划记录。' :
                    '全部导入成功。',

                data: $.Object.extend({}, none, result),
            });
        }
        catch (ex) {
            res.send({
                code: 502,
                msg: ex.message,
            });
        }

    },



};

