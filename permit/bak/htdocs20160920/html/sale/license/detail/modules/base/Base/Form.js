

define('/Base/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Cell = require('Cell');
    var Size = require('Size');
    var NumberField = require('NumberField');

 

    var panel = KISP.create('Panel', '#div-base-form');


    var type$item = {
        0: {
            number: '预售',
            title: '预售',
        },
        1: {
            number: '备案',
            title: '现售',
        },
    };


    panel.on('render', function (data) {

       
        //有 land 字段，说明是导入的数据，在内存中的，不是真实的后台记录。
        var isTemp = 'land' in data;
        panel.$.toggleClass('temp', isTemp);

        Object.keys(data).forEach(function (key) {
            var desc = key + 'Desc';
            if (!(desc in data)) {
                data[desc] = '';
            }
        });


        var item = type$item[data.type];


        data = $.Object.extend({}, data, {

            'type.number': item.number,
            'type.title': item.title,

            'totalSize0': Size.totalText(data, 0),
            'totalSize1': Size.totalText(data, 1),
            'totalSize': Size.totalText(data),
            'totalCell': Cell.totalText(data),
        });


        data = Size.format(data);
        data = Cell.format(data);


        panel.fill(data);




    });


    return panel.wrap();

});