﻿

var fs = require('fs');
var $ = require('../lib/MiniQuery');
var Directory = require('../lib/Directory');


function getPath() {
    return './data/sale-list.json';
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
                        'sale': item,
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
        if (!licenseId || licenseId === 'undefined') {
            emptyError('licenseId', res);
            return;
        }


        var path = getPath();
        var list = [];

        try {

            if (fs.existsSync(path)) {
                list = fs.readFileSync(path);
                list = JSON.parse(list);
            }

            var item = list.find(function (item) {
                return item.licenseId == licenseId;
            });

            if (item) {
                res.send({
                    code: 201,
                    msg: '已存在 licenseId 为' + licenseId + ' 的记录。',
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

                    var SaleLicense = require('./SaleLicense');
                    SaleLicense.removeBy(id);

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

    },


    /**
    * 获取待办和已办列表。
    */
    all: function (res) {

        try {
            var Land = require('./Land');
            var Plan = require('./Plan');
            var PlanLicense = require('./PlanLicense');
            var SaleLicense = require('./SaleLicense');

            var lands = Land.list();
            var plans = Plan.list();
            var licenses = PlanLicense.list();
            var saleLicenses = SaleLicense.list();
            var list = module.exports.list();

            //统计 sale 所拥有的 sale license 个数。
            var id$count = {};
            saleLicenses.forEach(function (item) {
                var id = item.saleId;

                var count = id$count[id] || 0;
                count++;
                id$count[id] = count;
            });



            res.send({
                code: 200,
                msg: '',
                data: {
                    'lands': lands,
                    'plans': plans,
                    'licenses': licenses,
                    'list': list,
                    'id$count': id$count,
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

