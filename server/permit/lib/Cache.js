




function getMD5(data, dbs) {
    
    var MD5 = require('./MD5');
    var DataBase = require('./DataBase');

    var list = dbs.map(function (name) {
        var db = DataBase.get(name);
        return db.md5();
    });
  
    //把键排序，确保同样的键集合生成的 json 串一样。
    var json = {};

    Object.keys(data).sort().forEach(function (key) {
        json[key] = data[key];
    });

    json = JSON.stringify(json);


    var content = json + list.join('');
    var md5 = MD5.get(content);

    return md5;
}


function Cache(name) {
    
    var meta = {
        'root': './cache/' + name + '/',

    };

    this.meta = meta;
}



Cache.prototype = {
    constructor: Cache,

    get: function (name, dbs, data) {




        //test
        return;


        var meta = this.meta;
        var md5 = getMD5(data, dbs);
        var file = meta.root + name + '/' + md5 + '.json';

        var File = require('./File');
        if (File.exists(file)) {
            return File.readJSON(file);
        }
    },

    set: function (name, dbs, data, json) {

        //test
        return;

        var meta = this.meta;
        var md5 = getMD5(data, dbs);
        var file = meta.root + name + '/' + md5 + '.json';

        var File = require('./File');
        File.writeJSON(file, json);
    },
};


module.exports = Cache;