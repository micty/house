

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
    var Header = module.require('Header');

    var current = null;
    var type = Url.getQueryString(window, 'type') || '';


    API.on({
        'success': function (data) {
            current = data;

            Tabs.render();
        },
    });



    Tabs.on('change', function (item) {

        Header.render(item);

        var data = current;
        data = Formater.format(data, item.key);


        switch (type) {

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



    API.get();

    
});
