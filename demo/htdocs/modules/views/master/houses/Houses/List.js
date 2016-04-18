

define('/Houses/List', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');


    var panel = KISP.create('Panel', '#ul-houses-list');

    //var list = [
    //    { name: '全部', src: 'style/img/houses-0.png', },
    //    { name: '祖庙', src: 'style/img/houses-1.png', },
    //    { name: '张槎', src: 'style/img/houses-2.png', },
    //    { name: '南庄', src: 'style/img/houses-3.png', },
    //    { name: '石湾', src: 'style/img/houses-4.png', },
    //];


    var list = [
        { name: '全部', src: 'style/img/houses-0.jpg', },
        { name: '祖庙', src: 'style/img/houses-1.jpg', },
        { name: '张槎', src: 'style/img/houses-2.jpg', },
        { name: '南庄', src: 'style/img/houses-3.jpg', },
        { name: '石湾', src: 'style/img/houses-4.jpg', },
    ];


    panel.on('init', function () {


        panel.$.on('click', '>li', function (event) {
            var li = this;
            var index = li.getAttribute('data-index');
            var item = list[index];

            panel.fire('click', [item, index]);
        });
    });


    panel.on('render', function () {

        panel.fill(list, function (item, index) {
            return {
                'index': index,
                'src': item.src,
            };
        });
    });



    return panel.wrap();


});