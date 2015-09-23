/**
*
*/
define('/ProductList/Main/Scroller', function (require, module, exports) {
    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');


    var scroller = null;
    var panel = KISP.create('Panel');

    panel.on('init', function (div) {

        var Scroller = require('Scroller');


        scroller = new Scroller(div, {
            top: 114,
            bottom: 50,
        });

        scroller.pulldown({
            min: 25,
            max: 65,
            top: 114,
            load: function (fn) {
                panel.fire('reload', [fn]);
            },
        });

        scroller.pullup({
            min: 35,
            max: 45,
            bottom: 60,
            loadingBottom: 55,
            load: function (fn) {
                panel.fire('load-more', [fn]);
            },
        });

        scroller.on('pulldown', 'start', function () {
            panel.fire('pulldown');
        });


    });


    panel.on('render', function () {
        scroller.refresh();
    });


    panel.on('refresh', function (delay) {
        scroller && scroller.refresh(delay);
    });



    return panel.wrap({

        setLastPage: function (isLast) {
            scroller && scroller.setLastPage(isLast);
        },

        /**
        * 切换启用或禁用。
        */
        toggleEnable: function (enabled) {
            if (!scroller) {
                return;
            }

            if (enabled instanceof Array) {
                enabled = enabled.length > 0;
            }

            scroller.toggleEnable(enabled);
        },

        

    });



});