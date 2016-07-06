

var DataBase = require('../lib/DataBase');

var db = new DataBase('PlanLicense', [
    { name: 'datetime', },

    { name: 'planId', required: true, refer: 'Plan', },

    { name: 'number', },
    { name: 'numberDesc', },
    { name: 'date', },
    { name: 'dateDesc', },
    { name: 'residenceSize', type: 'number', },
    { name: 'residenceSizeDesc', },
    { name: 'commerceSize', type: 'number', },
    { name: 'commerceSizeDesc', },
    { name: 'officeSize', type: 'number', },
    { name: 'officeSizeDesc', },
    { name: 'otherSize', type: 'number', },
    { name: 'otherSizeDesc', },
    { name: 'parkSize', type: 'number', },
    { name: 'parkSizeDesc', },
    { name: 'otherSize1', type: 'number', },
    { name: 'otherSize1Desc', },

]);




module.exports = {

    /**
    * 仅供其它内部模块调用。
    */
    db: db,

    /**
    * 获取一条记录。
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
                res.none('不存在关联的 Plan 该记录', item);
                return;
            }

            var land = plan.refer.landId;
            if (!land) {
                res.none('不存在关联的 Land 该记录', land);
                return;
            }

            res.success({
                'license': data.item,
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

        var item = req.body;

        try {
            item = db.add(item);
            res.success('添加成功', item);
        }
        catch (ex) {
            res.error(ex);
        }
    },

    /**
    * 更新一条记录。
    */
    update: function (req, res) {

        var item = req.body;
        var id = item.id;

        if (!id) {
            res.empty('id');
            return;
        }

        try {
            var data = db.update(item);
            if (data) {
                res.success('更新成功', data);
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
    * 删除一条记录。
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
                res.success('删除成功', item);
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
    * 读取列表。
    */
    list: function (req, res) {

        //重载 list()，供内部其它模块调用。
        if (!req) {
            return db.list();
        }

        try {
            var list = db.list();
            list.reverse(); //倒序一下
            res.success(list);
        }
        catch (ex) {
            res.error(ex);
        }

    },


};

