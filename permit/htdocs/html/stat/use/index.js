

KISP.launch(function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');

    var API = module.require('API');
    var Formater = module.require('Formater');
    var Table = module.require('Table');
    var Tabs = module.require('Tabs');
    var Header = module.require('Header');

    var current = null;


    API.on({
        'success': function (data) {
            current = data;

            Tabs.render();
        },
    });



    Tabs.on('change', function (town) {

        Header.render(town);

        var data = current;
        data = Formater.format(data, town.key);

        Table.render(data);

    });



    API.get();

    
});
