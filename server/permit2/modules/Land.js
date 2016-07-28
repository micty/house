
var DataBase = require('../lib/DataBase');

var db = new DataBase('Land', [
    { name: 'datetime', },

    { name: 'number', required: true, alias: '土地挂牌编号', },
    { name: 'numberDesc', },
    { name: 'town', },
    { name: 'townDesc', },
    { name: 'location', },
    { name: 'locationDesc', },
    { name: 'size', type: 'number', },
    { name: 'sizeDesc', },
    { name: 'use', },
    { name: 'useDesc', },
    { name: 'diy', type: 'boolean', },
    { name: 'diyDesc', },
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
    { name: 'winner', },
    { name: 'winnerDesc', },
    { name: 'price', type: 'number', },
    { name: 'priceDesc', },
    { name: 'date', },
    { name: 'dateDesc', },
    { name: 'contract', },
    { name: 'contractDesc', },
    { name: 'license', },
    { name: 'licenseDesc', },
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
            var item = db.get(id);
            if (item) {
                res.success(item);
            }
            else {
                res.none({'id': id });
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
    * 读取指定分页和条件的列表。
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
            var town = opt.town;
            var keyword = opt.keyword;

            var data = db.page(pageNo, pageSize, function (item) {

                if (town && item.town != town) {
                    return false;
                }

                if (keyword && item.number.indexOf(keyword) < 0) {
                    return false;
                }

                return true;
            });

            res.success(data);
        }
        catch (ex) {
            res.error(ex);
        }
    },

};

