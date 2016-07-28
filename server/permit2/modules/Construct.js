

var DataBase = require('../lib/DataBase');

var db = new DataBase('Construct', [
    { name: 'datetime', },

    { name: 'licenseId', required: true, unique: true, refer: 'PlanLicense', },

    { name: 'number', },
    { name: 'numberDesc', },
    { name: 'date', },
    { name: 'dateDesc', },
    { name: 'size', type: 'number', },
    { name: 'sizeDesc', },

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

            var license = data.refer.licenseId;
            if (!license) {
                res.none('不存在关联的 PlanLicense 记录', data);
                return;
            }

            var plan = license.refer.planId;
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
                'construct': data.item,
                'license': license.item,
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
          
            list = list.map(function (item) {
                var license = item.refer.licenseId; //关联的规划许可证。
                var plan = license.refer.planId;
                var land = plan.refer.landId;

                return {
                    'construct': item.item,
                    'license': license.item,
                    'plan': plan.item,
                    'land': land.item,
                };
            });

            if (keyword) {
                list = list.filter(function (item) {
                    var land = item.land;
                    return land.number.indexOf(keyword) >= 0;
                });
            }

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
            //用 licenseId 作为主键关联整条记录。
            var id$item = db.map('licenseId');
            var keyword = opt.keyword;
            var PlanLicense = require('./PlanLicense').db;

            var licenses = PlanLicense.list(true, function (license) {
                var item = id$item[license.item.id];
                if (item) { 
                    return false; //说明是已办的。
                }

                if (keyword) {
                    var land = license.refer.planId.refer.landId.item;
                    if (land.number.indexOf(keyword) < 0) {
                        return false;
                    }
                }

                return true;
            });

            licenses = licenses.map(function (item) {
                var plan = item.refer.planId;
                var land = plan.refer.landId;

                return {
                    'license': item.item,
                    'plan': plan.item,
                    'land': land.item,
                };
            });

            var data = DataBase.page(pageNo, pageSize, licenses);
            res.success(data);
        }
        catch (ex) {
            res.error(ex);
        }
    },


};

