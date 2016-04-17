

define('/List', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');
    var MiniQuery = require('MiniQuery');
    var Url = MiniQuery.require('Url');

    var panel = KISP.create('Panel', '#ul-items');
    var list = [];

    var baseUrl = KISP.data('demo').url;



    panel.on('init', function () {

       


        panel.$.on('click', '[data-cmd]', function (event) {

            var btn = this;
            var index = btn.getAttribute('data-index');
            var cmd = btn.getAttribute('data-cmd');
            var item = list[index];

            panel.fire(cmd, [item, index]);

        });

    });


    panel.on('render', function (data) {

        list = data;
  
        panel.fill(list, function (item, index) {


            var href = Url.addQueryString(baseUrl, {
                type: 'house2',
                id: item.id,
            });

            return {
                'index': index,
                'cover': item.cover,
                'name': item.name,
                'address': item.address,
                'type': item.type,
                'price': item.price,
                'phone': item.phone,
                'href': href,
            };
        });


        if (list.length == 0) {
            panel.$.addClass('nodata');
            panel.$.html('<li>暂无数据</li>');
        }
        else {
            panel.$.removeClass('nodata');
        }

    });



    return panel.wrap();


});