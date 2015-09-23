

define('/ProductList/Main/List', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    

    var Template = KISP.require('Template');

    var ul = document.getElementById('ul-product-list');
    var list = [];

    var panel = KISP.create('Panel', ul, {
        showAfterRender: false,
    });

    panel.on('init', function () {

        var $ = KISP.require('jquery-plugin/touch');

    

        panel.$.touch({

            '[data-cmd="cart"]': function (event) {
                var btn = this;
                var index = btn.getAttribute('data-index');
                var item = list[index];

                debugger;

                panel.fire('add-cart', [item]);

            },
        });



    });




    panel.on('render', function (data) {

        data = data || list;
        list = data;

        if (list.length == 0) {
            panel.hide();
            return;
        }

        Template.fill(ul, list, function (item, index) {

            return {
                'index': index,
                'name': item['name'],
                'price': item['price'],
                'count': item['count'],
                'unit': item['unit'],
                'img': item['img'],
            };
        });

        panel.show();

    });


    panel.on('after-render', function () {
      
        panel.fire('render');

    });


    panel.on('hide', function () {
        panel.fire('hide');
    });



    return panel.wrap();
   


});