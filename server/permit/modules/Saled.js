
/**
* 已售记录。
*/

var $ = require('../lib/MiniQuery');
var DataBase = require('../lib/DataBase');

var db = new DataBase('Saled', [
    { name: 'datetime', },
 
    { name: 'licenseId', required: true, refer: 'SaleLicense', },
    { name: 'date', type: 'number', },
    { name: 'dateDesc', },

    { name: 'residenceSize', type: 'number', },
    { name: 'residenceSizeDesc', },
    { name: 'commerceSize', type: 'number', },
    { name: 'commerceSizeDesc', },
    { name: 'officeSize', type: 'number', },
    { name: 'officeSizeDesc', },
    { name: 'otherSize', type: 'number', },
    { name: 'otherSizeDesc', },
    { name: 'parkSize', type: 'number', },
    { name: 'parkSizeDesc', },
    { name: 'otherSize1', type: 'number', },
    { name: 'otherSize1Desc', },
    { name: 'residenceCell', type: 'number', },
    { name: 'residenceCellDesc', },
    { name: 'commerceCell', type: 'number', },
    { name: 'commerceCellDesc', },
    { name: 'officeCell', type: 'number', },
    { name: 'officeCellDesc', },
    { name: 'otherCell', type: 'number', },
    { name: 'otherCellDesc', },
]);


module.exports = {
    /**
    * 仅供其它内部模块调用。
    */
    db: db,

    /**
    * 获取一条指定 id 的记录。
    */
    get: function (req, res) {
        var id = req.query.id;
        if (!id) {
            res.empty('id');
            return;
        }

        try {
            var item = db.get(id, true);
            if (item) {
                res.success({
                    'license': item.refer.licenseId.item,
                    'saled': item.item,
                });
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
        var item = req.body.data;

        try {
            item = db.add(item);
            res.success(item);
        }
        catch (ex) {
            res.error(ex);
        }
    },

    /**
    * 更新一条指定 id 的记录。
    */
    update: function (req, res) {
        var item = req.body.data;
        var id = item.id;

        if (!id) {
            res.empty('id');
            return;
        }

        try {
            var data = db.update(item);
            if (data) {
                res.success(data);
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
    * 删除一条指定 id 的记录。
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
    * 读取指定 licenseId 的列表。
    */
    list: function (req, res) {
        var licenseId = req.query.licenseId;
        if (!licenseId) {
            res.empty('licenseId');
            return;
        }

        try {
            var list = db.refer('licenseId', licenseId);
            res.success(list);
        }
        catch (ex) {
            res.error(ex);
        }
    },

    /**
    * 批量导入。
    */
    'import': function (req, res) {

        //许可证
        var licenses = require('./SaleLicense').db.list();
        var number$license = DataBase.map(licenses, 'number');  //以证号作为主键关联整条许可证。
        var id$license = DataBase.map(licenses, 'id');          //以 id 作为主键关联整条许可证。

        var number$saleds = {};     //以证号作为主键关联一组已售记录。
        var list = db.list();       //全部已售记录列表。

        list.forEach(function (item) {
            var license = id$license[item.licenseId];
            var number = license.number;
            var saleds = number$saleds[number] = number$saleds[number] || [];
            saleds.push(item);
        });

        //记录无法关联的预售许可证或现售备案。
        var fail = {
            'nones': [],
            'duplicates': [],
            'dates': [],
        };

        var adds = [];
        var updates = [];
        var items = req.body.data;  //提交的数据

        items.forEach(function (item) {

            var date = item.date;
            var reg = /^\d{4}-\d{2}-\d{2}$/;
            if (!date || !reg.test(date)) { //必须为 'yyyy-MM-dd' 的格式
                fail.dates.push(item);
                return;
            }

            item.date = Number(date.split('-').join(''));   //转成 yyyyMMdd 的数字格式。

            var number = item.number;
            var licence = number$license[number];   //根据证号找到整条许可证。

            //不存在该证号的许可证。
            if (!licence) {
                fail.nones.push(item);
                return;
            }

            //建立起关联
            item.licenseId = licence.id;

            var saleds = number$saleds[number] || [];

            var oldItem = saleds.find(function (oldItem) {
                return item.date == oldItem.date;
            });

            //已存在相同录入日期的记录，则合并覆盖。
            if (oldItem) {
                item = $.Object.extend({}, oldItem, item);
                item.id = oldItem.id; // id 用回旧的。
                updates.push(item);
                return;
            }

            //可能会被添加的。 要先判断是否重复添加。

            oldItem = adds.find(function (oldItem) {
                return item.number == oldItem.number &&
                    item.date == oldItem.date;
            });

            //要添加的列表里已存在该项，说明导入列表里有相同的项。
            if (oldItem) {
                fail.duplicates.push(item);
                return;
            }

            adds.push(item);

        });


        if (adds.length > 0) {
            adds = db.add(adds);
        }

        if (updates.length > 0) {
            updates = db.update(updates);
        }


        res.send({
            code: 0,
            msg: '',
            data: {
                'nones': fail.nones,
                'duplicates': fail.duplicates,
                'adds': adds,
                'updates': updates,
            },
        });

    },

    /**
    * 按预售许可证(或现售备案)合并一组已售流水(累积)记录，
    * 找出组内日期最大的已售记录作为当前记录。
    */
    currents: function (refered, fn) {

        var list = db.list(refered, fn);
        var items = list;

        if (refered) {
            items = list.map(function (item) {
                return item.item;
            });
        }
       
        var licenseId$current = DataBase.group(items, 'licenseId', function (licenseId, group) {

            group.sort(function (a, b) {
                return a.date > b.date ? -1 : 1;   //按日期值倒序。
            });

            return group[0];  //日期最大值的一条记录
        });


        list = list.filter(function (item) {
            if (refered) {
                item = item.item;
            }

            var current = licenseId$current[item.licenseId];
            return current.id == item.id;
        });

        return list;

    },

    /**
    * 按预售许可证(或现售备案)合并一组已售流水(累积)记录，
    * 找出组内指定日期区间的已售记录作为当前记录。
    */
    byDates: function (dates, refered, fn) {

        //全部已售记录
        var list = db.list(refered, fn);
        var items = list;

        if (refered) {
            items = list.map(function (item) {
                return item.item;
            });
        }

        //按许可证把一组已售记录合并成一条。
        var licenseId$saled = DataBase.group(items, 'licenseId', function (licenseId, group) {

            //按日期值升序。
            group.sort(function (a, b) {
                return a.date > b.date ? 1 : -1;
            });

            var beginItem = null;
            var endItem = null;

            //没有指定开始时间的，即只指定了结束时间
            if (!dates.begin) {
                endItem = group.reverse().find(function (item) {   //倒序搜索
                    return item.date <= dates.end;
                });
                return endItem || null;
            }

            //指定了开始时间的
            beginItem = group.find(function (item) {
                return item.date >= dates.begin;
            });

            if (!beginItem) {
                return null;
            }

            if (dates.end) {
                endItem = group.reverse().find(function (item) { //倒序搜索
                    return item.date <= dates.end;
                });

                if (!endItem) {
                    return null;
                }
            }
            else {
                endItem = group.slice(-1)[0];
            }

            if (beginItem === endItem) {
                return endItem;
            }


            var item = {};
            var isValid = false;

            $.Object.each(endItem, function (key, value) {
                if (typeof value != 'number') {
                    item[key] = value;
                    return;
                }

                value = value - beginItem[key]; //相减。

                //只要有一个不为 0，则为合法记录，用于向上搜索其它角色的记录。
                if (value != 0) {
                    isValid = true;
                }

                item[key] = value;
            });

            return isValid ? item : null;
        });


        list = list.filter(function (item) {
            if (refered) {
                item = item.item;
            }

            var saled = licenseId$saled[item.licenseId];
            return saled && saled.id == item.id;
        });

        return list;

    },
};

