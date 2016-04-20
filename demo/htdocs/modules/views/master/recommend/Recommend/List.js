

define('/Recommend/List', function (require, module) {


    var $ = require('$');
    var KISP = require('KISP');
    var MiniQuery = require('MiniQuery');
    var Url = MiniQuery.require('Url');



    var panel = KISP.create('Panel', '#ul-recommend-items');
    var list = [];

    panel.on('init', function () {

      


    });


    panel.on('render', function (data) {
        list = data;


        panel.fill(list, function (item, index) {


            var href = Url.addQueryString('', {
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
        
    });



    return panel.wrap();



});