

define('/Base/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var NumberField = require('NumberField');

    var panel = KISP.create('Panel', '#div-base-form');
    var current = null;



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
        NumberField.update('#totalSize');
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
        NumberField.update('#totalCell');
    }


    panel.on('init', function () {

        new NumberField('[data-type="number"]');

        panel.$.on('change', '[data-name="size"]', function (event) {
            totalSize();
        });

        panel.$.on('change', '[data-name="cell"]', function (event) {
            totalCell();
        });
    });


    panel.on('render', function (data) {

        current = {};

        //没有土地记录字段，说明是新增的。
        //此时传进来的是一个土地记录。
        if (!data.land) {
            current.land = { 'id': data.id, };
            panel.fill(data);
            return;
        }

        //有土地 id，说明是编辑的。

        current = data;
        panel.fill(data.land);

        var sale = data.sale;
        panel.$.find('[name]').each(function () {
            var name = this.name;

            if (!(name in sale)) {
                return;
            }

            var value = sale[name];
            this.value = value;
        });

        NumberField.update('[data-type="number"]');


    });


    return panel.wrap({
        get: function () {

            var sale = current.sale || {};

            var data = {
                'id': sale.id,
                'landId': current.land.id,
            };

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