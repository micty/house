
define('/NewsList/List', function (require, module, exports) {

    var $ = require('$');
    var MiniQuery = require('MiniQuery');
    var KISP = require('KISP');




    var ul = document.getElementById('ul-news-list-items');
    var panel = KISP.create('Panel', ul);
    var list = [];


    panel.on('init', function () {

        panel.$.touch({
            'li[data-index]': function () {
                
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
                'cover': item.cover,
                'title': item.title,
                'desc': item.desc,
            };
        });



    });


    return panel.wrap();


});


