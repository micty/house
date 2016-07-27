
define('/Chart/Color', function (require, module) {
    var $ = require('$');
    var KISP = require('KISP');




    var list = [
           { R: 255, G: 99, B: 132, },

           { R: 30, G: 90, B: 204, },
           { R: 79, G: 131, B: 65, },
           { R: 255, G: 206, B: 67, },
           { R: 115, G: 39, B: 148, },

           { R: 60, G: 175, B: 243, },
           { R: 143, G: 0, B: 0, },
           { R: 255, G: 140, B: 57, },
           { R: 0, G: 0, B: 0, },
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