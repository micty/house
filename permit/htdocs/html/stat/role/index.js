

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
    var SaleTabs = module.require('SaleTabs');
    var Title = module.require('Title');
    var Filter = module.require('Filter');
    var Header = module.require('Header');


    var saleRows = null;
    var type = Url.getQueryString(window, 'type') || '';
    var role = '';

    API.on({
        'success': function (data) {
            data = Formater.format(data, role);

            if (type == 'table') {
                Table.render(data);
            }
            else {
                Table.hide();
            }


            var rows = data.rows;
            if (role == 'land') {
                rows = rows.slice(1);
            }


            if (role == 'sale') {
                if (type == 'chart') {
                    saleRows = rows;
                    SaleTabs.render();
                }
                else {
                    SaleTabs.hide();
                }
            }
            else {
                SaleTabs.hide();

                if (type == 'chart') {
                    Chart.render(rows);
                }
                else {
                    Chart.hide();
                }
            }

        },
    });



    Tabs.on('change', function (item) {

        role = item.key;

        Header.render();
        Filter.render(item);
        Title.render(item);

        API.post({ 'role': role, });

    });



    SaleTabs.on('change', function (item, index) {

        var begin = index * 9;
        var end = begin + 9;

        var rows = saleRows.slice(begin, end);
        Chart.render(rows);

    });




    Filter.on({
        //选择日期时
        'dates': function (begin, end) {
            API.post({
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


    Tabs.render();

    
});
