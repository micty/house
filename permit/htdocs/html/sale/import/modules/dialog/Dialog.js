

define('/Dialog', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Logs = require('Logs');

    var Excel = module.require('Excel');


    var panel = KISP.create('Panel', '#div-dialog');
    var dialog = null;
    var toast = null;


    panel.on('init', function () {

        var sample = panel.$.html();
        sample = $.String.between(sample, '<!--', '-->');


        dialog = KISP.create('Dialog', {

            title: '导入销售记录',
            text: sample,
            buttons: [
                { text: '清空', name: 'clear', color: 'green', },
                { text: '取消', name: 'cancel', color: 'red', },
                { text: '确定', name: 'ok', },
            ],

            height: 560,
            width: 700,
            autoClosed: false,
            cssClass: 'dialog-add',
        });

        dialog.on('show', function () {
            //让它出现在可视范围内。
            var h = top.document.body.scrollTop + 20;
            dialog.$.css('top', h);
        });


        dialog.on('button', 'clear', function () {
            dialog.$.find('textarea').val('');
        });

        dialog.on('button', 'cancel', function () {
            dialog.hide();
        });


        dialog.on('button', 'ok', function () {


            var type = dialog.$.find('[name="type"]').val();
            if (!type) {
                toast = toast || top.KISP.create('Toast', {
                    icon: 'remove',
                    text: '请选择类型',
                    duration: 1500,
                    mask: 0.25,
                });
                toast.show();

                return;
            }


            var content = dialog.$.find('textarea').val();

            var data = Excel.parse(type, content);

            if (typeof data == 'string') {
                top.KISP.alert(data);
                return;
            }


            var msgs = data.msgs;
            if (msgs.length > 0) {
                Logs.render(msgs);
                return;
            }
          
            var list = data.list;
         
            panel.fire('submit', [type, list]);
            dialog.hide();

        });

       

    });



    panel.on('render', function () {


        dialog.show();

        dialog.$.find('[name="type"]').val('');

    });







    return panel.wrap();

});