

define('/Recommend/Footer', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-recommend-footer');


    panel.on('init', function () {

        var html = panel.$.html();
        html = $.String.between(html, '<!--', '-->');

        var dialog = KISP.create('Dialog', {
            title: '填写报名信息',
            text: html,
            buttons: [
                { text: '取消', name: 'cancel', color: 'red', },
                { text: '确定', name: 'ok', },
            ],
            height: 280,
            width: 380,
            autoClosed: false,
            cssClass: 'dialog-recommend',

        });

        //清空上次的内容
        dialog.on('hide', function () {
            var $ = dialog.$;
            $.find('[data-name="name"]').val('');
            $.find('[data-name="phone"]').val('');
            $.find('[data-name="intent"]').val('');
        });



        dialog.on('click', 'button', 'cancel', function () {
            dialog.hide();
        });


        dialog.on('click', 'button', 'ok', function () {
            
            var $ = dialog.$;

            var name = $.find('[data-name="name"]').val();
            if (!name) {
                KISP.alert('请输入姓名');
                return;
            }
            var phone = $.find('[data-name="phone"]').val();
            if (!phone) {
                KISP.alert('请输入手机号');
                return;
            }

            var isPhone = (/^\d{11}$/).test(phone);
            if (!isPhone) {
                KISP.alert('手机号非法');
                return;
            }

            var intent = $.find('[data-name="intent"]').val();
            if (!intent) {
                KISP.alert('请输入意向楼盘');
                return;
            }


            var data = {
                'name': name,
                'phone': phone,
                'intent': intent,
            };


            panel.fire('submit', [data]);

            dialog.hide();

        });



        panel.$.on('click', 'button', function () {


            dialog.show();

        });

    });



    panel.on('render', function () {


    });



    return panel.wrap();



});