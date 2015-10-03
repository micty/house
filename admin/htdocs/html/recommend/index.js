

KISP.launch(function (require, module) {


    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Url = MiniQuery.require('Url');



    var API = module.require('API');
    var Dialog = module.require('Dialog');
    var List = module.require('List');
    var Tabs = module.require('Tabs');




    Tabs.on({
        'change': function (group) {
            List.render(group.items);
        },
    });


    API.on('success', {

        'get': function (list) {

            if (list.length == 0) {
                List.render(list);
            }

            Tabs.render(list);



        },

        'remove': function (list) {
            Tabs.render(list);
            //List.render(list);
        },

        'post': function (list) {
            Tabs.render(list);
            //List.render(list);
        },
    });

    List.on({
        'remove': function (item, index) {
            var ok = confirm('您确认要删除 【' + item.name + '】 吗？');
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
