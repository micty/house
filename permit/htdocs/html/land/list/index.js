
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
    var Pager = module.require('Pager');


    Tabs.on('change', function (item) {
        API.get({
            'pageNo': 1,
            'town': item.key,
        });
    });

    API.on('success', {
        'get': function (list, page) {
         
            List.render(list);

            if (page.no == 1) {   //翻页引起的，不需要重新渲染。
                Pager.render(page);
            }
        },
        'remove': function () {
            Bridge.refresh(['plan', 'list']);
            API.get(1);
        },
    });


    Header.on('add', function () {
        Bridge.open(['land', 'add']);
    });


    List.on({
        'detail': function (item) {
            Bridge.open({
                name: '土地出让详情',
                url: 'html/land/detail/index.html?id=' + item.id,
            });
        },

        'remove': function (item) {
            API.remove(item.id);
        },

        'edit': function (item) {
 
            Bridge.open(['land', 'add'], {
                'id': item.id,
            });
        },
    });

    Pager.on({
        'change': function (no) {
            API.get(no);
        },
    });


    Bridge.on({
        'search': function (keyword) {
            API.get(keyword);
        },
    });
    

    Header.render();
    Tabs.render(0);
    
});
