

var fs = require('fs');
var $ = require('../lib/MiniQuery');
var Directory = require('../lib/Directory');


//预创建目录
Directory.create('./data/events-photo/');



function getPath() {
   
    return './data/events-photo-list.json';
}


module.exports = {

   


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

