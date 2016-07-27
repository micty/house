

define('/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

  
    var NumberField = require('NumberField');
    var DateTimePicker = require('DateTimePicker');
    var Cell = require('Cell');
    var Size = require('Size');

    var panel = KISP.create('Panel', '#div-form');

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



    function get(data) {

        data = data || {};

        panel.$.find('[name]').each(function () {

            var name = this.name;
            var value = this.value;

            var type = this.getAttribute('data-type');
            if (type == 'number' || type == 'price') {
                value = NumberField.value(this);
            }

            data[name] = value;
        });

        return data;
    }


    function total() {

        var data = get();

        $.Object.each({
                    
            'totalSize0': Size.totalText(data, 0),
            'totalSize1': Size.totalText(data, 1),
            'totalSize': Size.totalText(data),
            'totalCell': Cell.totalText(data),

            'saled-totalSize0': Size.totalText('saled-', data, 0),
            'saled-totalSize1': Size.totalText('saled-', data, 1),
            'saled-totalSize': Size.totalText('saled-', data),
            'saled-totalCell': Cell.totalText('saled-', data),


        }, function (key, value) {
            $('#' + key).html(value);
        });

    }



    panel.on('init', function () {

        panel.$.on('change', '[data-type="number"]', function (event) {
            total();
        });

    });




    panel.on('render', function (data) {

  
        var item = type$item[data.type];
   
        panel.fill(item);



        panel.$.find('[name]').each(function () {
            var name = this.name;
            var value = data[name];

            if (!(name in data)) {
                value = '';
            }

            this.value = value;

        });

        total();


        NumberField.create('[data-type="number"]');
        DateTimePicker.create('[data-type="date"]', {
            pickerPosition: 'bottom-right',
        });


    });



    return panel.wrap({
        'get': get,
    });

});