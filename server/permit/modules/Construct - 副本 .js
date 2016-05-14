

var fs = require('fs');
var $ = require('../lib/MiniQuery');
var Directory = require('../lib/Directory');


function getPath() {
    return './data/construct-list.json';
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
    * 获取一条记录。
    */
    get: function (res, id)  {
        if (!id) {
            emptyError('id', res);
            return;
        }

        var path = getPath();
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
                    code: 500,
                    msg: err,
                });
                return;
            }

            try {
                var list = JSON.parse(data);
                var item = $.Array.findItem(list, function (item, index) {
                    return item.id == id;
                });

                if (!item) {
                    res.send({
                        code: 201,
                        msg: '不存在该记录',
                    });
                    return;
                }

                res.send({
                    code: 200,
                    msg: 'ok',
                    data: item,
                });
            }
            catch (ex) {
                res.send({
                    code: 501,
                    msg: ex.message,
                });
            }
        });
    },

    /**
    * 添加一条记录。
    */
    add: function (res, data) {

        var path = getPath();
        var list = [];

        try {

            if (fs.existsSync(path)) {
                list = fs.readFileSync(path);
                list = JSON.parse(list);
            }


            var item = $.Object.extend(data, {
                'id': $.String.random(),
                'datetime': getDateTime(),
            });

            list.push(item);
            list = JSON.stringify(list, null, 4);


            fs.writeFile(path, list, 'utf8', function (err) {

                if (err) {
                    res.send({
                        code: 500,
                        msg: err,
                    });
                    return;
                }

                res.send({
                    code: 200,
                    msg: '添加成功',
                    data: item,
                });
            });
        }
        catch (ex) {
            res.send({
                code: 501,
                msg: ex.message,
            });
        }

    },

    /**
    * 更新一条记录。
    */
    update: function (res, data) {
        var id = data.id;
        if (!id) {
            emptyError('id', res);
            return;
        }

        var path = getPath();
        if (!fs.existsSync(path)) {
            res.send({
                code: 201,
                msg: '不存在该记录',
            });
            return;
        }

        fs.readFile(path, 'utf8', function (err, content) {

            if (err) {
                res.send({
                    code: 500,
                    msg: err,
                });
                return;
            }

            try {
                var list = JSON.parse(content);
                var index = $.Array.findIndex(list, function (item, index) {
                    return item.id == id;
                });

                if (index < 0) {
                    res.send({
                        code: 201,
                        msg: '不存在该记录',
                    });
                    return;
                }


                var datetime = getDateTime();
                data['datetime'] = datetime;

                list[index] = data;
                list = JSON.stringify(list, null, 4);

                fs.writeFile(path, list, 'utf8', function (err) {

                    if (err) {
                        res.send({
                            code: 501,
                            msg: err,
                        });
                        return;
                    }

                    res.send({
                        code: 200,
                        msg: '更新成功',
                    });
                });

            }
            catch (ex) {
                res.send({
                    code: 502,
                    msg: ex.message,
                });
            }
        });
    },

    /**
    * 删除一条记录。
    */
    remove: function (res, id) {

        if (!id) {
            emptyError('id', res);
            return;
        }


        var path = getPath();

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
                    code: 500,
                    msg: err,
                });
                return;
            }

            try {
                var list = JSON.parse(data);
                var index = $.Array.findIndex(list, function (item, index) {
                    return item.id == id;
                });

                if (index < 0) {
                    res.send({
                        code: 201,
                        msg: '不存在该记录',
                    });
                    return;
                }

                list.splice(index, 1);
                var json = JSON.stringify(list, null, 4);

                fs.writeFile(path, json, 'utf8', function (err) {

                    if (err) {
                        res.send({
                            code: 501,
                            msg: err,
                        });
                        return;
                    }

                    res.send({
                        code: 200,
                        msg: '删除成功',
                        data: list,
                    });
                });
                
            }
            catch (ex) {
                res.send({
                    code: 502,
                    msg: ex.message,
                });
            }
        });
    },




    /**
    * 读取列表。
    */
    list: function (res) {
   
        var path = getPath();

        if (!fs.existsSync(path)) {
            res.send({
                code: 200,
                msg: '',
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
                    msg: '',
                    data: list,
                });
            }
            catch (ex) {
                res.send({
                    code: 500,
                    msg: ex.message,
                });
            }

        });

    }


};

