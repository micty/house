﻿

define('User', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');

    
    var LocalStorage = require('LocalStorage');
    var SessionStorage = require('SessionStorage');

    function get(key) {

        //针对 login 页面。
        if (key === true) {
            return  LocalStorage.get('user');
        }

        var user = SessionStorage.get('user') || {};
        return key ? use[key] : user;
    }



    function set(data) {
        SessionStorage.set('user', data);
        LocalStorage.set('user', data);
    }

    function isSuper() {
        var user = get();
        return user.role == 'administrator';
    }

    function is(role) {
        var user = get();
        return user.role == role;
    }


    return {
        'get': get,
        'set': set,
        'isSuper': isSuper,
        'is': is,
    };


});