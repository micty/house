

var fs = require('fs');
var $ = require('../lib/MiniQuery');






function getPath() {

    return './data/recommend-list.json';
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

        var belong = data.belong;
        if (!belong) {
            emptyError('belong', res);
            return;
        }

        var name = data.name;
        if (!name) {
            emptyError('name', res);
            return;
        }

        var src = data.src;
        if (!src) {
            emptyError('src', res);
            return;
        }

        var href = data.href;
        if (!href) {
            emptyError('href', res);
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

        var fields = data.fields;
        if (fields) {
            fields = decodeURIComponent(fields);
            fields = JSON.parse(fields);
        }
        else {
            fields = [];
        }

        var priority = Number(data.priority) || 0;


        list.push({
            'id': id,
            'belong': belong,
            'name': name,
            'src': src,
            'href': href,
            'priority': priority, //优先级
            'fields': fields,
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

        var belong = data.belong;
        if (!belong) {
            emptyError('belong', res);
            return;
        }

        var name = data.name;
        if (!name) {
            emptyError('name', res);
            return;
        }

        var src = data.src;
        if (!src) {
            emptyError('src', res);
            return;
        }

        var href = data.href;
        if (!href) {
            emptyError('href', res);
            return;
        }


        var priority = Number(data.priority) || 0;

        var fields = data.fields;
        if (fields) {
            fields = decodeURIComponent(fields);
            fields = JSON.parse(fields);
        }
        else {
            fields = [];
        }

        var priority = Number(data.priority) || 0;

        //写入到列表
        var data = {
            'id': id,
            'belong': belong,
            'name': name,
            'src': src,
            'href': href,
            'priority': priority, //优先级
            'fields': fields,

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

