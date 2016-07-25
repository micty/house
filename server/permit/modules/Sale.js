

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


                var Plan = require('./Plan');
                var plans = Plan.list();
                var plan = $.Array.findItem(plans, function (plan) {
                    return plan.id == item.planId;
                });

                if (!plan) {
                    res.send({
                        code: 202,
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
                        code: 203,
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

        var planId = data.planId;
        if (!planId || planId === 'undefined') {
            emptyError('planId', res);
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
                return item.planId == planId;
            });

            if (item) {
                res.send({
                    code: 201,
                    msg: '已存在 planId 为' + planId + ' 的记录。',
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
    all: function (res, data) {

        try {
            data = data || {};

            var Land = require('./Land');
            var Plan = require('./Plan');
            var SaleLicense = require('./SaleLicense');

            var lands = Land.list();
            var plans = Plan.list();
            var sales = module.exports.list();
            var licenses = SaleLicense.list();

            lands = lands.filter(function (item) {
                return item.diy != '是';
            });

            var keyword = data.keyword;
            if (keyword) {
                lands = lands.filter(function (item) {
                    return item.number.indexOf(keyword) >= 0;
                });
            }

            res.send({
                code: 200,
                msg: '',
                data: {
                    'lands': lands,
                    'plans': plans,
                    'sales': sales,
                    'licenses': licenses,
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

    /**
    * 批量导入。
    */
    import: function (res, data) {

        data = decodeURIComponent(data['data']);
        var groups = JSON.parse(data);

        //记录无法关联的土地记录和规划记录，以及相应的预售许可证和现售备案。
        var none = {
            lands: [],
            plans: [],
            sales: [],      //需要新增的销售记录
            licenses: [],
        };

        var licenses = [];                  //需要导入的预售许可证或现售备案。
        var list = module.exports.list();   //全部销售记录
        var count = list.length;            //用于判断是否由于增加了记录而重新写入。
        var planId$sale = {};               //以 planId 作为主键关联到销售记录。

        list.forEach(function (sale) {
            planId$sale[sale.planId] = sale;
        });


        groups.forEach(function (group) {
           
            var Land = require('./Land');
            var Plan = require('./Plan');

            var lands = Land.list();
            var plans = Plan.list();
            var land = group.land;

            //根据土地证号找到整条土地记录
            var landItem = lands.find(function (item) {
                var a = item.license.split('|');        //这里只需要找到一个土地证号即可

                var index = a.indexOf(land.license);
                return index > -1;
            });

            if (!landItem) {
                none.lands.push(land);
                none.licenses = none.licenses.concat(group.licenses);
                return;
            }

            //根据土地 id 找到整条规划记录
            var plan = plans.find(function (item) {
                return item.landId == landItem.id;
            });

            if (!plan) {
                none.plans.push(land);
                none.licenses = none.licenses.concat(group.licenses);
                return;
            }

            //根据规划 id 找到对应的销售记录。
            var planId = plan.id;
            var sale = planId$sale[planId];
            var saleId = sale ? sale.id : $.String.random();

            //未存在该销售记录，则添加
            if (!sale) {
                sale = {
                    'id': saleId,
                    'planId': planId,
                    'project': group.sale.project,
                    'datetime': getDateTime(),
                };

                //注册一下，防止重复添加。
                planId$sale[planId] = sale;

                list.push(sale);
                none.sales.push(sale);
            }

            group.licenses.forEach(function (item) {
                item.saleId = saleId; //关联到销售记录
            });

            licenses = licenses.concat(group.licenses); //合并到总列表
           
        });

     

        var invalid = none.licenses.length > 0;

        if (licenses.length == 0) {

            var msg = '没有可以导入的销售许可证或现售备案。 ';
            if (invalid) {
                msg += '存在无法关联的土地记录或规划记录。';
            }

            res.send({
                code: invalid ? 301 : 300,
                msg: msg,
                data: none,
            });
            return;
        }


        //销售记录的条数发生了变化，写回 json 文件。
        if (list.length > count) {
            try {
                var path = getPath();
                var json = JSON.stringify(list, null, 4);
                fs.writeFileSync(path, json, 'utf8');
            }
            catch (ex) {
                res.send({
                    code: 501,
                    msg: ex.message,
                });

                return;
            }
        }
       
        //预售许可证或现售备案列表。
        try {
            var SaleLicense = require('./SaleLicense');
            var result = SaleLicense.add(licenses);

            res.send({
                code: invalid ? 201 : 0, //这里全部成功用 0，方便前端处理
                msg: invalid ?
                    '部分导入成功! 存在部分无法关联的土地记录或规划记录。' :
                    '全部导入成功。',

                data: $.Object.extend({}, none, result),
            });
        }
        catch (ex) {
            res.send({
                code: 502,
                msg: ex.message,
            });
        }

      


    },



};

