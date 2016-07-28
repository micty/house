

define('/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Size = require('Size');
    var NumberField = require('NumberField');
    var DateTimePicker = require('DateTimePicker');
    var $Object = require('$Object');


    var panel = KISP.create('Panel', '#div-form');
    var current = null;




    panel.on('fill', function () {

        NumberField.create('[data-type="number"]');
        DateTimePicker.create('[data-type="date"]', {
            pickerPosition: 'top-right',
        });

    });


    panel.on('render', function (data) {

        current = data;


        var license = data.license;

        license = $.Object.extend({}, license, {
            'totalSize0': Size.totalText(license, 0),
            'totalSize1': Size.totalText(license, 1),
            'totalSize': Size.totalText(license),
        });

        data.license = Size.format(license);



        data.construct = data.construct || { //针对新增的情况。
            number: '',
            date: '',
            size: '',
            numberDesc: '',
            dateDesc: '',
            sizeDesc: '',
        };

        data = $Object.linear(data);

        panel.fill(data);


    });


    return panel.wrap({
        get: function () {

            var construct = current.construct || {};

            var data = {
                'id': construct.id,
                'licenseId': current.license.id,
            };

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
        },
    });


});