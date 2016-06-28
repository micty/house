

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
    var Header = module.require('Header');

    var current = null;
    var saleRows = null;


    API.on({
        'success': function (data) {
            current = data;
            Tabs.render(0);
        },
    });



    Tabs.on('change', function (item) {

        Header.render(item);

        var data = current;
        var key = item.key;

        data = Formater.format(data, key);
 
        Table.render(data);


        var rows = data.rows;
        if (key == 'land') {
            rows = rows.slice(1);
        }
     

        if (key == 'sale') {
            saleRows = rows;
            SaleTabs.render();
        }
        else {
            Chart.render(rows);
            SaleTabs.hide();
        }

    });



    SaleTabs.on('change', function (item, index) {

        var begin = index * 9;
        var end = begin + 9;

        var rows = saleRows.slice(begin, end);
        Chart.render(rows);

    });





    API.get();

    
});
