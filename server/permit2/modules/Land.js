

var DataBase = require('../lib/DataBase');
var db = new DataBase('land');


module.exports = {

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
                res.none();
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
            res.success(item);
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
            item = db.update(item);
            res.success(item);
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
            res.success(item);
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

