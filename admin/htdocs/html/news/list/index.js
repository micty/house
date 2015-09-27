

KISP.launch(function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    

    var API = module.require('API');
    var List = module.require('List');

    var loading = KISP.create('Loading', {
        background: 'none',
        color: '#000',
        text: '加载中...',
        top: 10,
        height: 22,
        cssClass: 'same-line',
    });

    loading.show();



    API.on({
        'response': function () {
            loading.hide();
        },

        'success': function (data) {
            List.render(data);
        },
    });


    API.get();

    
});
