﻿

define('/Dialog', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-header');
    var dialog = null;

    var current = null; //外面传进来的数据

    panel.on('init', function () {

        var html = panel.$.html();
        html = $.String.between(html, '<!--', '-->');

        dialog = KISP.create('Dialog', {

            title: '添加/编辑焦点图片',
            text: html,
            buttons: [
                { text: '取消', name: 'cancel', color: 'red', },
                { text: '确定', name: 'ok', },
            ],
            height: 260,
            width: 580,
            autoClosed: false,
            cssClass: 'dialog-add',
            //mask: 0,

        });

        //清空上次的内容
        dialog.on('hide', function () {
            var $ = dialog.$;
            $.find('[data-name="src"]').val('');
            $.find('[data-name="href"]').val('');
            $.find('[data-name="priority"]').val('');

            current = null;
        });

        dialog.on('show', function () {
            var cmd = current ? '编辑' : '添加';
            var title = cmd + '焦点图片';

            dialog.$.find('header').html(title);
        });


        dialog.on('click', 'button', 'cancel', function () {
            dialog.hide();
        });


        dialog.on('click', 'button', 'ok', function () {
            
            var $ = dialog.$;

            var src = $.find('[data-name="src"]').val();
            if (!src) {
                KISP.alert('请输入图片地址');
                return;
            }
            var href = $.find('[data-name="href"]').val();
            if (!href) {
                KISP.alert('请输入链接');
                return;
            }

            var priority = $.find('[data-name="priority"]').val();

            var isNumber = (/^\d+$/).test(priority);
            if (!isNumber) {
                KISP.alert('优先级必须为一个整数');
                return;
            }

            var data = {
                'id': current ? current.id : null,
                'src': src,
                'href': href,
                'priority': priority,
            };



            panel.fire('submit', [data]);

            dialog.hide();

        });


        panel.$.on('click', 'button', function () {

            dialog.show();
        });
 

    });



    panel.on('render', function (item) {

        if (item) {

            current = item;
            dialog.show();

            var $ = dialog.$;
            $.find('[data-name="src"]').val(item.src);
            $.find('[data-name="href"]').val(item.href);
            $.find('[data-name="priority"]').val(item.priority);
        }

    });



    return panel.wrap();



});