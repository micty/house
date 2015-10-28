

define('SessionStorage', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');

    var SessionStorage = MiniQuery.require('SessionStorage');

    var skey = 'House-fs-1874645fa466412ede2888b28503b529';
    

    var all = SessionStorage.get(skey) || {};

    
    function set(key, value) {

        all[key] = value;

        SessionStorage.set(skey, all);

    }

    function get(key) {
        return all[key];
    }

    function remove(key) {

        delete all[key];

        SessionStorage.set(skey, all);
    }



    return {
        set: set,
        get: get,
        remove: remove,
    };


});