
define('/Chart/Color', function (require, module) {
    var $ = require('$');
    var KISP = require('KISP');




    var list = [
           { R: 255, G: 99, B: 132, },
           { R: 30, G: 90, B: 204, },
           { R: 79, G: 131, B: 65, },
           { R: 255, G: 206, B: 67, },
           { R: 115, G: 39, B: 148, },
    ];


    function get(index, alpha) {

        var item = list[index];
        var data = $.Object.extend({}, item, { 'A': alpha });

        return $.String.format('rgba({R},{G},{B},{A})', data);
    }


    return {
        'get': get,
    };
});