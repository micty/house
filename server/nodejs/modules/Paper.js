

var fs = require('fs');
var $ = require('../lib/MiniQuery');


module.exports = {


    add: function (req, res) {

        var data = req.body;

        var type = data.type;
        if (!type) {

            res.send({
                code: 201,
                msg: '字段 type 不能为空',
            });
            return;
        }




        var title = data.title;
        var content = data.content;

        var id = $.String.random();
        var path = $.String.format('./data/{0}/{1}.json', type, id);

        var datetime = $.Date.format(new Date(), 'yyyy-MM-dd HH:mm:ss');

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

            var path = './data/' + type + '-list.json';

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
                    },
                });
            });

            
        });

    },


};

