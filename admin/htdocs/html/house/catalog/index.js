
KISP.launch(function (require, module) {
    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');


    var Bridge = require('Bridge');

    var API = module.require('API');
    var Dialog = module.require('Dialog');
    var List = module.require('List');

    var mask = null;





    API.on('success', {

        'get': function (list) {
            List.render(list);
        },

    });

    List.on({
        'edit': function (item, index) {
            Dialog.render(item);
        },
    });



    API.get();


});
