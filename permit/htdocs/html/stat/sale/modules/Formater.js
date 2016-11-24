
define('/Formater', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');





    function format(list) {

        var stat = {
            'sale': '',
        };
        
        list = list.map(function (item, index) {

            $.Object.extend(item, {
                'un-plan': item.land - item.plan,
                'un-construct': item.land - item.construct,
                'un-prepare': item.prepare - item['saled-prepare'],
                'un-doing': item.doing - item['saled-doing'],
            });


            $.Object.each(item, function (key, value) {
                if (typeof value == 'number') {
                    var old = stat[key] || 0;
                    stat[key] = old + value;
                }
            });

            return item;
        });

   


        return {
            'list': list,
            'stat': stat,
        };
    }





    return {
        'format': format,
    };

});