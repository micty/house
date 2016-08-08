

define('/Plan/List', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');
    var Bridge = require('Bridge');


    var panel = KISP.create('Panel', '#ul-plan-list');
    var list = [];
    var template = null;

    panel.on('init', function () {

        panel.$.on('click', '[data-index]', function (event) {

            var btn = this;
            var index = btn.getAttribute('data-index');
            var cmd = btn.getAttribute('data-cmd');
            var item = list[index];

            Bridge.open({
                name: '规划许可详情',
                url: 'html/plan/detail/index.html?id=' + item.id,
            });

        });


    });


    panel.on('render', function (data) {

        
        list = data;

        panel.fill(list, function (item, index) {

   
            return {
                'index': index,
                'number': item.land.number,
                'title': item.plan.project,
                'location': item.land.location,
                'count': item.license,
                'date': item.plan.datetime.split(' ')[0],
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
        panel.$.find('.land-number').each(function () {
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