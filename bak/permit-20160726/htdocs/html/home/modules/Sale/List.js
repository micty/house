

define('/Sale/List', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');
    var Bridge = require('Bridge');


    var panel = KISP.create('Panel', '#ul-sale-list');
    var list = [];
    var template = null;

    panel.on('init', function () {

        panel.$.on('click', '[data-index]', function (event) {

            var btn = this;
            var index = btn.getAttribute('data-index');
            var cmd = btn.getAttribute('data-cmd');
            var item = list[index];

            Bridge.open({
                name: '预售许可详情',
                url: 'html/sale/detail/index.html?id=' + item.sale.id,
            });

        });


    });


    panel.on('render', function (data) {

        
        list = data;

        panel.fill(list, function (item, index) {

            return {
                'index': index,
                'title': item.land.number,
                'project': item.plan.project,
                'location': item.sale.location,
                'date': item.sale.datetime.split(' ')[0],
            };
        });

        var nodata = list.length == 0;
        panel.$.toggleClass('nodata', nodata);
        

        var max = 0;
        panel.$.find('a').each(function () {
            var width = $(this).width();
            if (width > max) {
                max = width;
            }

        }).width(max + 1);

    });



    return panel.wrap();


});