/**
*
*/
define('/ClientList/Main/Loading', function (require, module, exports) {
    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Loading = KISP.require('Loading');

    var loading = KISP.create('Loading', {
        //background: 'none',
        //cssClass: 'same-line',
        //color: '#000',
        //'margin-top': -14,
        text: '加载中...',
    });


    return loading;

});