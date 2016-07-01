

define('/Land/List', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');
    var Bridge = require('Bridge');


    var panel = KISP.create('Panel', '#ul-land-list');
    var list = [];
    var template = null;

    panel.on('init', function () {

        panel.$.on('click', '[data-index]', function (event) {

            var btn = this;
            var index = btn.getAttribute('data-index');
            var cmd = btn.getAttribute('data-cmd');
            var item = list[index];

            Bridge.open({
                name: '土地出让详情',
                url: 'html/land/detail/index.html?id=' + item.id,
            });

        });


    });


    panel.on('render', function (data) {

        
        list = data;

        panel.fill(list, function (item, index) {

            return {
                'index': index,
                'title': item.number,
                'location': item.location,
                'winner': item.winner.split('、')[0],
                'date': item.datetime.split(' ')[0],
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


        var max = 0;
        panel.$.find('.sub').each(function () {
            var width = $(this).width();
            if (width > max) {
                max = width;
            }

        }).width(max + 1);

    });



    return panel.wrap();


});