

KISP.launch(function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    

    var API = module.require('API');
    var List = module.require('List');

 

    API.on({
        'response': function () {
            
        },

        'success': function (data) {
            List.render(data);
        },
    });


    API.get();

    
});
