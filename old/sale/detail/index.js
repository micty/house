

KISP.launch(function (require, module) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Bridge = require('Bridge');

    var Url = MiniQuery.require('Url');

    
    var API = module.require('API');
    var Form = module.require('Form');
    var Header = module.require('Header');


    API.on('success', {
        'get': function (data) {
            Form.render(data);
            Header.render();
        },

    });


    Header.on('submit', function () {
        Bridge.open(['sale', 'add'], {
            'id': id,
        });
    });




    var qs = Url.getQueryString(window);
    var id = qs.id;

    if (!id) {
        KISP.alert('请传入 id');
        return;
    }

    API.get(id);


});
