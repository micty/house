
define('/Master/Ads', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var panel = KISP.create('Panel', '#ul-master-ads');


    var list = [
        {
            src: 'style/img/ad-828.png',
            type: 'news',
            id: '073007BAD193',
        },
    ];



    panel.on('init', function () {

        
        panel.$.touch({
            '[data-index]': function () {

                var index = +this.getAttribute('data-index');
                var item = list[index];
                
                panel.fire('item', [item]);
            },
        });
    });

    panel.on('render', function (data) {

        //list = data;

        panel.fill(list, function (item, index) {

            return {
                'index': index,
                'src': item.src,
            };
        });

    });

   

    return panel.wrap();


});


