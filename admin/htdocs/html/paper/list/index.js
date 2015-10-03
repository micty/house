

KISP.launch(function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    

    var API = module.require('API');
    var List = module.require('List');

    var type = '';
    var currentIndex = -1;


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
            var ok = confirm('您确认要删除 【' + item.title + '】 吗？');
            if (!ok) {
                return;
            }

            currentIndex = index;
            API.remove(type, item.id);
        },

        'edit': function (item, index) {
            var KERP = require('KERP');
            var Iframe = KERP.require('Iframe');
 
            Iframe.open('add', type, {
                query: {
                    'type': type,
                    'id': item.id,
                },
            });
        },
    });
    

    type = Url.getQueryString(window, 'type');
    API.get(type);

    
});
