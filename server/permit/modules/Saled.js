
/**
* 已售记录。
*/

var $ = require('../lib/MiniQuery');
var DataBase = require('../lib/DataBase');

var db = new DataBase('Saled', [
    { name: 'datetime', },
 
    { name: 'licenseId', required: true, refer: 'SaleLicense', },
    { name: 'date', type: 'number', },

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

    current: function (req, res) {

        //重载 current(licenseId); 获取指定证号的当前值。
        if (typeof req == 'string') {
            var licenseId = req;

            return;
        }


    },

    /**
    * 批量导入。
    */
    'import': function (req, res) {
    

        //许可证
        var licenses = require('./SaleLicense').list();
        var number$license = DataBase.map(licenses, 'number');  //证号作主键关联整条许可证。
        var id$license = DataBase.map(licenses, 'id');          //

        var number$saleds = {};     //以证号作为主键关联一组已售记录。
        var list = db.list();       //全部已售记录列表。

        list.forEach(function (item) {
            var license = id$license[item.licenseId];
            var number = license.number;
            var saleds = number$saleds[number];

            if (!saleds) {
                saleds = number$saleds[number] || [];
            }

            saleds.push(item);
        });

        //对证号分组内的已售记录按录入日期进行排序。
        Object.keys(number$saleds).forEach(function (number) {
            var saleds = number$saleds[number];
            saleds.sort(function (a, b) {
                return a.date - b.date > 0 ? -1 : 1; //按日期值倒序
            });
        });




        //记录无法关联的预售许可证或现售备案。
        var fail = {
            'licenses': [],
        };

        var items = req.body.data;

        items.forEach(function (item) {
            var licence = number$license[item.number];
            if (!licence) {
                fail.licenses.push(item);
                return;
            }



        });


    },
};

