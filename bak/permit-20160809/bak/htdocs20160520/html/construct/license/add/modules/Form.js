

define('/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var NumberField = require('NumberField');

   
    var panel = KISP.create('Panel', '#table-form');





    function totalSize() {
        var total = 0;

        panel.$.find('[data-name="size"]').each(function () {
            var txt = this;
            var nf = new NumberField(txt);
            var value = nf.get();
            value = Number(value);

            total += value;

        });

        panel.$.find('#totalSize').val(total);
        new NumberField('#totalSize').update();
    }


    panel.on('init', function () {

        new NumberField('[data-type="number"]');

        panel.$.find('[data-name="size"]').on('change', function (event) {
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

            totalSize();
            new NumberField('[data-type="number"]').update();
        }



    });


    return panel.wrap({
        get: function (data) {

            panel.$.find('[name]').each(function () {

                var name = this.name;
                var value = this.value;

                var type = this.getAttribute('data-type');
                if (type == 'number') {
                    var txt = this;
                    var nf = new NumberField(txt);
                    value = nf.get();
                    value = Number(value);
                }

                data[name] = value;
            });

            return data;
        },
    });

});