

define('Signup', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');
    var MiniQuery = KISP.require('MiniQuery');


    var API = module.require('API');

    var panel = KISP.create('Panel', {
        el: '#div-dialog-signup',
        showAfterRender: false,
    });

    var dialog = null;


    panel.on('init', function () {


        var html = panel.$.html();
        html = $.String.between(html, '<!--', '-->');

        dialog = KISP.create('Dialog', {
            title: '填写报名信息',
            text: html,
            buttons: [
                { text: '取消', name: 'cancel', color: 'red', },
                { text: '确定', name: 'ok', },
            ],
            height: 220,
            //width: 380,
            autoClosed: false,
            cssClass: 'dialog-signup',

        });

        //清空上次的内容
        dialog.on('hide', function () {
            var $ = dialog.$;
            $.find('[data-name="name"]').val('');
            $.find('[data-name="phone"]').val('');
            $.find('[data-name="intent"]').val('');
        });


        dialog.on('button', 'cancel', function () {
            dialog.hide();
        });


        dialog.on('button', 'ok', function () {

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

            API.post(data);

            dialog.hide();

        });


    });


    panel.on('render', function () {

        dialog.show();

    });

    panel.on('show', function () {
        panel.render();
    });

    panel.on('hide', function () {
        dialog && dialog.hide();
    });



    return panel.wrap();

});