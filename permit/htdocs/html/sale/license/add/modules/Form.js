

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

    function totalCell() {
        var total = 0;

        panel.$.find('[data-name="cell"]').each(function () {
            var txt = this;
            var nf = new NumberField(txt);
            var value = nf.get();
            value = Number(value);

            total += value;

        });

        panel.$.find('#totalCell').val(total);
        new NumberField('#totalCell').update();
    }


    panel.on('init', function () {

        new NumberField('[data-type="number"]');

        panel.$.find('[data-name="size"]').on('change', function (event) {
            totalSize();
        });

        panel.$.find('[data-name="cell"]').on('change', function (event) {
            totalCell();
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
            totalCell();

            NumberField.update('[data-type="number"]');
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