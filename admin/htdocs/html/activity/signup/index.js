

KISP.launch(function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    
    var Bridge = require('Bridge');
    var API = module.require('API');
    var List = module.require('List');



    Bridge.on({
        'close': function () {
            //console.log('signup');
            //var ok = confirm('确认要关闭该页吗？');
            //return ok;
        },
    });



    API.on({
      
        'success': function (data) {
            List.render(data);
        },
    });



    API.get();

    
});
