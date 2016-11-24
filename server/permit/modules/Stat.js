
var $ = require('../lib/MiniQuery');
var Cache = require('./Stat/Cache');



module.exports = {

    /**
    * 统计一览表。
    */
    all: function (req, res) {
        var data = req.body.data;
        var cache = Cache.get('all', data);
        if (cache) {
            res.success(cache);
            return;
        }


        var ByAll = require('./Stat/ByAll');
        var stat = ByAll.stat(data);

        Cache.set('all', data, stat);
        res.success(stat);

    },

    /**
    * 按区域(镇街)进行统计。
    */
    town: function (req, res) {
        var data = req.body.data;
        var town = data.town;
        if (!town) {
            res.empty('town');
            return;
        }

        var cache = Cache.get('town', data);
        if (cache) {
            res.success(cache);
            return;
        }

        var ByTown = require('./Stat/ByTown');
        var stat = ByTown.stat(data);

        Cache.set('town', data, stat);
        res.success(stat);
    },

    /**
    * 按板块(角色)进行统计。
    */
    role: function (req, res) {
        var data = req.body.data;
        var role = data.role;
        if (!role) {
            res.empty('role');
            return;
        }

        var cache = Cache.get('role', data);
        if (cache) {
            res.success(cache);
            return;
        }

        var ByRole = require('./Stat/ByRole');
        var stat = ByRole.stat(data);

        Cache.set('role', data, stat);
        res.success(stat);
    },

    /**
    * 按功能(用途)进行统计。
    */
    use: function (req, res) {
        var data = req.body.data;
        var use = data.use;
        if (!use) {
            res.empty('use');
            return;
        }

        var cache = Cache.get('use', data);
        if (cache) {
            res.success(cache);
            return;
        }

        var ByUse = require('./Stat/ByUse');
        var stat = ByUse.stat(data);

        Cache.set('use', data, stat);
        res.success(stat);
    },

    /**
    * 按自建房进行统计。
    */
    diy: function (req, res) {
        var data = req.body.data;

        var cache = Cache.get('diy', data);
        if (cache) {
            res.success(cache);
            return;
        }

        var ByDiy = require('./Stat/ByDiy');
        var stat = ByDiy.stat(data);

        Cache.set('diy', data, stat);
        res.success(stat);
    },

    /**
    * 按自建房进行统计。
    */
    sale: function (req, res) {
        var data = req.body.data;

        var cache = Cache.get('sale', data);
        if (cache) {
            res.success(cache);
            return;
        }

        var BySale = require('./Stat/BySale');
        var stat = BySale.stat(data);

        Cache.set('sale', data, stat);
        res.success(stat);
    },

    
};

