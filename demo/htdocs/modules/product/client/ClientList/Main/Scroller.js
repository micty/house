/**
*
*/
define('/ClientList/Main/Scroller', function (require, module, exports) {
    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Scroller = require('Scroller');

    var panel = KISP.create('Panel');
    var scroller = null;



    panel.on('init', function (div) {

        scroller = new Scroller(div, {
            top: 45,
        });
    });


    panel.on('render', function (div) {

        scroller.pulldown({
            min: 25,
            max: 65,
            top: 50,
            load: function (fn) {
                panel.fire('reload', [fn]);
            },
        });

        scroller.pullup({
            min: 30,
            max: 45,
            bottom: 12,
            loadingBottom: 12,
            load: function (fn) {
                panel.fire('load-more', [fn]);
            },
        });

        scroller.on('pulldown', 'start', function () {
            panel.fire('pulldown');
        });

    });


    panel.on('refresh', function (delay) {
        scroller && scroller.refresh(delay);
    });


    return panel.wrap({

        setLastPage: function (isLast) {
            scroller && scroller.setLastPage(isLast);
        },

    });



});