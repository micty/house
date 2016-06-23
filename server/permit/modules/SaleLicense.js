

var fs = require('fs');
var $ = require('../lib/MiniQuery');
var Directory = require('../lib/Directory');


function getPath() {
    return './data/sale-license-list.json';
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
    * 添加一条或多条记录。
    */
    add: function (res, data) {

        //重载 add(items)，批量添加。
        if (res instanceof Array) {
            var items = res;    //需要添加的数据列表
            if (items.length == 0) {
                return;
            }


            var list = [];
            var path = getPath();

            if (fs.existsSync(path)) {
                list = fs.readFileSync(path);
                list = JSON.parse(list);
            }

            //用类型与证号作主键
            var type$number$item = {
                0: {},
                1: {},
            };

            list.forEach(function (item) {
                type$number$item[item.type][item.number] = item;
            });

            var adds= [];
            var edits = [];

            items.forEach(function (item) {
                var oldItem = type$number$item[item.type][item.number];

                //已存在相同类型与证号的记录，则合并覆盖。
                if (oldItem) {
                    $.Object.extend(oldItem, item);
                    edits.push(item);
                    return;
                }

                //新记录。


                //先增加空的备注字段。
                Object.keys(item).forEach(function (key) {
                    key = key + 'Desc';
                    item[key] = '';         
                });

                //后增加其它字段。
                $.Object.extend(item, {
                    'id': $.String.random(),
                    'datetime': getDateTime(),
                });

                list.push(item);
                adds.push(items);
            });


            var json = JSON.stringify(list, null, 4);
            fs.writeFile(path, json, 'utf8');

            return {
                'adds': adds,
                'edits': edits,
            };
        }

        //重载 add(res, data)，单条添加。
        var saleId = data.saleId;
        if (!saleId) {
            emptyError('saleId', res);
            return;
        }

        var number = data.number;
        if (!number) {
            emptyError('number', res);
            return;
        }

        var Sale = require('./Sale');
        var sales = Sale.list();
        var sale = sales.find(function (item) {
            return item.id == saleId;
        });
        
        if (!sale) {
            res.send({
                code: 404,
                msg: '不存在 saleId 为 ' + saleId + ' 的建设记录。',
            });
            return;
        }


        var path = getPath();
        var list = [];

        try {

            if (fs.existsSync(path)) {
                list = fs.readFileSync(path);
                list = JSON.parse(list);
            }

            //确保证号唯一
            var item = list.find(function (item) {
                return item.number == number;
            });

            if (item) {
                res.send({
                    code: 301,
                    msg: '已存在该证号的记录',
                    data: item,
                });
                return;
            }


            item = $.Object.extend(data, {
                'id': $.String.random(),
                'datetime': getDateTime(),
            });

            list.push(item);

            var json = JSON.stringify(list, null, 4);

            fs.writeFile(path, json, 'utf8', function (err) {

                if (err) {
                    res.send({
                        code: 500,
                        msg: err,
                    });
                    return;
                }

                list = list.filter(function (item) {
                    return item.saleId == saleId;
                });

                res.send({
                    code: 200,
                    msg: '添加成功',
                    data: list,
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


                var datetime = getDateTime();
                data['datetime'] = datetime;

                $.Object.extend(item, data);

                var json = JSON.stringify(list, null, 4);

                fs.writeFile(path, json, 'utf8', function (err) {

                    if (err) {
                        res.send({
                            code: 501,
                            msg: err,
                        });
                        return;
                    }

                    var saleId = data.saleId;

                    list = list.filter(function (item) {
                        return item.saleId == saleId;
                    });

                    res.send({
                        code: 200,
                        msg: '更新成功',
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

                var item = list[index];
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

                    var saleId = item.saleId;

                    list = list.filter(function (item) {
                        return item.saleId == saleId;
                    });

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
    * 按条件删除指定的记录。
    */
    removeBy: function (fn) {

        var path = getPath();
        var existed = fs.existsSync(path);
        if (!existed) {
            return;
        }

        try {
            var data = fs.readFileSync(path, 'utf8');
            var list = JSON.parse(data);

            //过滤出指定 saleId 的记录。
            if (fn) {
                var isFn = typeof fn == 'function';

                list = list.filter(function (item, index) {
                    if (isFn) {
                        var removed = fn(item, index);
                        return !removed;
                    }

                    //此时的 fn 当作 saleId。
                    return item.saleId != fn;
                    
                });
            }

            var json = JSON.stringify(list, null, 4);
            fs.writeFileSync(path, json, 'utf8');
        }
        catch (ex) {
            return ex;
        }

    },



    /**
    * 读取列表。
    */
    list: function (res, saleId) {
   
        var path = getPath();
        var existed = fs.existsSync(path);

        //重载 list()，供内部其它模块调用。
        if (!res) {
            if (!existed) {
                return [];
            }

            var data = fs.readFileSync(path, 'utf8');
            var list = JSON.parse(data);

            //过滤出指定 saleId 的记录。
            if (saleId) {
                list = list.filter(function (item) {
                    return item.saleId == saleId;
                });
            }
            

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

                //过滤出指定 saleId 的记录。
                if (saleId) {
                    list = list.filter(function (item) {
                        return item.saleId == saleId;
                    });
                }

                list.reverse(); //倒序一下

                res.send({
                    code: 200,
                    msg: 'ok',
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

