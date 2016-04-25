

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

            title: '编辑移动端动态资讯',
            text: '',
            buttons: [
                { text: '取消', name: 'cancel', color: 'red', },
                { text: '确定', name: 'ok', },
            ],
            height: 400,
            width: 550,
            autoClosed: false,
            cssClass: 'dialog-add',
        });

        dialog.on('show', function () {

            var title = current ? '编辑移动端动态资讯' : '添加移动动态资讯';
            dialog.$.find('header').html(title);

            //新建
            if (!current) {
                var src = KISP.require('Url').root() + 'style/img/no-pic.png';
                dialog.$.find('img').attr('src', src);
            }


            //让它出现在可视范围内。
            var div = dialog.$.get(0);
            div.style.top = top.document.body.scrollTop + 20 + 'px';
        });


        dialog.on('button', 'cancel', function () {
            dialog.hide();
        });


        dialog.on('button', 'ok', function () {

            var $ = dialog.$;


            var cover = $.find('[data-name="cover"]').val();
            if (!cover) {
                top.KISP.alert('请输入封面图片地址');
                return;
            }

            var data = {
                'id': current ? current.id : '',
                'cover': cover,
                'title': $.find('[data-name="title"]').val(),
                'desc': $.find('[data-name="desc"]').val(),
                'url': $.find('[data-name="url"]').val(),
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


        var html = $.String.format(sample, data || {
            'title': '',
            'desc': '',
            'url': '',
            'cover': '',
        });

        dialog.set('text', html);
        dialog.show();

       
    });



    return panel.wrap();

});