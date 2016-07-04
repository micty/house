

var DataBase = require('../lib/DataBase');

var db = new DataBase('Land', [
    //{ name: 'id', type: 'string', required: false, },
    { name: 'datetime', type: 'string', required: false, },

    { name: 'number', type: 'string', required: false, },
    { name: 'numberDesc', type: 'string', required: false, },
    { name: 'town', type: 'string', required: false, },
    { name: 'townDesc', type: 'string', required: false, },
    { name: 'location', type: 'string', required: false, },
    { name: 'locationDesc', type: 'string', required: false, },
    { name: 'size', type: 'number', required: false, },
    { name: 'sizeDesc', type: 'string', required: false, },
    { name: 'use', type: 'string', required: false, },
    { name: 'useDesc', type: 'string', required: false, },
    { name: 'residenceSize', type: 'number', required: false, },
    { name: 'residenceSizeDesc', type: 'string', required: false, },
    { name: 'commerceSize', type: 'number', required: false, },
    { name: 'commerceSizeDesc', type: 'string', required: false, },
    { name: 'officeSize', type: 'number', required: false, },
    { name: 'officeSizeDesc', type: 'string', required: false, },
    { name: 'otherSize', type: 'number', required: false, },
    { name: 'otherSizeDesc', type: 'string', required: false, },
    { name: 'parkSize', type: 'number', required: false, },
    { name: 'parkSizeDesc', type: 'string', required: false, },
    { name: 'otherSize1', type: 'number', required: false, },
    { name: 'otherSize1Desc', type: 'string', required: false, },
    { name: 'winner', type: 'string', required: false, },
    { name: 'winnerDesc', type: 'string', required: false, },
    { name: 'price', type: 'number', required: false, },
    { name: 'priceDesc', type: 'string', required: false, },
    { name: 'date', type: 'string', required: false, },
    { name: 'dateDesc', type: 'string', required: false, },
    { name: 'contract', type: 'string', required: false, },
    { name: 'contractDesc', type: 'string', required: false, },
    { name: 'license', type: 'string', required: false, },
    { name: 'licenseDesc', type: 'string', required: false, },
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

        var item = req.body;

        try{
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

    }


};

