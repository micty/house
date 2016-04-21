
define('/NewsList/Ads', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var panel = KISP.create('Panel', '#ul-news-list-ads');

    var list = [];

    panel.on('init', function () {

        panel.$.touch({
            '[data-index]': function () {

                var index = +this.getAttribute('data-index');
                var item = list[index];
                var cmd = item.cmd;

                if (cmd) {
                    panel.fire(cmd, [item.data]);
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
                'cover': item.cover,
            };
        });

    });


    return panel.wrap();


});


