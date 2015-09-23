/**
*
*/
define('/Login/Loading', function (require, module, exports) {

    var $ = require('$');
    var KISP = require('KISP');
    var MiniQuery = KISP.require('MiniQuery');



    var loading = KISP.create('Loading', {
        text: '初始化...',
        //background: 'rgba(0, 0, 0, 0.6)',
        'z-index': 9999,
        //presetting: 'fullscreen',
        //cssClass: 'same-line',
        mask: 0,
    });

    return loading;


});