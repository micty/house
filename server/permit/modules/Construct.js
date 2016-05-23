

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
    get: function (res, id) {
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


                var PlanLicense = require('./PlanLicense');
                var licenses = PlanLicense.list();
                var license = $.Array.findItem(licenses, function (license) {
                    return license.id == item.licenseId;
                });

                if (!license) {
                    res.send({
                        code: 202,
                        msg: '不存在关联的规划许可证记录',
                    });
                    return;
                }

                var Plan = require('./Plan');
                var plans = Plan.list();
                var plan = $.Array.findItem(plans, function (plan) {
                    return plan.id == license.planId;
                });
                if (!plan) {
                    res.send({
                        code: 203,
                        msg: '不存在关联的规划记录',
                    });
                    return;
                }

                var Land = require('./Land');
                var lands = Land.list();
                var land = $.Array.findItem(lands, function (land) {
                    return land.id == plan.landId;
                });
                if (!land) {
                    res.send({
                        code: 204,
                        msg: '不存在关联的土地记录',
                    });
                    return;
                }



                res.send({
                    code: 200,
                    msg: 'ok',
                    data: {
                        'land': land,
                        'plan': plan,
                        'license': license,
                        'construct': item,
                    },
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

        var licenseId = data.licenseId;
        if (!licenseId) {
            emptyError('licenseId', res);
            return;
        }

        var PlanLicense = require('./PlanLicense');
        var licenses = PlanLicense.list();
        var license = licenses.find(function (item) {
            return item.id == licenseId;
        });

        if (!license) {
            res.send({
                code: 404,
                msg: '不存在 licenseId 为 ' + licenseId + ' 的规划许可证记录。',
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


            var item = $.Object.extend(data, {
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

                    var licenseId = data.licenseId;

                    list = list.filter(function (item) {
                        return item.licenseId == licenseId;
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

                    var licenseId = item.licenseId;

                    list = list.filter(function (item) {
                        return item.licenseId == licenseId;
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

            //过滤出指定 licenseId 的记录。
            if (fn) {
                var isFn = typeof fn == 'function';

                list = list.filter(function (item, index) {
                    if (isFn) {
                        var removed = fn(item, index);
                        return !removed;
                    }

                    //此时的 fn 当作 licenseId。
                    return item.licenseId != fn;

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
    list: function (res) {

        var path = getPath();
        var existed = fs.existsSync(path);

        //重载 list()，供内部其它模块调用。
        if (!res) {
            if (!existed) {
                return [];
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
                    code: 500,
                    msg: ex.message,
                });
            }

        });

    },



    /**
   * 获取待办和已办列表。
   */
    all: function (res) {

        try {
            var Land = require('./Land');
            var Plan = require('./Plan');
            var PlanLicense = require('./PlanLicense');

            var lands = Land.list();
            var plans = Plan.list();
            var licenses = PlanLicense.list();
            var list = module.exports.list();


            res.send({
                code: 200,
                msg: '',
                data: {
                    'lands': lands,
                    'plans': plans,
                    'licenses': licenses,
                    'list': list,
                },
            });

        }
        catch (ex) {
            res.send({
                code: 500,
                msg: ex.message,
            });
        }

    },


};

