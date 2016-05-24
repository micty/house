
define('Cell', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var NumberField = require('NumberField');


    var keys = [
        'residenceCell',
        'commerceCell',
        'officeCell',
        'otherCell',
    ];




    function total(prefix, data) {

        //重载 total(data);
        if (typeof prefix == 'object') {
            data = prefix;
            prefix = '';
        }


        var total = 0;

        keys.forEach(function (key) {

            key = prefix + key;

            var value = data[key] || 0;
            value = Number(value) || 0;
            total += value;
        });

        return total;

    }

    function totalText(prefix, data) {

        var value = total(prefix, data);
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