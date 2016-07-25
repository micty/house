

KISP.launch(function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');

    var API = module.require('API');
    var Chart = module.require('Chart');
    var Formater = module.require('Formater');
    var Table = module.require('Table');
    var Tabs = module.require('Tabs');
    var Title = module.require('Title');
    var Filter = module.require('Filter');
    var Header = module.require('Header');

    var current = null;
    var qs = Url.getQueryString(window);


    API.on({
        'success': function (data) {
            current = data;
            Header.render();
            Filter.render();
            Tabs.render();
        },
    });



    Tabs.on('change', function (item) {

        Title.render(item);

        var data = current;
        data = Formater.format(data, item.key);


        switch (qs.type) {

            case 'table':
                Chart.hide();
                Table.render(data);
                break;

            case 'chart':
                Table.hide();
                Chart.render(data.rows);
                break;

            default:
                Table.render(data);
                Chart.render(data.rows);
                break;
        }
        
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
            Tabs.hide();
            Filter.set('print', true);

            //同步模式，打印窗口关闭后会有返回值。
            var obj = document.execCommand('print');
            if (obj) {
                Header.show();
                Tabs.show();
                Filter.set('print', false);
            }
        },
    });


    API.post();

    
});
