
var $ = require('./MiniQuery');
var File = require('./File');
var Directory = require('./Directory');
var fs = require('fs');
var Emitter = $.require('Emitter');

function now() {
    return $.Date.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
}

var emitter = new Emitter(DataBase);
var root = process.cwd() + '/data/';


function DataBase(name, fields) {
    var dir = root + name + '/';
    dir = dir.split('\\').join('/');

    var field = dir + 'field.json';
    var list = dir + 'list.json';
    var map = dir + 'map.json';
    var unique = dir + 'unique.json';


    if (!File.exists(field)) {
        File.writeJSON(field, fields);
    }
    else {
        fields = File.readJSON(field);
    }

    if (!File.exists(list)) {
        File.writeJSON(list, []);
    }

    if (!File.exists(map)) {
        File.writeJSON(map, {});
    }

    if (!File.exists(unique)) {
        var obj = {};

        fields.forEach(function (field) {
            if (field.unique) {
                obj[field.name] = {};
            }
        });

        File.writeJSON(unique, obj);
    }


    var meta = this.meta = {
        'emitter': new Emitter(this),
        'list': list,
        'map': map,
        'fields': fields,       //字段描述信息在创建后不会再变。
        'unique': unique,
    };

    var self = this;

    fields.forEach(function (field) {
        var name = field.name;
        var refer = field.refer;
        if (!refer) {
            return;
        }
   
        DataBase.on('create', refer, function (db) {
            db.on({
                'remove': function (refers) {
                    var list = self.list();

                    refers.forEach(function (refer) {
                        var id = refer.id;

                        var ids = list.filter(function (item) {
                            return item[name] == id;

                        }).map(function (item) {
                            return item.id;
                        });

                        self.remove(ids);
                    });
                },
            });
        });
    });

    emitter.fire('create', name, [this]);

}


//静态方法。
DataBase.on = function (name, fn) {
    var args = [].slice.call(arguments, 0);
    emitter.on.apply(emitter, args);
};

//实例方法。
DataBase.prototype = {
    constructor: DataBase,

    /**
    * 绑定事件。
    */
    on: function (name, fn) {
        var meta = this.meta;
        var emitter = meta.emitter;

        var args = [].slice.call(arguments, 0);
        emitter.on.apply(emitter, args);
    },
    
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
    * 获取全部或指定条件的记录。
    */
    list: function (filter) {
        var meta = this.meta;
        var fields = meta.fields;

        var map = File.readJSON(meta.map);
        var list = File.readJSON(meta.list);

        list = list.map(function (id) {
            var values = map[id];
            var item = { 'id': id };

            fields.forEach(function (field, index) {
                item[field.name] = values[index];
            });

            return item;
        });

        //没指定过滤条件，则返回全部。
        if (!filter) {
            return list;
        }

        //过滤条件为一个函数，则使用函数的过滤规则。
        if (typeof filter == 'function') {
            return list.filter(filter);
        }

        //过滤条件为一个对象。
        return list.filter(function (item) {
            for (var key in filter) {
                if (filter[key] !== item[key]) {
                    return false;
                }
            }
            return true;
        });

    },

    /**
    * 移除一条或多条指定 id 的记录。
    */
    remove: function (id) {
        var meta = this.meta;
        var fields = meta.fields;
       
        var map = File.readJSON(meta.map);
        var list = File.readJSON(meta.list);
        var unique = File.readJSON(meta.unique);

        var ids = Array.isArray(id) ? id : [id];

        var items = ids.map(function (id) {

            var index = list.indexOf(id);
            if (index >= 0) {
                list.splice(index, 1);
            }

            var values = map[id];
            delete map[id];

            if (!values) {
                return;
            }

            var item = { 'id': id };

            fields.forEach(function (field, index) {

                var value = values[index];
                var name = field.name;

                item[name] = value;

                if (field.unique) {
                    delete unique[name][value];
                }
            });

            return item;
        });

        File.writeJSON(meta.map, map);
        File.writeJSON(meta.list, list);
        File.writeJSON(meta.unique, unique);

        //过滤掉空项。
        items = items.filter(function (item) {
            return !!item;
        });

        meta.emitter.fire('remove', [items]);

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
                    var value$id = File.readJSON(file);

                    if (value$id[value]) {
                        errors.push('已存在' + (field.alias || name) + '为' + value + '的记录');
                        return;
                    }

                    value$id[value] = id;
                    File.writeJSON(file, value$id);
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