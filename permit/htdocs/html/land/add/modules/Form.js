

define('/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

   
    var panel = KISP.create('Panel', '#table-form');





    panel.on('init', function () {


        panel.$.find('[data-type="size"]').on('focusout', function (event) {
            var txt = this;
            var value = Number(txt.value);

            if (isNaN(value)) {
                KISP.alert('请输入数字作为面积');
                $(txt).addClass('error');
                return;
            }

            if (value < 0) {
                KISP.alert('请输入一个非负数作为面积');
                $(txt).addClass('error');
                return;
            }

        }).on('focus', function (event) {
            var txt = this;

            if ($(txt).hasClass('error')) {
                $(txt).removeClass('error');
            }

        }).on('change', function (event) {

            var total = 0;

            panel.$.find('[data-type="size"]').each(function () {
                var txt = this;
                var value = Number(txt.value);
                total += value;

            });

            panel.$.find('#totalSize').html(total);
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
        }

        

    });


    return panel.wrap({
        get: function (id) {

            var data = {
                'id': id,
            };

            panel.$.find('[name]').each(function () {
                var name = this.name;
                var value = this.value;
                data[name] = value;
            });

            return data;
        },
    });


});