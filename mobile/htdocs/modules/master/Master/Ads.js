
define('/Master/Ads', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var panel = KISP.create('Panel', '#ul-master-ads');
    var list = [];


    panel.on('init', function () {

        panel.$.touch({
            '[data-index]': function () {

                var index = +this.getAttribute('data-index');
                var item = list[index];
                var url = item.url;

                if (url) {
                    panel.fire('url', [item.url]);
                }
                else {
                    panel.fire('detail', [item]);
                }
            },
        });
    });

    panel.on('render', function (data) {

        list = data;

        panel.fill(list, function (item, index) {

            return {
                'index': index,
                'src': item.src,
            };
        });

    });

   

    return panel.wrap();


});


