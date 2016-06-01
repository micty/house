

define('Array', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');

    var NumberField = require('NumberField');




    //对两个数组的元素分别进行相加
    function add(A, B, k) {

        if (k === undefined) {
            k = 1;
        }

        return $.Array.keep(A, function (item, index) {

            var value = item.value + B[index].value * k;

            return $.Object.extend({}, item, {
                'value': value,
            });
        });
    }


    function substract(A, B) {
        return add(A, B, -1);
    }




    return {
        'substract': substract,
    };


});