

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

            title: '添加/编辑楼盘推荐',
            text: html,
            buttons: [
                { text: '取消', name: 'cancel', color: 'red', },
                { text: '确定', name: 'ok', },
            ],
            height: 450,
            width: 660,
            
            autoClosed: false,
            cssClass: 'dialog-add',
            //mask: 0,

        });

   

        dialog.on('show', function () {
            var cmd = current ? '编辑' : '添加';
            var title = cmd + '楼盘推荐';

            dialog.$.find('header').html(title);
        });


        dialog.on('click', 'button', 'cancel', function () {
            dialog.hide();
        });


        dialog.on('click', 'button', 'ok', function () {
            
            var $ = dialog.$;

            var belong = $.find('[data-name="belong"]').val();
            if (!belong) {
                KISP.alert('请输入归属地');
                return;
            }

            var name = $.find('[data-name="name"]').val();
            if (!name) {
                KISP.alert('请输入楼盘名称');
                return;
            }

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

            var fields = $.find('[data-field]').toArray();
            fields = KISP.require('$').Array.keep(fields, function (txt, index) {
                var name = txt.getAttribute('data-field');
                var value = txt.value;

                return {
                    'name': name,
                    'value': value,
                };

            });

            var data = {
                'id': current ? current.id : null,
                'belong': belong,
                'name': name,
                'src': src,
                'href': href,
                'priority': priority,
                'fields': fields,
            };

            panel.fire('submit', [data]);
            dialog.hide();
            reset();

        });


        panel.$.on('click', 'button', function () {

            dialog.show();
        });
 

    });


    //清空上次的内容
    function reset() {
        var $ = dialog.$;
        $.find('[data-name="name"]').val('');
        $.find('[data-name="src"]').val('');
        $.find('[data-name="href"]').val('');
        $.find('[data-name="priority"]').val('');


        $.find('[data-field]').each(function (index) {

            var txt = this;
            txt.value = '';
        });

        current = null;
    }


  

    panel.on('init', function () {

        var hasBind = false;

        dialog.on('show', function () {
            if (hasBind) {
                return;
            }

            hasBind = true;

            var img = dialog.$.find('img');

            dialog.$.on('change', '[data-name="src"]', function () {

                var txt = this;
                img.attr('src', txt.value).show();
            });

            img.on('error', function () {
                img.hide();
            });

        });
        
    });

    panel.on('init', function () {

        dialog.on('show', function () {
            var item = current;
            if (!item) {
                return;
            }

            var $ = dialog.$;
            $.find('[data-name="belong"]').val(item.belong);
            $.find('[data-name="name"]').val(item.name);
            $.find('[data-name="src"]').val(item.src);
            $.find('[data-name="href"]').val(item.href);
            $.find('[data-name="priority"]').val(item.priority);

            var fields = item.fields;
            KISP.require('$').Array.each(fields, function (item, index) {

                var name = item.name;
                var value = item.value;

                $.find('[data-field="' + name + '"]').val(value);


            });
        });

    });


    panel.on('render', function (item) {


        if (item) {
            current = item;
            dialog.show();
        }

    });



    return panel.wrap();



});