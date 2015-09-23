

define('/Master/Footer', function (require, module, exports) {
    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');


    var tabs = null;

    var list = [
        { text: '商品', cssClass: 'main', },
        { text: '订单', cssClass: 'cart', },
        { text: '名片', cssClass: 'person', },
    ];


    function create() {
        return tabs || KISP.create('Tabs', {
            container: '#footer-master-tabs',
            activedClass: 'on',
            pressedClass: 'pressed',
            repeated: true,
        });
    }

    

    function render() {

        tabs = create();
        tabs.render(list);
    }


    return {
        render: render,
        active: function (index) {
            tabs.active(index);
        },

        on: function () {
            tabs = create();
            var args = [].slice.call(arguments);
            tabs.on.apply(tabs, args);
        },
    }

});


