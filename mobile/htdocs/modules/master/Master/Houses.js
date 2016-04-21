
define('/Master/Houses', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var panel = KISP.create('Panel', '#ul-master-houses');
    var list = [];


    panel.on('init', function () {

        
        panel.$.touch({
            '[data-index]': function () {

                var index = +this.getAttribute('data-index');
                var item = list[index];

                panel.fire('item', [item, index]);

            },


            '[data-cmd="phone"]': function (event) {
                event.stopPropagation();
            },
        });
    });

    panel.on('render', function (data) {

        list = data;

        panel.fill(list, function (item, index) {

            return {
                'index': index,
                'belong': item.belong,
                'cover': item.cover,
                'name': item.name,
                'price': item.price,
                'address': item.address,
                'type': item.type,
                'phone': item.phone,
                'count': item.count,
            };
        });

    });

    panel.on('show', function () {



    });


    panel.on('hide', function () {

    });


    panel.on('refresh', function () {
     
    });



    return panel.wrap();


});


