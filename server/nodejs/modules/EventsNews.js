﻿

var fs = require('fs');
var $ = require('../lib/MiniQuery');






function getPath() {


    return './data/events-news-list.json';
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
    add: function (data, res) {


        var title = data.title;
        if (!title) {
            emptyError('title', res);
            return;
        }

        var url = data.url;
        if (!url) {
            emptyError('url', res);
            return;
        }
        

        var id = $.String.random();


        var list;
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
            'url': url,
            'priority': data.priority || 0, //优先级
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

    },



    /**
    * 更新
    */
    update: function (data, res) {


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


        var url = data.url;
        if (!url) {
            emptyError('url', res);
            return;
        }

        var priority = Number(data.priority) || 0;



        //写入到列表
        var data = {
            'id': id,
            'title': title,
            'url': url,
            'priority': priority, //优先级

        };

        var list;
        var path = getPath();

        if (fs.existsSync(path)) {
            list = fs.readFileSync(path);
            list = JSON.parse(list);
        }
        else {
            list = [data];
        }

        var item = $.Array.findItem(list, function (item, index) {
            return item.id == id;
        });

        if (item) {
            $.Object.extend(item, data);
        }


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

    },


    /**
    * 删除
    */
    remove: function (id, res) {


        if (!id) {
            emptyError('id', res);
            return;
        }


        function success(data) {
            res.send({
                code: 200,
                msg: '删除成功',
                data: data || {},
            });
        }


        var path = getPath();

        if (!fs.existsSync(path)) {
            success();
            return;
        }


        var list = fs.readFileSync(path);
        list = JSON.parse(list);

        list = $.Array.grep(list, function (item, index) {
            return item.id != id;
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

            success(list);

          
        });
     

    },

    /**
    * 读取列表
    */
    list: function (res) {

        var path = getPath();

        if (!fs.existsSync(path)) {
            res.send({
                code: 200,
                msg: '',
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
                list.sort(function (a, b) {
                    a = a.priority || 0;
                    b = b.priority || 0;
                    return a - b;
                });
                res.send({
                    code: 200,
                    msg: '',
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

