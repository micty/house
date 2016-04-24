

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
        msg: '字段 ' + name + ' 不能为空。',
    });
}


module.exports = {


    /**
    * 更新
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
                code: 500,
                msg: '数据文件不存在。',
            });
            return;
        }


        try {
            var list = fs.readFileSync(path);
            list = JSON.parse(list);

            var item = $.Array.findItem(list, function (item, index) {
                return item.id == id;
            });

            if (!item) {
                res.send({
                    code: 404,
                    msg: '不存在该 id 的记录。',
                });
                return;
            }

            $.Object.extend(item, {
                'name': data.name,
                'price': data.price,
                'address': data.address,
                'type': data.type,
                'cover': data.cover,
                'phone': data.phone,
            });

            var json = JSON.stringify(list, null, 4);

            fs.writeFile(path, json, 'utf8', function (err) {

                if (err) {
                    res.send({
                        code: 201,
                        msg: err,
                    });
                    return;
                }

                res.send({
                    code: 200,
                    msg: '更新成功',
                    data: list,
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
    * 读取列表。
    */
    list: function (res) {

        var path = getPath();
        var existed = fs.existsSync(path);

        //重载 list()，供内部其它模块调用。
        if (!res) {
            if (!existed) {
                return;
            }

            var data = fs.readFileSync(path, 'utf8');
            var list = JSON.parse(data);
            return list;
        }



        //重载 list(rest)，供 http 请求调用。
        if (!existed) {
            res.send({
                code: 201,
                msg: '数据文件不存在。',
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
                    data: list,
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

