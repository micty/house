

KISP.launch(function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Bridge = require('Bridge');


    var API = module.require('API');
    var List = module.require('List');

    Bridge.on({
        'before-close': function () {
            console.log('prize');
            debugger;
        },
    });



    API.on({
      
        'success': function (data) {
            List.render(data);
        },
    });



    API.get();

    
});
