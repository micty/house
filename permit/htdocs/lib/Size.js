

define('Size', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');


    var sizes = [
        [
            'commerceSize',
            'residenceSize',
            'officeSize',
            'otherSize',
        ],
        [
            'parkSize',
            'otherSize1',
        ],
    ];



    function total(data, index) {

        var total = 0;

        var keys = typeof index == 'number' ?
            sizes[index] :
            $.Array.reduceDimension(sizes); //取全部


        keys.forEach(function (key) {
            var value = data[key];
            value = Number(value);
            total += value;
        });

        return total;

    }

    function totalText(data, index) {
        var NumberField = require('NumberField');

        var value = total(data, index);
        value = NumberField.get(value);
        return value;
    }





    return {
        'total': total,
        'totalText': totalText,
    };


});