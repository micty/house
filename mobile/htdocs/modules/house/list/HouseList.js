define('/HouseList', function (require, module, exports) {
    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Header = module.require('Header');
    var List = module.require('List');

    var view = KISP.create('View', '#div-view-house-list');


    view.on('init', function () {

       
        List.on({
            'item': function (item) {
                view.fire('detail', [item]);
            },
        });

    });

    view.on('render', function (data) {




        Header.render(data);
        List.render(data.list);


    });


    view.on('show', function (byRender) {
        if (!byRender) { //说明是后退导致的
            List.show(); //强行触发 show 事件，以让 scroller 刷新。
        }
    });

  


    return view.wrap();


});


