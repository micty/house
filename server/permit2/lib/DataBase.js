

var $ = require('./MiniQuery');
var File = require('./File');
var Directory = require('./Directory');
var fs = require('fs');

function now() {
    return $.Date.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
}


function DataBase(name) {

    var dir = process.cwd() + '/data/' + name + '/';
    dir = dir.split('\\').join('/');

    var list = dir + 'list.json';
    var map = dir + 'map.json';


    if (!File.exists(list)) {
        File.writeJSON(list, []);
    }

    if (!File.exists(map)) {
        File.writeJSON(map, {});
    }

    this.meta = {
        'list': list,
        'map': map,

    };
}


DataBase.prototype = {
    constructor: DataBase,

    get: function (id) {

        var meta = this.meta;
        var map = File.readJSON(meta.map);
        return map[id];
        
    },

    list: function () {
        var meta = this.meta;
        var map = File.readJSON(meta.map);
        var list = File.readJSON(meta.list);
        
        return list.map(function (id) {
            return map[id];
        });

    },

    remove: function (id) {
        var meta = this.meta;
        var map = File.readJSON(meta.map);
        var item = map[id];

        if (!item) {
            return;
        }
     
        delete map[id];

        var list = File.readJSON(meta.list);
        var index = list.indexOf(id);
        list.splice(index, 1);

        File.writeJSON(meta.map, map);
        File.writeJSON(meta.list, list);

        return item;
    },

    add: function (item) {
        var meta = this.meta;
        var map = File.readJSON(meta.map);
        var list = File.readJSON(meta.list);

        if (Array.isArray(item)) { //重载 add(items)，批量添加
            item = item.map(add);
        }
        else { //单个添加
            item = add(item);
        }


        function add(item) {
            var id = $.String.random();
      
            item.id = id;
            item.datetime = now();

            list.push(id);
            map[id] = item;

            return item;
        }


        File.writeJSON(meta.map, map);
        File.writeJSON(meta.list, list);

        return item;

    },

    update: function (item) {

        var meta = this.meta;
        var map = File.readJSON(meta.map);

        var id = item.id;
        var old = map[id];
        if (!old) {
            return;
        }

        $.Object.extend(old, item, {
            'datetime': now(),
        });


      
        File.writeJSON(meta.map, map);

        return old;
    },

};





module.exports = DataBase;