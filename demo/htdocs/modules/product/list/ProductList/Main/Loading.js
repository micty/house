/**
*
*/
define('/ProductList/Main/Loading', function (require, module, exports) {
    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Loading = KISP.require('Loading');


    var loading = null;
    var loading2 = null;



    return {

        show: function (needBackgroud) {

            if (needBackgroud) { //需要背景

                loading2 = loading2 || KISP.create('Loading', {
                    'margin-top': -14,
                    text: '加载中...',
                    mask: 0,

                });

                loading && loading.hide();
                loading2.show();
            }
            else {

                loading = loading || KISP.create('Loading', {
                    background: 'none',
                    cssClass: 'same-line',
                    color: '#000',
                    'margin-top': -14,
                    text: '加载中...',

                });

                loading2 && loading2.hide();
                loading.show();
            }

        },

        hide: function () {
            loading && loading.hide();
            loading2 && loading2.hide();
        }
    };


});