

KISP.launch(function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var KERP = require('KERP');
    var Iframe = KERP.require('Iframe');

    var API = module.require('API');
    var Header = module.require('Header');
    var List = module.require('List');

    var type = Url.getQueryString(window, 'type');
    var currentIndex = -1;
    var mask = null;


    Header.on('add', function () {
        Iframe.open('add', type, {
            query: {
                'type': type,
            },
        });
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
        'remove': function (item, index) {

            mask = mask || top.KISP.create('Mask');
            mask.show();

            var ok = confirm('【' + item.title + '】\n\n 确认要删除吗？');
            mask.hide();

            if (!ok) {
                return;
            }

            currentIndex = index;
            API.remove(type, item.id);
        },

        'edit': function (item, index) {
 
            Iframe.open('add', type, {
                query: {
                    'type': type,
                    'id': item.id,
                },
            });
        },
    });
    

  
    API.get(type);
    Header.render();
    
});
