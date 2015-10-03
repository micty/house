

KISP.launch(function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    

    var API = module.require('API');
    var Dialog = module.require('Dialog');
    var List = module.require('List');

    var type = '';


    API.on('success', {

        'get': function (list) {
   
            List.render(list);
        },

        'remove': function (list) {
            List.render(list);
        },
        'post': function (list) {
            List.render(list);
        },
    });

    List.on({
        'remove': function (item, index) {
            var ok = confirm('您确认要删除 【' + item.title + '】 吗？');
            if (!ok) {
                return;
            }


            API.remove(item.id);
        },

        'edit': function (item, index) {
           
            Dialog.render(item);
        },
    });


    Dialog.on('submit', function (data) {
        
        API.post(data);

    });



    Dialog.render();

    API.get();

    
});
