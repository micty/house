
var $ = require('../../lib/MiniQuery');



module.exports = {

    //按区域进行分类，再按功能进行求和。
    stat: function (list, keys) {
        var Towns = require('./Towns');
        var Uses = require('./Uses');

        keys = keys || Uses;


        //初始化
        var stat = {};

        Towns.forEach(function (town) {
            var group = stat[town] = {};

            keys.forEach(function (key) {
                group[key] = 0;
            });
        });

        list.forEach(function (item) {
            var group = stat[item.town];
            var key$value = item.item;

            keys.forEach(function (key) {
                group[key] += key$value[key];
            });
        });

        return stat;
    },
};