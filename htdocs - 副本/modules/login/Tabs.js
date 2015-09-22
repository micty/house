


//标签模块
define('Tabs', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KERP = require('KERP');

    var tabs = null;

    function init(index) {

        tabs = KERP.Tabs.create({
            container: '#li-tabs',
            selector: '>div',
            current: index,
            event: 'click',
            activedClass: 'hover',
            change: function (index) {
                console.log(index);
            }
        });

        tabs.on('change', function (index) {
            console.log('on: ', index);
        });

    }

    function current() {
        return tabs.current();
    }


    return {
        init: init,
        current: current
    };
});



