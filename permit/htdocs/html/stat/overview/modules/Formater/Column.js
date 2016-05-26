
define('/Formater/Column', function (require, module, exports) {

    var $ = require('$');


    //把一个分组转成列数组。
    function get(group) {
        var list = [];

        list.push({
            'text': group.text,
            'value': group.value,
            'group': true,
            'subGroup': true,
        });

        list = list.concat(group.uses);

        $.Array.each(group.towns, function (town) {

            list.push({
                'text': town.text,
                'value': town.value,
                'subGroup': true,
            });

            list = list.concat(town.uses);
        });

        return list;
    }




    return {
        'get': get,
      
    };

});