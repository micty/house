

var fs = require('fs');
var $ = require('../lib/MiniQuery');
var Directory = require('../lib/Directory');


//预创建目录
Directory.create('./data/house2/');


function getPath(id) {

    if (id) {
        return $.String.format('./data/house2/{0}.json', id);
    }

    return './data/house2-list.json';
}

function getDateTime() {
    var datetime = $.Date.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    return datetime;
}


function emptyError(name, res) {
    res.send({
        code: 201,
        msg: '字段 ' + name + ' 不能为空',
    });
}


module.exports = {

    /**
    * 获取
    */
    get: function (res, id) {

        if (!id) {
            emptyError('id', res);
            return;
        }


        var path = getPath(id);
        if (!fs.existsSync(path)) {
            res.send({
                code: 201,
                msg: '不存在该记录',
            });
            return;
        }



        fs.readFile(path, 'utf8', function (err, data) {

            if (err) {
                res.send({
                    code: 201,
                    msg: err,
                });
                return;
            }

            try {
                var json = JSON.parse(data);
                res.send({
                    code: 200,
                    msg: 'ok',
                    data: json,
                });
            }
            catch (ex) {
                res.send({
                    code: 201,
                    msg: ex.message,
                });
            }
        });
    },


    /**
    * 添加
    */
    add: function (res, data) {

        data = decodeURIComponent(data['data']);
        data = JSON.parse(data);


        var id = $.String.random();
        var path = getPath(id);

    
        data = $.Object.extend(data, {
            'id': id,
            'datetime': getDateTime(),

        });

        var json = JSON.stringify(data, null, 4);


        fs.writeFile(path, json, 'utf8', function (err) {

            if (err) {
                res.send({
                    code: 201,
                    msg: err,
                });
                return;
            }

            var list;
            var path = getPath();

            if (fs.existsSync(path)) {
                list = fs.readFileSync(path);
                list = JSON.parse(list);
            }
            else {
                list = [];
            }

            //列表数据
            list.push({
                'id': id,
                'name': data.name,
                'address': data.address,
                'type': data.type,
                'price': data.price,
                'phone': data.phone,
                'cover': data.cover,
                'belong': data.belong,
            });

            list = JSON.stringify(list, null, 4);


            fs.writeFile(path, list, 'utf8', function (err) {

                if (err) {
                    res.send({
                        code: 201,
                        msg: err,
                    });
                    return;
                }

                res.send({
                    code: 200,
                    msg: 'ok',
                    data: {
                        'id': id,
                    },
                });
            });

        });

    },

    /**
    * 更新
    */
    update: function (res,  data) {

        data = decodeURIComponent(data['data']);
        data = JSON.parse(data);

        var id = data.id;
        if (!id) {
            emptyError('id', res);
            return;
        }

        var path = getPath(id);

        data = $.Object.extend(data, {
            'datetime': getDateTime(),
        });

        var json = JSON.stringify(data, null, 4);


        //写入到详情
        fs.writeFile(path, json, 'utf8', function (err) {

            if (err) {
                res.send({
                    code: 201,
                    msg: err,
                });
                return;
            }

            //写入到列表
            var newItem = {
                'id': id,
                'name': data.name,
                'address': data.address,
                'type': data.type,
                'price': data.price,
                'phone': data.phone,
                'cover': data.cover,
                'belong': data.belong,
            };

            var list;
            var path = getPath();

            if (fs.existsSync(path)) {
                list = fs.readFileSync(path);
                list = JSON.parse(list);
            }
            else {
                list = [newItem];
            }

            var item = $.Array.findItem(list, function (item, index) {
                return item.id == id;
            });

            if (item) {
                $.Object.extend(item, newItem);
            }


            list = JSON.stringify(list, null, 4);

            fs.writeFile(path, list, 'utf8', function (err) {

                if (err) {
                    res.send({
                        code: 201,
                        msg: err,
                    });
                    return;
                }

                res.send({
                    code: 200,
                    msg: '更新成功',
                    data: {
                        'id': id,
                    },
                });
            });


        });

    },


    /**
    * 删除
    */
    remove: function (res, id) {

        if (!id) {
            emptyError('id', res);
            return;
        }


        function success(data) {
            res.send({
                code: 200,
                msg: '删除成功',
                data: data || [],
            });
        }


        var path = getPath();

        if (!fs.existsSync(path)) {
            success();
            return;
        }


        var list = fs.readFileSync(path);
        list = JSON.parse(list);

        list = $.Array.grep(list, function (item, index) {
            return item.id != id;
        });

        var json = JSON.stringify(list, null, 4);


        fs.writeFile(path, json, 'utf8', function (err) {

            if (err) {
                res.send({
                    code: 201,
                    msg: err,
                });
                return;
            }

            var path = getPath(id);
            if (!fs.existsSync(path)) {
                success(list);
                return;
            }

            //详情文件，不管是否成功返回成功
            fs.unlink(path, function (err) {
                success(list);
            });
        });


    },

    /**
    * 读取列表
    */
    list: function (res) {

        var path = getPath();
        var existed = fs.existsSync(path);

        //重载 list()，供内部其它模块调用。
        if (!res) {
            if (!existed) {
                return;
            }

            var data = fs.readFileSync(path, 'utf8');
            var list = JSON.parse(data);
            return list;
        }


        //重载 list(res)，供 http 请求调用。
        if (!existed) {
            res.send({
                code: 200,
                msg: 'empty',
                data: [],
            });
            return;
        }



        fs.readFile(path, 'utf8', function (err, data) {

            if (err) {
                res.send({
                    code: 201,
                    msg: err,
                });
                return;
            }

            try {
                var list = JSON.parse(data);
                list.reverse(); //倒序一下

                res.send({
                    code: 200,
                    msg: 'ok',
                    data: list,
                });
            }
            catch (ex) {
                res.send({
                    code: 201,
                    msg: ex.message,
                });
            }

        });

    },



};

