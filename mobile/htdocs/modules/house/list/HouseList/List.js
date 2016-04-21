
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
            top: '0.97rem',
        });
        

        panel.$.touch({
            'li[data-index]': function () {

                
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
                'cover': item.cover,
                'name': item.name,
                'price': item.price,
                'address': item.address,
                'type': item.type,
                'phone': item.phone,
            };
        });


        //解析 innerHTML 需要时间，这里需要延迟一下
        scroller.refresh(200);

        //要重新绑定 img，因为 img 是动态创建的，
        //并且加载后滚动区高度发生了变化，要刷新滚动器
        panel.$.find('img').on('load', function () {
            scroller.refresh(200);
        });


    });


    panel.on('before-render', function () {
        panel.$.find('img').off('load');
    });

    panel.on('show', function (byRender) {
        if (!byRender) { //说明是后退导致的。
            scroller.refresh(200);
        }
    });

    return panel.wrap();


});


