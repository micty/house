define('/Master', function (require, module, exports) {
    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Scroller = require('Scroller');

    var API = module.require('API');
    var Houses = module.require('Houses');


    var view = KISP.create('View', '#div-view-master');
    var scroller = null;

    view.on('init', function () {

        scroller = new Scroller(view.$.get(0));
        
        view.$.touch({
            '[data-cmd="news"]': function () {
                view.fire('news', []);
            },
        });

        Houses.on({
            'item': function (item) {
                view.fire('houses', [item]);
            },
        });

        API.on('success', function (data) {
           
            Houses.render(data);
            scroller.refresh(500);

        });
        
    });


    view.on('render', function (index) {

        API.get();


    });



    return view.wrap();


});


