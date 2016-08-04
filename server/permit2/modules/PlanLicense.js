﻿

var DataBase = require('../lib/DataBase');

var db = new DataBase('PlanLicense', [
    { name: 'datetime', },

    { name: 'planId', required: true, refer: 'Plan', },

    { name: 'number', },
    { name: 'numberDesc', },
    { name: 'name', },
    { name: 'nameDesc', },
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
    * 获取一条指定 id 的记录。
    */
    get: function (req, res) {
        var id = req.query.id;
        if (!id) {
            res.empty('id');
            return;
        }

        try {
            var refer = req.query.refer == 'true'; //是否需要关联获取外键记录。
            var item = db.get(id, refer);

            if (!item) {
                res.none({ 'id': id });
                return;
            }

            if (!refer) {
                res.success(item);
                return;
            }

            //需要外键信息的。 在 construct/add 页面用到。
            var plan = item.refer.planId;
            var land = plan.refer.landId;

            res.success({
                'license': item.item,
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
    * 读取指定 planId 的列表。
    */
    list: function (req, res) {
        var planId = req.query.planId;
        if (!planId) {
            res.empty('planId');
            return;
        }

        try {
            var list = db.list(function (item) {
                return item.planId == planId;
            });
            res.success(list);
        }
        catch (ex) {
            res.error(ex);
        }
    },

};

