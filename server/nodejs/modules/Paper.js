

var fs = require('fs');
var $ = require('../lib/MiniQuery');
var Directory = require('../lib/Directory');


//预创建目录
Directory.create('./data/house/');
Directory.create('./data/news/');
Directory.create('./data/policy/');



function getPath(type, id) {

    if (id) {
        return $.String.format('./data/{0}/{1}.json', type, id);
    }

    return './data/' + type + '-list.json';
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
    * 获取
    */
    get: function (type, id, res) {

        if (!type) {
            emptyError('type', res);
            return;
        }

        if (!id) {
            emptyError('id', res);
            return;
        }


        var path = getPath(type, id);
        if (!fs.existsSync(path)) {
            res.send({
                code: 201,
                msg: '不存在该记录',
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
                var json = JSON.parse(data);
                res.send({
                    code: 200,
                    msg: 'ok',
                    data: json,
                });
            }
            catch (ex) {
                res.send({
                    code: 201,
                    msg: ex.message,
                });
            }
        });
    },


    /**
    * 添加
    */
    add: function (data, res) {


        var type = data.type;
        if (!type) {
            emptyError('type', res);
            return;
        }
        

        var id = $.String.random();
        var path = getPath(type, id);
        var datetime = getDateTime();

        var title = data.title;
        var content = data.content;

        var json = JSON.stringify({
            'type': type,
            'title': title,
            'content': content,
            'datetime': datetime,
        }, null, 4);



        fs.writeFile(path, json, 'utf8', function (err) {

            if (err) {
                res.send({
                    code: 201,
                    msg: err,
                });
                return;
            }

            var list;
            var path = getPath(type);

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
                'datetime': datetime,
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

                res.send({
                    code: 200,
                    msg: 'ok',
                    data: {
                        'type': type,
                        'id': id,
                        'datetime': datetime,
                    },
                });
            });
            
        });

    },



    /**
    * 更新
    */
    update: function (data, res) {

        var type = data.type;
        if (!type) {
            emptyError('type', res);
            return;
        }

        var id = data.id;
        if (!id) {
            emptyError('id', res);
            return;
        }


        var title = data.title;
        var content = data.content;
        var path = getPath(type, id);
        var datetime = getDateTime();


        var json = JSON.stringify({
            'type': type,
            'title': title,
            'content': content,
            'datetime': datetime,
        }, null, 4);


        //写入到详情
        fs.writeFile(path, json, 'utf8', function (err) {

            if (err) {
                res.send({
                    code: 201,
                    msg: err,
                });
                return;
            }

            //写入到列表
            var data = {
                'id': id,
                'title': title,
                'datetime': datetime,
            };

            var list;
            var path = getPath(type);

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
                    msg: '更新成功',
                    data: {
                        'type': type,
                        'id': id,
                    },
                });
            });


        });

    },


    /**
    * 删除
    */
    remove: function (type, id, res) {

        if (!type) {
            emptyError('type', res);
            return;
        }

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


        var path = getPath(type);

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

            var path = getPath(type, id);
            if (!fs.existsSync(path)) {
                success();
                return;
            }

            //详情文件，不管是否成功返回成功
            fs.unlink(path, function (err) {
                 success(); 
            });
        });
     

    },

    /**
    * 读取列表
    */
    list: function (type, res) {
   
        if (!type) {
            emptyError('type', res);
            return;
        }


        var path = getPath(type);

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

