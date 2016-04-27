
define('/Master/Menus', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var panel = KISP.create('Panel', '#ul-master-menus');


    var list = [];


    panel.on('init', function () {

        
        panel.$.touch({
            '[data-index]': function () {

                var index = +this.getAttribute('data-index');
                var item = list[index];
                var cmd = item.cmd;

                if (cmd) {
                    panel.fire('cmd', [cmd, item.data]);
                }
                else {
                    panel.fire('url', [item.url]);
                }

            },
        });
    });

    panel.on('render', function (data) {

        list = data;

        panel.fill(list, function (item, index) {

            return {
                'index': index,
                'text': item.text,
                'icon': item.icon,
                'width': item.width / 200,
            };
        });

    });

   

    return panel.wrap();


});


