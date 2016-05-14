

define('/License/Dialog', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var NumberField = require('NumberField');
    var DateTimePicker = require('DateTimePicker');

    var panel = KISP.create('Panel');
    var dialog = null;
    var current = null; //外面传进来的数据。
    var sample = '';    //html 模板 。


    function totalSize() {
        var total = 0;

        dialog.$.find('[data-name="size"]').each(function () {
            var txt = this;
            var nf = new NumberField(txt);
            var value = nf.get();
            value = Number(value);

            total += value;

        });

        dialog.$.find('#totalSize').val(total);
        new NumberField('#totalSize').update();
    }


    panel.on('init', function () {

        sample = document.body.innerHTML;
        sample = $.String.between(sample, '<!--dialog', 'dialog-->');


        dialog = KISP.create('Dialog', {

            title: '编辑规划许可证',
            text: '',
            buttons: [
                { text: '取消', name: 'cancel', color: 'red', },
                { text: '确定', name: 'ok', },
            ],
            height: 370,
            width: 550,
            autoClosed: false,
            cssClass: 'dialog-add',
        });

        dialog.on('show', function () {

            var title = current ? '编辑规划许可证' : '添加规划许可证';
            dialog.$.find('header').html(title);


            //让它出现在可视范围内。
            var div = dialog.$.get(0);
            div.style.top = top.document.body.scrollTop + 20 + 'px';

            
        });

        var hasBind = false;

        dialog.on('show', function () {
            if (hasBind) {
                return;
            }

            hasBind = true;
            dialog.$.on('change', '[data-name="size"]', function (event) {
                totalSize();
            });
        });


        dialog.on('button', 'cancel', function () {
            dialog.hide();
        });


        dialog.on('button', 'ok', function () {


            var data = current;

            dialog.$.find('[name]').each(function () {

                var name = this.name;
                var value = this.value;

                var type = this.getAttribute('data-type');
                if (type == 'number' || type == 'price') {
                    var txt = this;
                    var nf = new NumberField(txt);
                    value = nf.get();
                    value = Number(value);
                }

                data[name] = value;
            });


            panel.fire('submit', [data]);

            dialog.hide();

        });

      


    });



    panel.on('render', function (data) {

        current = data = $.Object.extend({
            'number': '',
            'date': '',
            'residenceSize': '',
            'commerceSize': '',
            'officeSize': '',
            'otherSize': '',

        }, data);


        var html = $.String.format(sample, data);

        dialog.set('text', html);
        dialog.show();


        new NumberField('[data-type="number"]');

        new DateTimePicker('[data-type="date"]', {
            format: 'yyyy-mm-dd',
            autoclose: true,
            minView: 'month',
            todayBtn: true,
            todayHighlight: true
        });

     

        totalSize();

        
       
    });



    return panel.wrap();

});