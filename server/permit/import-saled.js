
//从预售许可证或现售备案中拆分出已售字段成单独的已售记录，并添加到 Saled 数据库中。
//使用方式：
//  0，从服务器上下载 data 覆盖本地的 data 目录。
//  1，重启 index.js。
//  2，再次从服务器上下载 data 覆盖本地的 data 目录。
//  3，运行本脚本。




start();

function start() {

    var $ = require('./lib/MiniQuery');
    var DataBase = require('./lib/DataBase');
    var File = require('./lib/File');


    var dir = './data/SaleLicense/';
    var field = dir + 'field.json';
    var map = dir + 'map.json';

    var fields = File.readJSON(field);
    var id$values = File.readJSON(map);

    //原有的许可证字段
    var newFields = fields.filter(function (field, index) {
        return !field.name.startsWith('saled-');
    });

    var newId$values = {};

    var list = Object.keys(id$values).map(function (id) {

        var values = id$values[id];
        var newValues = newId$values[id] = [];

        var item = { 'id': id, };

        fields.forEach(function (field, index) {
            var name = field.name;
            var value = values[index];
            item[name] = value;

            //原有的许可证字段
            if (!name.startsWith('saled-')) {
                newValues.push(value);
            }
        });

        return item;
    });


    var total = list.length;
    console.log('找到', total, '条许可证');
    //File.writeJSON(dir + 'LIST-JSON-0.json', list);

    //回写到许可证
    File.writeJSON(field, newFields);
    File.writeJSON(map, newId$values);



    //拆分出已售的字段
    list = list.map(function (item) {
        
        var date = item.datetime.split(' ')[0];
        date = date.split('-').join('');
        date = Number(date);

        if (!date) {
            console.log('date 为空', item);
        }

        var obj = {
            'licenseId': item.id,
            'date': date,
            'dateDesc': '',
        };

        Object.keys(item).forEach(function (key) {
            if (!key.startsWith('saled-')) {
                return;
            }

            var newKey = key.slice('saled-'.length);
            obj[newKey] = item[key];
        });

        return obj;

    });

    //File.writeJSON(dir + 'LIST-JSON-1.json', list);


    //过滤掉值全为 0 的记录。
    list = list.filter(function (item) {

        var isValid = false;

        Object.keys(item).forEach(function (key) {
            if (isValid || key == 'date') { // date 字段是 number
                return;
            }

            //只要有一个不为 0 即为有效的。
            var value = item[key];
            if (typeof value == 'number' && value > 0) {
                isValid = true;
            }
        });

        return isValid;

    });

    //File.writeJSON(dir + 'LIST-JSON-2.json', list);


    var delta = total - list.length;
    if (delta > 0) {
        console.log('过滤掉值全为 0 的已售记录', total - list.length, '条');
    }

    console.log('有效的已售记录', list.length, '条');
    console.log('开始导入...');


    var db = new DataBase('Saled');


    list = db.add(list);

    //File.writeJSON(dir + 'LIST-JSON-3.json', list);

    console.log('成功导入的已售记录', list.length, '条');



}






