﻿

var fs = require('fs');
var $ = require('../lib/MiniQuery');



function getPath() {
    return './data/mobile-news-list.json';
}



function emptyError(name, res) {
    res.send({
        code: 201,
        msg: '字段 ' + name + ' 不能为空',
    });
}


module.exports = {
    /**
    * 添加
    */
    add: function (res, data) {

        var title = data.title;
        if (!title) {
            emptyError('title', res);
            return;
        }

        var cover = data.cover;
        if (!cover) {
            emptyError('cover', res);
            return;
        }

        try {
            var list;
            var id = $.String.random();
            var path = getPath();

            if (fs.existsSync(path)) {
                list = fs.readFileSync(path);
                list = JSON.parse(list);
            }
            else {
                list = [];
            }

            list.push({
                'id': id,
                'title': title,
                'cover': cover,
                'desc': data.desc,
                'url': data.url,
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
                    msg: 'ok',
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
    * 更新
    */
    update: function (res, data) {

        var id = data.id;
        if (!id) {
            emptyError('id', res);
            return;
        }

        var title = data.title;
        if (!title) {
            emptyError('title', res);
            return;
        }

        var cover = data.cover;
        if (!cover) {
            emptyError('cover', res);
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
                'cover': cover,
                'title': title,
                'desc': data.desc,
                'url': data.url,
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
    * 删除
    */
    remove: function (res, id) {

        if (!id) {
            emptyError('id', res);
            return;
        }

        var path = getPath();

        if (!fs.existsSync(path)) {
            res.send({
                code: 404,
                //msg: '不存在该 id 的记录。',
                msg: '数据文件不存在。',
            });
            return;
        }


        try {

            var list = fs.readFileSync(path);
            list = JSON.parse(list);

            var index = $.Array.findIndex(list, function (item, index) {
                return item.id == id;
            });

            if (index < 0) {
                res.send({
                    code: 404,
                    msg: '不存在该 id 的记录。',
                });
                return;
            }


            list.splice(index, 1);

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
                    msg: '删除成功',
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
    * 读取列表
    */
    list: function (res) {

        var path = getPath();

        if (!fs.existsSync(path)) {
            res.send({
                code: 200,
                msg: 'not existed',
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
               
                res.send({
                    code: 200,
                    msg: 'ok',
                    data: list,
                });
            }
            catch (ex) {
                res.send({
                    code: 500,
                    msg: ex,
                });
            }

        });

    }


};

