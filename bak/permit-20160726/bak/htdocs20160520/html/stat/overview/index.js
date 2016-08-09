

KISP.launch(function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');
    var NumberField = require('NumberField');

    var v = NumberField.get(12345678);
    v = NumberField.get(96666);
    console.log(v);

    var API = module.require('API');
    var Formater = module.require('Formater');
    var Table = module.require('Table');

    API.on({
        'success': function (data) {
     
            data = Formater.format(data);

            Table.render(data);
        },
    });

    API.get();

    
});
