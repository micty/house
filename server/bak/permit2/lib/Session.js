


var $ = require('./MiniQuery');
var id$data = {};
var id$time = {};

//定时检查会话超时。
var timeout = 10 * 60 * 1000;   //10min
setInterval(function () {

    for (var id in id$time) {
        var time = id$time[id];
        var now = Date.now();

        if (now - time >= timeout) {
            delete id$time[id];
            delete id$data[id];
        }
    }

}, timeout);


module.exports = {

    'get': function (id) {
        return id$data[id];
    },


    'add': function (data) {
        var id = $.String.random();
        id$data[id] = data || {};
        id$time[id] = Date.now();

        return id;
    },

    'check': function (req, res) {
        var id = req.query.token;

        if (!id) {
            res.send({
                code: -1,
                msg: '缺少 token 字段。',
            });
            res.end();
            return;
        }

        var data = id$data[id];
        if (!data) {
            res.send({
                code: -2,
                msg: '不存在该 token 。',
            });
            return;
        }

        //更新活跃时间
        id$time[id] = Date.now();
        return true;
    },
};