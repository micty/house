

define('Size', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');

    var NumberField = require('NumberField');


    var sizes = [
        [
            'residenceSize',
            'commerceSize',
            'officeSize',
            'otherSize',
        ],
        [
            'parkSize',
            'otherSize1',
        ],
    ];


    //重载：
    // total(prefix, data, index)
    // total(prefix, data)
    // total(data, index)
    // total(data)
    function total(prefix, data, index) {

        //重载 total(data, index);
        if (typeof prefix == 'object') {
            index = data;
            data = prefix;
            prefix = '';
        }



        var total = 0;

        var keys = typeof index == 'number' ?
            sizes[index] :
            $.Array.reduceDimension(sizes); //取全部


        keys.forEach(function (key) {

            key = prefix + key;

            var value = data[key] || 0;
            value = Number(value) || 0;
            total += value;
        });

        return total;

    }

    function totalText(prefix, data, index) {

        var value = total(prefix, data, index);
        value = NumberField.text(value);

        return value;
    }


    function text(data, key) {
        var value = data[key] || 0;
        return NumberField.text(value);
    }


    function format(prefix, data) {


        //重载 format(data);
        if (typeof prefix == 'object') {
            data = prefix;
            prefix = '';
        }

        var keys = $.Array.reduceDimension(sizes);
        $.Array.each(keys, function (key) {
     
            key = prefix + key;

            data[key] = text(data, key);
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