

define('Logs', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');


    var panel = KISP.create('Panel');
    var dialog = null;



    panel.on('init', function () {

        dialog = KISP.create('Dialog', {

            title: '处理结果',
            text: '<textarea readonly></textarea>',
            buttons: [
                { text: '确定', name: 'ok', },
            ],
            cssClass: 'dialog-Logs',
            height: 500,
            width: 900,
            autoClosed: true,
            'z-index': 9999,
        });

        dialog.on('show', function () {
            //让它出现在可视范围内。
            var h = top.document.body.scrollTop + 20;
            dialog.$.css('top', h);
        });



        dialog.on('button', 'ok', function () {

            var fn = dialog.data('ok');
            fn && fn();
        });

    

    });



    panel.on('render', function (data, fn) {

        if (Array.isArray(data)) {
            data = data.join('\n');
        }

        dialog.data('ok', fn);

        dialog.show();
        dialog.$.find('textarea').val(data);


    });





    return panel.wrap();

});