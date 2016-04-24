
/**
* 针对移动端首页的，一次性获取全部数据。
*/

var fs = require('fs');
var $ = require('../lib/MiniQuery');




module.exports = {
   
    get: function (res) {


        var Ads = require('./Mobile.Ads');
        var HouseCatalog = require('./HouseCatalog');
        var House = require('./House2');


        try{
            var ads = Ads.list();
            var catalogs = HouseCatalog.list();
            var houses = House.list();

            res.send({
                code: 200,
                msg: 'all ok',
                data: {
                    'ads': ads,
                    'catalogs': catalogs,
                    'houses': houses,
                },
            });
        }
        catch (ex) {
            res.send({
                code: 500,
                msg: ex,
            });
        }
        



        
    },


};

