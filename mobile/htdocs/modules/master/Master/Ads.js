
define('/Master/Ads', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');

    var Slider = window.iSlider;


    var panel = KISP.create('Panel', '#div-master-ads-slider');
    var slider = null;
    var list = [];
    var currentIndex = 0;


    panel.on('init', function () {

        panel.$.touch({
            '.islider-active': function () {

                var index = currentIndex;
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


        slider = new Slider({
            dom: panel.$.get(0),
            data: [{}],             //初始时必须至少有一项。
            animateTime: 800,       // ms
            plugins: ['dot', ],
        });

        slider.on('slide', function (event) {
            event.cancelBubble = true;
        });

        slider.on('slideChange', function (index, el) {
            currentIndex = index;
        });

    });


    panel.on('render', function (data) {

        list = data;

        var items = $.Array.keep(list, function (item) {
            return {
                'content': item.src,
            };
        });

        slider.loadData(items);
        

    });

   

    return panel.wrap();


});


