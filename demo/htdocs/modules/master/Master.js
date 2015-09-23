define('/Master', function (require, module, exports) {
    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Footer = require(module, 'Footer');

    var view = KISP.create('View', '#div-view-master');
    var current = null;
    var currentIndex = -1;


    view.on('init', function () {

        Footer.on('before-change', function (item, index, data) {
            view.fire('hide-all');
        });

        Footer.on('change', function (item, index, data) {

            currentIndex = index;
            current = item;
 
            view.fire('change', index, [item, index, data]);
            view.fire('change', [item, index, data]);

        });


    });

    view.on('render', function (index) {

        currentIndex = index;
        Footer.render();
    });

    //后退时也会触发本事件，需要还原现象
    view.on('show', function () {

        Footer.active(currentIndex);


    });


    view.on('hide', function () {
        view.fire('hide-all');
    });

    view.on('refresh', function () {
     
    });


   

    return view.wrap();


});


