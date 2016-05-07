﻿

KISP.launch(function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');

    var API = module.require('API');
    var Header = module.require('Header');
    var List = module.require('List');

    var currentIndex = -1;

    Header.on('add', function () {
        Bridge.open(['sale', 'add']);
    });

    API.on('success', {

        'get': function (data) {
            List.render(data);
        },

        'remove': function () {
            List.remove(currentIndex);
        },
    });

    List.on({

        'detail': function (item, index) {
            Bridge.open({
                name: '预售许可详情',
                url: 'html/sale/detail/index.html?id=' + item.id,
            });
        },

        'remove': function (item, index) {
            currentIndex = index;
            API.remove(item.id);
        },

        'edit': function (item, index) {
 
            Bridge.open(['sale', 'add'], {
                'id': item.id,
            });
        },
    });
    

  
    API.get();
    Header.render();
    
});
