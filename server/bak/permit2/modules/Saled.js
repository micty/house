
/**
* 已售记录。
*/

var $ = require('../lib/MiniQuery');
var DataBase = require('../lib/DataBase');

var db = new DataBase('Saled', [
    { name: 'datetime', },

    { name: 'licenseId', required: true, refer: 'SaleLicense', },

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
    * 读取指定 licenseId 的列表。
    */
    list: function (req, res) {
        var licenseId = req.query.licenseId;
        if (!licenseId) {
            res.empty('licenseId');
            return;
        }

        try {
            var list = db.refer('licenseId', licenseId);
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

    },
};

