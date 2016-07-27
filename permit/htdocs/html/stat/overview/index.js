

KISP.launch(function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');

    var API = module.require('API');
    var Formater = module.require('Formater');
    var Table = module.require('Table');
    var Header = module.require('Header');
    var Filter = module.require('Filter');

    API.on({
        'success': function (data) {
     
            data = Formater.format(data);

            Filter.render();
            Header.render();
            Table.render(data);
        },
    });

    Filter.on({
        //选择日期时
        'dates': function (begin, end) {
            API.post({
                'role': 'sale',
                'beginDate': begin,
                'endDate': end,
            });
        },
    });

    Header.on({
        'print': function () {
            //打印前先隐藏部分组件。
            Header.hide();
            Filter.set('print', true);

            //同步模式，打印窗口关闭后会有返回值。
            var obj = document.execCommand('print');
            if (obj) {
                Header.show();
                Filter.set('print', false);
            }
        },
    });

    API.post();

    
});
