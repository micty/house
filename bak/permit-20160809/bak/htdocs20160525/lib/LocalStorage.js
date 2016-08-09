

define('LocalStorage', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');

    var LocalStorage = MiniQuery.require('LocalStorage');

    var skey = 'permit-5ED1A2BC804DC930';

    var all = LocalStorage.get(skey) || {};

    
    function set(key, value) {

        all[key] = value;
        LocalStorage.set(skey, all);

    }

    function get(key) {
        return all[key];
    }


    function remove(key) {
        delete all[key];
        LocalStorage.set(skey, all);
    }




    return {
        set: set,
        get: get,
        remove: remove,

    };


});