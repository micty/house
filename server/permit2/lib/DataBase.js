

var $ = require('./MiniQuery');
var File = require('./File');
var Directory = require('./Directory');
var fs = require('fs');

function now() {
    return $.Date.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
}


function DataBase(name, fields) {

    var dir = process.cwd() + '/data/' + name + '/';
    dir = dir.split('\\').join('/');

    var list = dir + 'list.json';
    var map = dir + 'map.json';
    var field = dir + 'field.json';


    if (!File.exists(list)) {
        File.writeJSON(list, []);
    }

    if (!File.exists(map)) {
        File.writeJSON(map, {});
    }

    if (!File.exists(field)) {
        File.writeJSON(field, fields);
    }
    else {
        fields = File.readJSON(field);
    }

    var meta = this.meta = {
        'list': list,
        'map': map,
        'fields': fields,
        'unique': {},
    };


    //记录需要一对一的字段
    fields.forEach(function (field) {
        var name = field.name;

        if (field.unique) {
            var file = meta.unique[name] = dir + name + '$id.json';

            if (!File.exists(file)) {
                File.writeJSON(file, {});
            }
        }
    });


   
}





DataBase.prototype = {
    constructor: DataBase,

    
    /**
    * 获取一条指定 id 的记录。
    */
    get: function (id) {

        var meta = this.meta;
        var map = File.readJSON(meta.map);
        var values = map[id];

        if (!values) {
            return;
        }

        var item = { 'id': id };
        var fields = meta.fields;

        fields.forEach(function (field, index) {
            item[field.name] = values[index];
        });

        return item;
    },

    /**
    * 获取全部记录。
    */
    list: function () {
        var meta = this.meta;
        var fields = meta.fields;

        var map = File.readJSON(meta.map);
        var list = File.readJSON(meta.list);
       


        return list.map(function (id) {
            var values = map[id];
            var item = { 'id': id };

            fields.forEach(function (field, index) {
                item[field.name] = values[index];
            });

            return item;

        });

    },


    /**
    * 移除一条指定 id 的记录。
    */
    remove: function (id) {
        var meta = this.meta;
        var map = File.readJSON(meta.map);
        var values = map[id];

        if (!values) {
            return;
        }
     
        delete map[id];

        var list = File.readJSON(meta.list);
        var index = list.indexOf(id);
        list.splice(index, 1);

        File.writeJSON(meta.map, map);
        File.writeJSON(meta.list, list);

        var item = { 'id': id };
        var fields = meta.fields;

        fields.forEach(function (field, index) {
            item[field.name] = values[index];
        });

        return item;
    },

    
    /**
    * 添加一条记录。
    * @param {Object} item 要添加的记录的数据对象。
    */
    add: function (item) {
        var meta = this.meta;
        var fields = meta.fields;
        var errors = [];

        var map = File.readJSON(meta.map);
        var list = File.readJSON(meta.list);

        if (Array.isArray(item)) {  //重载 add(items)，批量添加
            item = item.map(add);
        }
        else {                      //单个添加
            item = add(item);
        }


        function add(item) {
            var id = $.String.random();

            item.id = id;
            item.datetime = now();
            list.push(id);

            //必须确保值的长度跟键的长度一致。
            map[id] = fields.map(function (field) {

                var name = field.name;
                var type = field.type;
                var value = item[name];

                if (field.required) {
                    if (!(name in item)) {
                        errors.push('缺少字段 ' + name);
                        return;
                    }
                    
                    if (type == 'string' && !value) {
                        errors.push('字段 ' + name + ' 不能为空');
                        return;
                    }
                }

                if (field.unique) {
                    var file = meta.unique[name];
                    var name$id = File.readJSON(file);

                    if (name$id[name]) {
                        errors.push('已存在 ' + name + ' 为 ' + name$id[name] + ' 的记录');
                        return;
                    }

                    name$id[name] = id;
                    File.writeJSON(field, name$id);
                }


                //存储时作数据转换。
                switch (type) {
                    case 'string':
                        value = String(value);
                        break;

                    case 'number':
                        value = Number(value);
                        break;
                }

                return value;
            });

            return item;
        }

        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }


        File.writeJSON(meta.map, map);
        File.writeJSON(meta.list, list);

        return item;

    },


    /**
    * 更新一条指定 id 的记录。
    */
    update: function (item) {

        var meta = this.meta;
        var map = File.readJSON(meta.map);
        var id = item.id;
        var values = map[id];

        if (!values) {
            return;
        }

        var fields = meta.fields;
        item.datetime = now();

        fields.forEach(function (field, index) {
            var name = field.name;

            if (!(name in item)) {
                item[name] = values[index];     //取原来的值，为了返回给调用方。
                return;
            }

            var value = item[name];

            //存储时作数据转换。
            switch (field.type) {
                case 'string':
                    value = String(value);
                    break;

                case 'number':
                    value = Number(value);
                    break;
            }

            values[index] = value;
        });

      
        File.writeJSON(meta.map, map);
        return item;
    },

};





module.exports = DataBase;