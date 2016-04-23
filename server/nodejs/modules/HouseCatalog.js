

var fs = require('fs');
var $ = require('../lib/MiniQuery');
var Directory = require('../lib/Directory');


function getPath() {
    return './data/house-catalog-list.json';
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
    * 读取列表。
    */
    list: function (res) {

        var path = getPath();

        if (!fs.existsSync(path)) {
            res.send({
                code: 201,
                msg: '数据文件不存在。',
            });
            return;
        }

        var House2 = require('./House2');
        var houses = House2.list();

        if (!houses) {
            res.send({
                code: 201,
                msg: err,
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

                res.send({
                    code: 200,
                    msg: 'ok',
                    data: {
                        'list': list,
                        'houses': houses,
                    },
                });
            }
            catch (ex) {
                res.send({
                    code: 201,
                    msg: ex.message,
                });
            }

        });

    }


};

