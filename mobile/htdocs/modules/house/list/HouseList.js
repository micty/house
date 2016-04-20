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

  


    return view.wrap();


});


