

//警告提示模块
define('WarnTip', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KERP = require('KERP');

    var div = document.getElementById('div-warn');
    var sample = $.String.between(div.innerHTML, '<!--', '-->');

    function show(msg, timeout) {

        div.innerHTML = $.String.format(sample, {
            content: msg
        });

        $(div).parent().removeClass('hidden');

        if (timeout) {
            setTimeout(function () {
                hide();
            }, timeout);
        }
    }


    function hide() {
        $(div).parent().addClass('hidden');
    }


    return {

        show: show,
        hide: hide
    };
});
