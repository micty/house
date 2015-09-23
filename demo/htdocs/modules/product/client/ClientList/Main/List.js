

define('/ClientList/Main/List', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    

    var Template = KISP.require('Template');

    var ul = document.getElementById('ul-client-list');
    var panel = KISP.create('Panel', ul);
    var list = [];

    var tabs = null;

    panel.on('init', function () {


        tabs = KISP.create('Tabs', {
            container: ul,
            activedClass: 'chosed',
            repeated: true, //允许重复激活相同的项，否则再次进来时会无反应
        });

        

        //再绑定。 这样首次激活时才不会触发一次
        tabs.on('change', function (item, index) {

            //延迟触发，让视觉上有选中的效果
            setTimeout(function () {

                panel.fire('select', [item]);

            }, 200);
        });
  



    });




    panel.on('render', function (data) {


        list = data || [];


        if (list.length == 0) {
            panel.hide();
            return;
        }


        tabs.render(list, function (item, index) {

            return {
                'index': index,
                'name': item.name,
                'id': item.id,
            };
        });

        panel.fire('render');

    });







    panel.on('hide', function () {
        panel.fire('hide');
    });



    return panel.wrap();
   


});