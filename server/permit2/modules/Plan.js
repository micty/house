

var DataBase = require('../lib/DataBase');

var db = new DataBase('Plan', [
    //{ name: 'id', type: 'string', required: false, },
    { name: 'datetime', type: 'string', required: false, },

    { name: 'landId', type: 'string', required: true, unique: true, },
    { name: 'project', type: 'string', required: false, },
    { name: 'projectDesc', type: 'string', required: false, },
    { name: 'use', type: 'string', required: false, },
    { name: 'useDesc', type: 'string', required: false, },
    { name: 'developer', type: 'string', required: false, },
    { name: 'developerDesc', type: 'string', required: false, },
]);




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
            if (!item) {
                res.none({ 'id': id });
                return;
            }

            var Land = require('./Land');
            var land = Land.db.get(item.landId);

            if (!land) {
                res.none('不存在关联的 Land 该记录', item);
                return;
            }

            res.success({
                'land': land,
                'plan': item,
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

