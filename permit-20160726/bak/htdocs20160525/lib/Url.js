

define('Url', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');

    
    function checkFull(url) {
        if (!url || typeof url != 'string') {
            return false;
        }

        url = url.toLowerCase();

        return url.indexOf('http://') == 0 || url.indexOf('https://') == 0;
    }


    return {
        checkFull: checkFull,


    };


});