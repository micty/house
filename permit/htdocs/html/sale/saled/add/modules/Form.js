

define('/Form', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Size = require('Size');
    var Cell = require('Cell');
    var NumberField = require('NumberField');
    var DateTimePicker = require('DateTimePicker');

   
    var panel = KISP.create('Panel', '#div-form');
    var current = null;


    function get(needValidate) {

        var data = current.saled || {
            'licenseId': current.license.id,
        };

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

        //需要验证数据，说明是外面调用来提交到后台的。
        if (needValidate) {
            var date = data.date;
            if (!date) {
                top.KISP.alert('必须指定截止日期');
                return;
            }

            var reg = /^\d{4}-\d{2}-\d{2}$/;
            if (!reg.test(date)) { //必须为 'yyyy-MM-dd' 的格式
                top.KISP.alert('截止日期必须为 yyyy-MM-dd 的格式');
                return;
            }

            data.date = date.split('-').join(''); //转成 yyyyMMdd 格式。
        }

        return data;
    }



    function sum() {

        var data = get();

        $.Object.each({
            'totalSize0': Size.totalText(data, 0),
            'totalSize1': Size.totalText(data, 1),
            'totalSize': Size.totalText(data),
            'totalCell': Cell.totalText(data),
        }, function (key, value) {
            $('#' + key).html(value);
        });

    }


    panel.on('init', function () {

        NumberField.create('[data-type="number"]');

        panel.$.on('change', '[data-type="number"]', function (event) {
            sum();
        });

        DateTimePicker.create('[data-type="date"]', {
            pickerPosition: 'top-right',
        });

    });


    panel.on('render', function (data) {

        current = data;

        var license = data.license;
        var saled = data.saled;

        var obj = $.Object.extend({}, license, {
            'typeName': license.type == 0 ? '预售许可证号' : '现售备案证号',
        });

        panel.fill(obj);

        setTimeout(function () {
            if (saled) {
                var date = saled.date.toString();
                saled.date = date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6);

                panel.$.find('[name]').each(function () {
                    var name = this.name;
                    var value = saled[name];

                    if (!(name in saled)) {
                        value = '';
                    }

                    this.value = value;
                });

                sum();
            }
               

            NumberField.update('[data-type="number"]');

            DateTimePicker.create('[data-type="date"]', {
                pickerPosition: 'top-right',
            });


           

        }, 100);


     

    });


    return panel.wrap({
        'get': get,
    });

});