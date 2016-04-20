
define('/HouseList/List', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Scroller = require('Scroller');


    var ul = document.getElementById('ul-house-list-items');
    var panel = KISP.create('Panel', ul);
    var list = [];
    var scroller = null;


    panel.on('init', function () {

        scroller = new Scroller(ul.parentNode, {
            top: '1.12rem',
        });
        

        panel.$.touch({
            'li[data-index]': function () {

                
                var index = +this.getAttribute('data-index');
                var item = list[index];

                panel.fire('item', [item, index]);

            },
        });
    });



    panel.on('render', function (data) {

        list = data;

        panel.fill(list, function (item, index) {

            return {
                'index': index,
                'cover': item.cover,
                'name': item.name,
                'price': item.price,
                'address': item.address,
                'type': item.type,
                'phone': item.phone,
            };
        });


        scroller.refresh(200);


    });


    return panel.wrap();


});


