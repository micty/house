

define('/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Size = require('Size');
    var NumberField = require('NumberField');

   
    var panel = KISP.create('Panel', '#table-form');



    function get(data) {

        data = data || {};

        panel.$.find('[name]').each(function () {

            var name = this.name;
            var value = this.value;

            var type = this.getAttribute('data-type');
            if (type == 'number' || type == 'price') {
                value = NumberField.value(this);
            }

            //针对新增，为了更容易发现意外的重复的 name 字段。
            if (!data.id && name in data) {
                throw new Error('重复的 name 字段: ' + name);
            }

            data[name] = value;
        });

        return data;
    }


    function totalSize() {

        var data = get();

        $('#totalSize').html(Size.totalText(data));
        $('#totalSize0').html(Size.totalText(data, 0));
        $('#totalSize1').html(Size.totalText(data, 1));

    }



    panel.on('init', function () {

        NumberField.create('[data-type="number"]');
        panel.$.find('[data-type="number"]').on('change', function (event) {
            totalSize();
        });

    });




    panel.on('init', function () {

        var DateTimePicker = require('DateTimePicker');

        var dtp = new DateTimePicker('[data-type="date"]', {
            format: 'yyyy-mm-dd',
            autoclose: true,
            minView: 'month',
            todayBtn: true,
            todayHighlight: true
        });
    });




    panel.on('render', function (data) {

        if (data) {
            panel.$.find('[name]').each(function () {
                var name = this.name;

                if (!(name in data)) {
                    return;
                }

                var value = data[name];
                this.value = value;

            });


            NumberField.update('[data-type="number"]');
            totalSize();
        }



    });


    return panel.wrap({
        'get': get,
    });

});