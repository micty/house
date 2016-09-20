
var $ = require('../lib/MiniQuery');
var DataBase = require('../lib/DataBase');

var db = new DataBase('SaleLicense', [
    { name: 'datetime', },

    { name: 'saleId', required: true, refer: 'Sale', },
    { name: 'type', type: 'number', required: true, },

    { name: 'number', required: true, unique: true, }, //证号
    { name: 'numberDesc', },
    { name: 'date', },
    { name: 'dateDesc', },
    { name: 'location', },
    { name: 'locationDesc', },

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
    { name: 'residenceCell', type: 'number', },
    { name: 'residenceCellDesc', },
    { name: 'commerceCell', type: 'number', },
    { name: 'commerceCellDesc', },
    { name: 'officeCell', type: 'number', },
    { name: 'officeCellDesc', },
    { name: 'otherCell', type: 'number', },
    { name: 'otherCellDesc', },
   
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
            var item = db.get(id); //这里不需要关联获取外键记录。
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
    * 读取指定 saleId 的列表。
    */
    list: function (req, res) {
        var saleId = req.query.saleId;
        if (!saleId) {
            res.empty('saleId');
            return;
        }

        try {
            var list = db.refer('saleId', saleId);
            var Saled = require('./Saled').db;

            list = list.map(function (license) {
                var saleds = Saled.refer('licenseId', license.id);

                return {
                    'license': license,
                    'saleds': saleds,
                };
            });

            res.success(list);
        }
        catch (ex) {
            res.error(ex);
        }
    },

    /**
    * 批量导入。
    */
    import: function (items) {

        //以证号作为主键。
        var number$item = db.map('number');

        var adds = [];
        var updates = [];

        items.forEach(function (item) {
            var number = item.number;
            var oldItem = number$item[number];

            //已存在相同证号的记录，则合并覆盖。
            if (oldItem) {
                item = $.Object.extend({}, oldItem, item);
                updates.push(item);
                return;
            }

            //新记录。
            adds.push(item);

            //更新注册
            number$item[number] = item;
        });

        if (adds.length > 0) {
            adds = db.add(adds);
        }

        if (updates.length > 0) {
            updates = db.update(updates);
        }

        return {
            'adds': adds,
            'updates': updates,
        };
    },
};

