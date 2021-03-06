﻿

define('/Dialog', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');


    var panel = KISP.create('Panel');
    var dialog = null;
    var current = null; //外面传进来的数据。
    var sample = '';    //html 模板 。

    panel.on('init', function () {

        sample = document.body.innerHTML;
        sample = $.String.between(sample, '<!--dialog', 'dialog-->');


        dialog = KISP.create('Dialog', {

            title: '编辑楼盘类目',
            text: '',
            buttons: [
                { text: '取消', name: 'cancel', color: 'red', },
                { text: '确定', name: 'ok', },
            ],
            height: 668,
            width: 600,
            autoClosed: false,
            cssClass: 'dialog-add',
        });

        dialog.on('show', function () {

            //让它出现在可视范围内。
            var div = dialog.$.get(0);
            div.style.top = top.document.body.scrollTop + 20 + 'px';
        });


        dialog.on('button', 'cancel', function () {
            dialog.hide();
        });


        dialog.on('button', 'ok', function () {

            var $ = dialog.$;

            var name = $.find('[data-name="name"]').val();
            if (!name) {
                top.KISP.alert('请输入楼盘名称');
                return;
            }

            var cover = $.find('[data-name="cover"]').val();
            if (!cover) {
                top.KISP.alert('请输入封面图片地址');
                return;
            }

            var data = {
                'id': current.id,
                'belong': current.belong,
                'name': name,
                'cover': cover,
                'address': $.find('[data-name="address"]').val(),
                'type': $.find('[data-name="type"]').val(),
                'price': $.find('[data-name="price"]').val(),
                'phone': $.find('[data-name="phone"]').val(),
            };


            panel.fire('submit', [data]);

            dialog.hide();

        });


        var hasBind = false;
        dialog.on('show', function () {

            if (hasBind) {
                return;
            }

            hasBind = true;

            dialog.$.on('change', '[data-name="cover"]', function () {
                var src = this.value;
                dialog.$.find('[data-name="photo"]').attr('src', src);

            });
        });
   

    });



    panel.on('render', function (data) {

        current = data;
        var html = $.String.format(sample, data);

        dialog.set('text', html);
        dialog.show();

       
    });



    return panel.wrap();

});