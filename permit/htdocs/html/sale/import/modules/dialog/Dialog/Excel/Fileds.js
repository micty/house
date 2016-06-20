

define('/Dialog/Excel/Fields', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');


    var list = [
        { key: 'land', type: 'string', required: true, },
        { key: 'project', type: 'string', required: true, },

        { key: 'number', type: 'string', required: true, },
        { key: 'date', type: 'date', required: false, },
        { key: 'location', type: 'string', required: false, },

        { key: 'residenceSize', type: 'number', required: false, },
        { key: 'commerceSize', type: 'number', required: false, },
        { key: 'officeSize', type: 'number', required: false, },
        { key: 'otherSize', type: 'number', required: false, },
        { key: 'parkSize', type: 'number', required: false, },
        { key: 'otherSize1', type: 'number', required: false, },

        { key: 'residenceCell', type: 'number', required: false, },
        { key: 'commerceCell', type: 'number', required: false, },
        { key: 'officeCell', type: 'number', required: false, },
        { key: 'otherCell', type: 'number', required: false, },

        { key: 'saled-residenceSize', type: 'number', required: false, },
        { key: 'saled-commerceSize', type: 'number', required: false, },
        { key: 'saled-officeSize', type: 'number', required: false, },
        { key: 'saled-otherSize', type: 'number', required: false, },
        { key: 'saled-parkSize', type: 'number', required: false, },
        { key: 'saled-otherSize1', type: 'number', required: false, },

        { key: 'saled-residenceCell', type: 'number', required: false, },
        { key: 'saled-commerceCell', type: 'number', required: false, },
        { key: 'saled-officeCell', type: 'number', required: false, },
        { key: 'saled-otherCell', type: 'number', required: false, },
    ];



    function get(names) {

        if (names.length != list.length) {
            return '表头的字段个数不正确';
        }


        var fields = list.map(function (item, index) {

            return $.Object.extend({}, item, {
                'name': names[index],
            });

            
        });

        return fields;

    }




    return {
        'get': get,
    };

});