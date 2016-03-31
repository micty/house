

KISP.launch(function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    var Bridge = require('Bridge');

    var API = module.require('API');
    var Header = module.require('Header');
    var List = module.require('List');

    var type = Url.getQueryString(window, 'type');
    var currentIndex = -1;
    var mask = null;


    Header.on('add', function () {
        Bridge.open(['add', type], {
            'type': type,
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
 
            Bridge.open(['add', type], {
                'type': type,
                'id': item.id,
            });
        },
    });
    

  
    API.get(type);
    Header.render();
    
});
