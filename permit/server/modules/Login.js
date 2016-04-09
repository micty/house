

var fs = require('fs');
var $ = require('../lib/MiniQuery');
var Directory = require('../lib/Directory');


function getPath() {
    return './data/user-list.json';
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

    login: function (res, data) {
        var path = getPath();
        if (!fs.existsSync(path)) {
            res.send({
                code: 201,
                msg: '不存在该记录',
            });
            return;
        }


        fs.readFile(path, 'utf8', function (err, list) {

            if (err) {
                res.send({
                    code: 500,
                    msg: err,
                });
                return;
            }

            try {
                list = JSON.parse(list);

                var item = $.Array.findItem(list, function (item, index) {
                    return item.name == data.name &&
                        item.password == data.password;
                });

                if (!item) {
                    res.send({
                        code: 201,
                        msg: '用户名或密码错误',
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


};

