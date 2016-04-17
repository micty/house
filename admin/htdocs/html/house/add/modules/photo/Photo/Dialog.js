

define('/Photo/Dialog', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-photo-header');
    var dialog = null;
    var current = null; //外面传进来的数据。
    var sample = '';    //html 模板 。
    var isNew = false;  //记录操作类型是添加还是编辑。

    panel.on('init', function () {

        sample = panel.$.html();
        sample = $.String.between(sample, '<!--dialog', 'dialog-->');


        dialog = KISP.create('Dialog', {

            title: '添加/编辑图片',
            text: '',
            buttons: [
                { text: '取消', name: 'cancel', color: 'red', },
                { text: '确定', name: 'ok', },
            ],
            height: 573,
            width: 600,
            autoClosed: false,
            cssClass: 'dialog-photo-add',
            //mask: 0,

        });

        dialog.on('show', function () {
            var cmd = isNew ? '添加' : '编辑';
            var title = cmd + '图片';

            dialog.$.find('header').html(title);

            //让它出现在可视范围内。
            var div = dialog.$.get(0);
            div.style.top = top.document.body.scrollTop + 'px';
        });


        dialog.on('button', 'cancel', function () {
            dialog.hide();
        });


        dialog.on('button', 'ok', function () {

            var $ = dialog.$;

            var src = $.find('[data-name="src"]').val();
            if (!src) {
                top.KISP.alert('请输入图片地址');
                return;
            }

            var desc = $.find('[data-name="desc"]').val();
            var data = {
                'album': isNew ? current : current.album,
                'url': src,
                'desc': desc,
            };

            var action = isNew ? 'add' : 'edit';
            panel.fire('submit', action, [data]);

            dialog.hide();

        });


        var hasBind = false;
        dialog.on('show', function () {

            if (hasBind) {
                return;
            }

            hasBind = true;

            dialog.$.on('change', '[data-name="src"]', function () {
                var src = this.value;
                dialog.$.find('[data-name="photo"]').attr('src', src);

            });
        });
   

    });



    panel.on('render', function (data) {

        current = data;
        isNew = typeof data == 'string';

        var item = isNew ? {} : data;

        var html = $.String.format(sample, {
            'url': item.url || '',
            'desc': item.desc || '',
        });


        dialog.set('text', html);
        dialog.show();

       
    });



    return panel.wrap();

});