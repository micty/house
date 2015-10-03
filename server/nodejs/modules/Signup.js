﻿

var fs = require('fs');
var $ = require('../lib/MiniQuery');
var Directory = require('../lib/Directory');


//预创建目录
Directory.create('./data/signup/');




function getPath() {
    return './data/signup-list.json';
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
    * 添加
    */
    add: function (data, res) {

        var path = getPath();
        var list = [];

        if (fs.existsSync(path)) {
            list = fs.readFileSync(path);
            list = JSON.parse(list);
        }

        var item = {
            'id': $.String.random(),
            'name': data.name,
            'phone': data.phone,
            'intent': data.intent,
            'datetime': getDateTime(),
        };

        list.push(item);
        list = JSON.stringify(list, null, 4);


        fs.writeFile(path, list, 'utf8', function (err) {

            if (err) {
                res.send({
                    code: 201,
                    msg: err,
                });
                return;
            }

            res.send({
                code: 200,
                msg: '添加成功',
                data: item,
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


        function success() {
            res.send({
                code: 200,
                msg: '删除成功',
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

        list = JSON.stringify(list, null, 4);

        fs.writeFile(path, list, 'utf8', function (err) {

            if (err) {
                res.send({
                    code: 201,
                    msg: err,
                });
                return;
            }

            success();
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
                list.reverse(); //倒序一下

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

