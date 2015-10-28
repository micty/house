

KISP.launch(function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');

    

    var API = module.require('API');
    var Dialog = module.require('Dialog');
    var List = module.require('List');

    var mask = null;

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
           

            mask = mask || top.KISP.create('Mask');
            mask.show();

            var ok = confirm('【' + item.title + '】\n\n 确认要删除吗？');
            mask.hide();

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
