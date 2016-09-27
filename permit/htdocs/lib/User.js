

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
        return key ? user[key] : user;
    }



    function set(data) {
        SessionStorage.set('user', data);
        LocalStorage.set('user', data);
    }

    function clear() {
        SessionStorage.remove('user');
    }

    function isSuper() {
        var user = get();
        return user.role == 'administrator';
    }


    function is(role) {
        var user = get();

        return user.role == role ||
            user.role == 'administrator';
    }


    function display(role) {
        return is(role) ? '' : 'display: none;';
    }

    return {
        'get': get,
        'set': set,
        'clear': clear,
        'isSuper': isSuper,
        'is': is,
        'display': display,
    };


});