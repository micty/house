
/**
* 云之家的用户信息模块
*/
define('UserInfo', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Storage = MiniQuery.require('LocalStorage');

    //云之家用户信息
    var yzjKey = '_vGuide_YZJ_';

    //业务系统用户信息
    var emKey = '_vGuide_USER_';

    function get(isYZJ) {
        var key = isYZJ ? yzjKey : emKey;
        return Storage.get(key) || {};
    }



    function set(value, isYZJ) {
        var key = isYZJ ? yzjKey : emKey;

        if (!value || typeof value != 'object') {
            throw new Error('参数 value 非法');
        }

        Storage.set(key, value);

    }

    return {
        get: get,
        set: set,
    };

});