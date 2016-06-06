

define('/Construct/List', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');
    var Bridge = require('Bridge');


    var panel = KISP.create('Panel', '#ul-construct-list');
    var list = [];
    var template = null;

    panel.on('init', function () {

        panel.$.on('click', '[data-index]', function (event) {

            var btn = this;
            var index = btn.getAttribute('data-index');
            var cmd = btn.getAttribute('data-cmd');
            var item = list[index];

            Bridge.open({
                name: '建设许可详情',
                url: 'html/construct/detail/index.html?id=' + item.construct.id,
            });

        });


    });


    panel.on('render', function (data) {

        
        list = data;

        panel.fill(list, function (item, index) {


            return {
                'index': index,
                'title': item.construct.number,
                'number': item.land.number,
                'project': item.plan.project,
                'date': item.construct.datetime.split(' ')[0],
            };
        });



        var nodata = list.length == 0;
        panel.$.toggleClass('nodata', nodata);
        if (nodata) {
            //panel.$.html('<li class="nodata">暂无数据，<a>立即添加</a></li>');
        }

    });



    return panel.wrap();


});