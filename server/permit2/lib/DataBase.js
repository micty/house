
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
var name$db = {};             

function DataBase(name, fields) {

    var isOuter = !!fields;             //判断是否为外面实例化的创建（通过指定 fields）
    if (isOuter && name$db[name]) {
        throw new Error('已经存在名为 ' + name + ' 的 DataBase 实例');
    }

    var dir = root + name + '/';
    dir = dir.split('\\').join('/');

    var field = dir + 'field.json';     //字段描述列表: fields
    var list = dir + 'list.json';       //id 索引列表: ids
    var map = dir + 'map.json';         //记录映射表: id$item
    var unique = dir + 'unique.json';   //一对一字段映射 id 表: fieldName$value$id 

    //字段描述列表。 
    if (fields) {
        File.writeJSON(field, fields);
    }
    else {
        fields = File.exists(field) ? File.readJSON(field) || [] : [];
    }

    fields.forEach(function (field) {
        field.type = field.type || 'string'; //默认为 string 类型。
    });


    if (!File.exists(list)) {
        File.writeJSON(list, []);
    }

    if (!File.exists(map)) {
        File.writeJSON(map, {});
    }

    //一对一字段映射。
    var obj = File.exists(unique) ? File.readJSON(unique) || {} : {};

    fields.forEach(function (field) {
        var name = field.name;

        if (field.unique) {
            obj[name] = obj[name] || {};
        }
        else {
            delete obj[name];
        }
    });

    File.writeJSON(unique, obj);



    var meta = this.meta = {
        'emitter': new Emitter(this),
        'list': list,
        'map': map,
        'fields': fields,       //字段描述信息在创建后不会再变。
        'unique': unique,
    };


    if (isOuter) {

        var self = this;

        //关联外键
        fields.forEach(function (field) {
            var name = field.name;
            var refer = field.refer;
            if (!refer) {
                return;
            }

            DataBase.on('create', refer, function (db) {

                //级联删除所关联的下级节点。
                db.on('remove', function (refers) {

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
                });
            });
        });

        emitter.fire('create', name, [this]);
        name$db[name] = this;
    }
    

}


//静态方法。
DataBase.on = function (action, name, fn) {

    //指定名称的数据库已经创建，立即触发回调函数。
    if (action == 'create') {   //外面绑定只能 on('create', name, fn) 的方式。
        var db = name$db[name];
        if (db) {
            fn && fn(db);
            return;
        }
    }

    //尚未创建，则先注册。
    var args = [].slice.call(arguments, 0);
    emitter.on.apply(emitter, args);
};

DataBase.get = function (name) {
    return name$db[name] || new DataBase(name);
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
    get: function (id, refer) {

        var meta = this.meta;
        var map = File.readJSON(meta.map);
        var values = map[id];

        if (!values) {
            return;
        }

        var item = { 'id': id };
        var fields = meta.fields;

        var refers = refer ? {} : null;

        fields.forEach(function (field, index) {
            var name = field.name;
            var value = values[index];
            var refer = field.refer;

            item[name] = value;

            //指定了要获取关联的外键，并且该字段是外键的。
            if (refers && refer) {
                var db = DataBase.get(refer);
                refers[name] = db.get(value, true);
            }
        });

        return refer ? {
            'item': item,
            'refer': refers,
        } : item;
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

        return Array.isArray(id) ? items: items[0];
    },

    /**
    * 添加一条或多条记录。
    * @param {Object} item 要添加的记录的数据对象。
    */
    add: function (item) {
        var meta = this.meta;
        var fields = meta.fields;

        var map = File.readJSON(meta.map);
        var list = File.readJSON(meta.list);
        var unique = File.readJSON(meta.unique);

        var items = Array.isArray(item) ? item : [item];
        var errors = [];

        items = items.map(function (item) {
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
                    if (unique[name][value]) {
                        errors.push('已存在' + (field.alias || name) + '为' + value + '的记录');
                        return;
                    }

                    unique[name][value] = id;
                }

                var refer = field.refer;
                if (refer) {
                    var db = DataBase.get(refer);
                    var referItem = db.get(value);
                    if (!referItem) {
                        //如：不存在关联的 landId 为 554SA76445BA 的 Land 记录。
                        errors.push('不存在关联的 ' + name + ' 为 ' + value + ' 的 ' + refer + ' 记录');
                        return;
                    }
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
        });

        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }

        File.writeJSON(meta.map, map);
        File.writeJSON(meta.list, list);
        File.writeJSON(meta.unique, unique);

        meta.emitter.fire('add', [items]);

        return Array.isArray(item) ? items : items[0];

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
        var unique = File.readJSON(meta.unique);

        item.datetime = now();

        fields.forEach(function (field, index) {
            var name = field.name;
            var has = name in item;
            var value = has ? item[name] : values[index];

            if (!has) {
                item[name] = value; //取原来的值，为了返回给调用方。
                return;
            }

            //以下的 value === item[name]，即为 item 中的，而不是原来的 values[index]。

            if (field.required) {
                if (type == 'string' && !value) {
                    errors.push('字段 ' + name + ' 不能为空');
                    return;
                }
            }

            if (field.unique && value != values[index]) { //只有值发生变化时才作进一步判断。
             
                if (unique[name][value]) {
                    errors.push('已存在' + (field.alias || name) + '为' + value + '的记录');
                    return;
                }

                unique[name][value] = id;
            }

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
        File.writeJSON(meta.unique, unique);

        meta.emitter.fire('update', [item]);

        return item;
    },

};





module.exports = DataBase;