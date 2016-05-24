

KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Bridge = require('Bridge');
    var SessionStorage = require('SessionStorage');


    var API = module.require('API');
    var Form = module.require('Form');
    var Header = module.require('Header');
    var Router = module.require('Router');

    var current = null;



    API.on('success', {

        'post': function (data, json) {
            Bridge.close();
            Bridge.refresh(['sale', 'list']);

            Bridge.open(['sale', 'add'], {
                'id': current.saleId,
            });
        },

        'get': function (data) {
            current = data;

            Header.render(data);
            Form.render(data);
        },

    });



    Header.on('submit', function () {

        var data = Form.get(current);
        API.post(data);
    });



    Router.on({

        'render': function (data) {
            current = data;
        },

        'new': function (data) {
            Header.render(data);
            Form.render(data);
        },

        'edit': function (data) {
            API.get(data.id);
        },
    });


    Router.render();

});
