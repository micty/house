define('/HouseList', function (require, module, exports) {
    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');
    var Scroller = require('Scroller');

    var view = KISP.create('View', '#div-view-house-list');
    var scroller = null;

    view.on('init', function () {

        scroller = new Scroller(view.$.get(0));
        


    });

    view.on('render', function (index) {

        scroller.refresh(200);


    });

    view.on('show', function (byRender) {



    });


    view.on('hide', function () {

    });


    view.on('refresh', function () {
     
    });


    return view.wrap();


});


