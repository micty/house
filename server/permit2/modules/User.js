

var DataBase = require('../lib/DataBase');

var db = new DataBase('User', [
    { name: 'datetime', },

    { name: 'department', },
    { name: 'number', },
    { name: 'password', },
    { name: 'name', },
    { name: 'sex', },
    { name: 'phone', },
    { name: 'address', },
    { name: 'role', },
    
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

        try {
            var item = db.get(id);
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

    /**
    * 登录。
    */
    login: function (req, res) {

        var Session = require('../lib/Session');

        var data = req.body;
        var number = data.number;
        var password = data.password;


        //针对超级管理员，password = 'fsadmin';
        if (number == 'administrator' &&
            password == '4e55030f4f26da6c98acf44708d710ea') {

            var item = {
                'number': number,
                'name': "超级管理员",
                'role': number,
            };

            item.token = Session.add(item);

            res.success(item);
            return;
        }


        try {
            var list = db.list();

            var item = list.find(function (item, index) {
                return item.number == number &&
                    item.password == password;
            });

            if (!item) {
                res.send({
                    code: 201,
                    msg: '用户名或密码错误',
                });
                return;
            }

            item.token = Session.add(item);

            res.success(item);
        }
        catch (ex) {
            res.error(ex);
        }
    },


};

