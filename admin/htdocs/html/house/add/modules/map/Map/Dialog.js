

define('/Map/Dialog', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#div-panel-map');
    var dialog = null;
    var sample = '';

    panel.on('init', function () {

        sample = panel.$.html();
        sample = $.String.between(sample, '<!--dialog', 'dialog-->');


        dialog = KISP.create('Dialog', {

            title: '编辑地图',
            text: '',
            buttons: [
                { text: '取消', name: 'cancel', color: 'red', },
                { text: '确定', name: 'ok', },
            ],
            height: 260,
            width: 380,
            autoClosed: false,
            cssClass: 'dialog-map-edit',

        });

        dialog.on('show', function () {
            //让它出现在可视范围内。
            var div = dialog.$.get(0);
            div.style.top = top.document.body.scrollTop + 'px';
        });


        dialog.on('button', 'cancel', function () {
            dialog.hide();
        });


        dialog.on('button', 'ok', function () {

            var $ = dialog.$;

            var x = $.find('[data-name="x"]').val();
            var y = $.find('[data-name="y"]').val();

            if (x.indexOf(',') > 0) {
                var a = x.split(',');
                x = a[1].split(' ').join('');
                y = a[0].split(' ').join('');
            }


            if (!x) {
                top.KISP.alert('请输入经度');
                return;
            }
           
            if (!y) {
                top.KISP.alert('请输入纬度');
                return;
            }
            
            var title = $.find('[data-name="title"]').val();
            if (!title) {
                top.KISP.alert('请输入名称');
                return;
            }

            var content = $.find('[data-name="content"]').val();
           

            var data = {
                'x': x,
                'y': y,
                'title': title,
                'content': content,
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

            var $ = dialog.$;

            $.on('change', '[data-name="x"],[data-name="y"]', function () {

                var x = this.value;
                var y = '';


                var sep = x.indexOf(',') > 0 ? ',' :
                    x.indexOf('，') > 0 ? '，' : '';

                if (sep) {
                    var a = x.split(sep);
                    x = a[1].split(' ').join('');
                    y = a[0].split(' ').join('');
                }

                $.find('[data-name="x"]').val(x);
                $.find('[data-name="y"]').val(y);

            });
        });
   

    });



    panel.on('render', function (data) {

        data = data || {};

        var html = $.String.format(sample, {
            'x': data.x || '',
            'y': data.y || '',
            'title': data.title || '',
            'content': data.content || '',
        });

        dialog.set('text', html);
        dialog.show();

       
    });



    return panel.wrap();

});