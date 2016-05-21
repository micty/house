

define('Size', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');

    var NumberField = require('NumberField');


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
            value = Number(value) || 0;
            total += value;
        });

        return total;

    }

    function totalText(data, index) {

        var value = total(data, index);
        value = NumberField.text(value);
        return value;
    }

    function text(data, key) {
        var value = data[key];
        return NumberField.text(value);
    }


    function format(data) {

        data = $.Object.extend({}, data, {
            'totalSize': totalText(data),
            'totalSize0': totalText(data, 0),
            'totalSize1': totalText(data, 1),
        });

        var keys = $.Array.reduceDimension(sizes);
        $.Array.each(keys, function (key) {

            var value = data[key];
            
            value = NumberField.text(value);
            data[key] = value;
        });

        return data;

    }





    return {
        'total': total,
        'totalText': totalText,
        'format': format,
        'text': text,
    };


});