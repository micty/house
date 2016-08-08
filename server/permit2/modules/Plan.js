
var DataBase = require('../lib/DataBase');
var Cache = require('./Plan/Cache');

var db = new DataBase('Plan', [
    { name: 'datetime', },

    { name: 'landId', required: true, unique: true, refer: 'Land', },

    { name: 'project', },
    { name: 'projectDesc', },
    { name: 'use', },
    { name: 'useDesc', },
    { name: 'developer', },
    { name: 'developerDesc', },
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

        try{
            var data = db.get(id, true);
            if (!data) {
                res.none({ 'id': id });
                return;
            }

            var land = data.refer.landId;
            if (!land) {
                res.none('不存在关联的 Land 该记录', item);
                return;
            }

            res.success({
                'land': land.item,
                'plan': data.item,
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

        try{
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
                    var land = item.refer.landId;
                    return land.number.indexOf(keyword) >= 0;
                });
            }

            var PlanLicense = require('./PlanLicense').db;

            list = list.map(function (item) {

                var plan = item.item;
                var licenses = PlanLicense.refer('planId', plan.id);

                return {
                    'land': item.refer.landId.item,
                    'plan': plan,
                    'license': licenses.length,
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
            //用 landId 作为主键关联整条记录。
            var landId$plan = db.map('landId');  
            var keyword = opt.keyword;
            var Land = require('./Land').db;

            var lands = Land.list(function (land) {
                var plan = landId$plan[land.id];
                if (plan) { //说明是已办的。
                    return false;
                }

                if (keyword && land.number.indexOf(keyword) < 0) {
                    return false;
                }

                return true;
            });

            var data = DataBase.page(pageNo, pageSize, lands);

            res.success(data);
        }
        catch (ex) {
            res.error(ex);
        }
    },


};

