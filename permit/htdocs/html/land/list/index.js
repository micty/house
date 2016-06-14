

KISP.launch(function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');

    var API = module.require('API');
    var Header = module.require('Header');
    var List = module.require('List');
    var Tabs = module.require('Tabs');

    var currentIndex = -1;
    var current = null;


    Tabs.on('change', function (item) {
        List.render(current, item.key);
    });

    API.on('success', {
        'get': function (data) {
            current = data;
            Tabs.render(0);
        },
        'remove': function () {
            List.remove(currentIndex);
            Bridge.refresh(['plan', 'list']);
        },
    });




    Header.on('add', function () {
        Bridge.open(['land', 'add']);
    });


    List.on({

        'detail': function (item, index) {
            Bridge.open({
                name: '土地出让详情',
                url: 'html/land/detail/index.html?id=' + item.id,
            });
        },

        'remove': function (item, index) {
            currentIndex = index;
            API.remove(item.id);
        },

        'edit': function (item, index) {
 
            Bridge.open(['land', 'add'], {
                'id': item.id,
            });
        },
    });
    

  
    API.get();
    Header.render();
    
});
